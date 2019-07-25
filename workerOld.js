// NOTES:
// The worker needs to step the cgm every 5 minutes only. It will get the glucose
// from the t1d, save the reading to the db and send an APN. It will also update
// the pump and the 1td.

// The t1d and the pump may need to be updated at unspecified intervals.

const MongoClient = require('mongodb').MongoClient;
const AMQPClient = require('amqplib');

// TODO: roll this interface into marjorie?
const T1d = require('./sim/t1d');
const Pump = require('marjorie').Pump;
const CGM = require('marjorie').CGM;

const connectToDB = () => {
  return MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
    .then(client => {
      return client.db();
    });
};

const connectToAMQP = () => {
  return AMQPClient.connect(process.env.CLOUDAMQP_URL)
    .then(conn => conn.createChannel())
    .then(ch => {
      ch.assertQueue('work');
      return ch;
    });
};

Promise.all([connectToDB(), connectToAMQP()])
  .then(responses => {
    const [db, ch] = responses;
    init(db, ch);
  })
  .catch(err => {
    console.log(err);
    process.exit(1);
  });

async function init(db, ch) {
  // load t1d
  const t1d = await db.collection('t1d').findOne({})
    .then(state => T1d(state || undefined));

  t1d.on('status', state => {
    console.log(`received event: ${JSON.stringify(state)}`)
    db.collection('t1d').updateOne({}, { $set: state }, {upsert: true});
    ch.sendToQueue('t1d', new Buffer(JSON.stringify(state)));
  });

  const pump = await db.collection('pump').findOne({})
    .then(state => Pump(state));

  pump.on('history', event => {
    console.log(`received event: ${JSON.stringify(event)}`)
    db.collection('history').insertOne({
      // TODO: should this be pump date instead?
      // if so, what to do with pump clock changes?
      // also, datestamp is a silly name
      datestamp: new Date(),
      ...event,
    });
  });

  pump.on('status', event => {
    console.log(`received event: ${JSON.stringify(event)}`)
    db.collection('pump').updateOne({}, { $set: pump.state }, {upsert: true});
    ch.sendToQueue('pump', new Buffer(JSON.stringify(event)));
  });

  const cgm = CGM();
  cgm.on('glucose', event => {
    console.log(`received glucose event: ${JSON.stringify(event)}`)
    const readDate = new Date();
    db.collection('cgms').updateOne({ 'id': 'ABCDEF' }, {$set: { readDate, 'glucose': event }}, {upsert: true});
    db.collection('cgm').insertOne({ readDate, glucose: event });
    ch.sendToQueue('cgm', new Buffer(JSON.stringify({ readDate, 'glucose': event })));
  });

  // TODO: add a status event for cgm and save the battery and clock
  // for reanimation

  t1d.attachPump(pump);
  t1d.attachCGM(cgm);

  // TODO: have a pump queue, t1d queue and cgm queue with
  // the calling code within

  // SOMETHING LIKE THIS:
  ch.consume('pump', msg => {
    ch.ack(msg);
    const { action, args } = JSON.parse(msg.content);

    const state = await db.collection('pump').findOne({})
      .then(state => {
        pump(state, action, args);
        // TODO: reconstitute t1d and
        // let it receive, something like
//        pump(state, action, args)(t1d.bolus);
      });

    db.collection('pump').updateOne({}, { $set: state }, {upsert: true});
    // TODO: make this a 'server' queue?
    ch.sendToQueue('pump', new Buffer(JSON.stringify(event)));
  });

  ch.consume('work', msg => {
    ch.ack(msg);

    const command = JSON.parse(msg.content);

    console.log(`******* received command to ${command.type} *********`);

    switch(command.type) {
      case 'update':
        console.log('***** we are updating ******')
        t1d.step();
        pump.step();
        cgm.step();
        break;
      case 'eat':
        console.log('***** we are eating ******')
        // TODO: use the real carbs
        t1d.eat( { carbs: 99 } );
        break;
      case 'bolus':
        pump.bolus(command.dose);
        break;
      case 'reset':
        console.log('resetting');
        // TODO: first, update the model
        pump.reset();
        // TODO: then, save the pump state
        break;
      case 'setTempBasal':
        console.log(`settingTempBasal of ${command.dose} for ${command.duration} minutes.`);
        // TODO: first, update the model
        // TODO: promisify this
        pump.basal.setTemp(command.dose, command.duration);
        // TODO: then, save the pump state
        db.collection('history').insertOne({
          datestamp: new Date(),
          type: 'temp basal',
          rate: command.dose,
          duration: command.duration,
        });
        break;
      default:
        console.log(`received unknown command: ${command.type}`);
    }


  });
}

// const apn = require('apn');
//
// // TODO: not sure if we can keep a persistent reference here:
// // what if another dyno is running?
//
// const options = {
//   token: {
//     key: __dirname + "/sim/cgm/AuthKey_23NRN4PHVP.p8",
//     keyId: "23NRN4PHVP",
//     teamId: "8ZWMLSD6JG"
//   },
//   production: false
// };
//
// const deviceToken = "c31ce3c0585db5744839accc7c6a6d42eb7649d0b9608b8df1757be077947240"
//
// const apnProvider = new apn.Provider(options);
//
// function sendAPN() {
//   var note = new apn.Notification();
//   note.contentAvailable = 1;
//   note.topic = "com.8ZWMLSD6JG.loopkit.Loop"
//   apnProvider.send(note, deviceToken).then( (result) => {
//     console.log(JSON.stringify(result));
//   });
// }
//
// // TODO: this is susceptible to crashing if t1d or pump are undefined at this point in time
// // TODO: really should be an update to time function, in case of dyno downtime
// function update(timestamp) {
//   t1d.step();
//   pump.step();
//
//   // TODO: rather than update these here, have it driven by events
//   db.collection('t1d').update({}, t1d.state, {upsert: true});
//
//   db.collection('pump').update({}, pump.state, {upsert: true});
//
//   // TODO: this collection needs to be created somewhere
//   db.collection('cgms').update({'id': 'ABCDEF'}, {$set: { 'readDate': new Date(), 'glucose': t1d.glucose }}, {upsert: true});
//   db.collection('cgm').insertOne({readDate: new Date(timestamp), glucose: 6.0}, function(err, doc) {
//     if (err) {
//       console.log(`Failed to insert glucose: ${err}.`);
//     }
//     sendAPN();
//   });
// }
//
// var ch;
//
// // Consumer
// open.then(function(conn) {
//   var ok = conn.createChannel();
//   ok = ok.then(function(c) {
//     ch = c;
//     ch.assertQueue(q);
//     ch.assertQueue('pump');
//
//     // TODO: check if we need to do this
//     ch.consume(q, function(msg) {
//       if (msg !== null) {
//         ch.ack(msg);
//         console.log(`received message: ${msg.content.toString()}`);
//         const command = JSON.parse(msg.content);
//
//
//         // MY CODE here
//         switch(command.type) {
//           case 'bolus':
//             console.log('bolusing');
//             // TODO: first, update the model
//             pump.bolus(command.dose)
//             // TODO: then, save the pump state
//             .then(b => {
//               db.collection('history').insertOne({datestamp: new Date(), type: 'bolus', dose: b});
//             });
//             break;
//           case 'reset':
//             console.log('resetting');
//             // TODO: first, update the model
//             pump.reset();
//             // TODO: then, save the pump state
//             break;
//           case 'setTempBasal':
//             console.log(`settingTempBasal of ${command.dose} for ${command.duration} minutes.`);
//             // TODO: first, update the model
//             // TODO: promisify this
//             pump.basal.setTemp(command.dose, command.duration);
//             // TODO: then, save the pump state
//             db.collection('history').insertOne({
//               datestamp: new Date(),
//               type: 'temp basal',
//               rate: command.dose,
//               duration: command.duration,
//             });
//             break;
//           default:
//             update(parseFloat(msg.content.toString()));
//         }
//         // MY CODE here
//
//       }
//     });
//   });
//   return ok;
// }).then(null, console.warn);
