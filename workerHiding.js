const MongoClient = require('mongodb').MongoClient;
const AMQPClient = require('amqplib');

// TODO: roll this interface into marjorie
const t1d = require('./sim/t1d2');
const pump = require('./sim/pump');
const cgm = require('./sim/cgm2');


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
      ch.assertQueue('t1d');
      ch.assertQueue('pump');
      ch.assertQueue('cgm');
      ch.assertQueue('server');
      return ch;
    });
};

Promise.all([connectToDB(), connectToAMQP()])
  .then(responses => {
    const [db, ch] = responses;
    run(db, ch);
  })
  .catch(err => {
    console.log(err);
    process.exit(1);
  });

async function run(db, ch) {
  const deliver = units => {
    ch.sendToQueue('t1d', new Buffer({'action': 'deliver', 'units': units}));
  };

  // the t1d queue
  ch.consume('t1d', msg => {
    ch.ack(msg);

    const command = JSON.parse(msg.content);
    console.log(`******* received t1d command to ${command.type} *********`);

    db.collection('t1d').findOne({})
      // TODO: we are just updating here, other actions to follow
      .then(state => t1d(state, 'update'))
      .then(state => {
        db.collection('t1d').updateOne({}, { $set: state }, {upsert: true});
        // TODO: the server doesn't know that this is t1d state
        ch.sendToQueue('server', new Buffer(JSON.stringify(state)));
      });
  });

  ch.consume('pump', msg => {
    ch.ack(msg);

    const command = JSON.parse(msg.content);
    console.log(`******* received pump command to ${command.type} *********`);

    db.collection('pump').findOne({})
      .then(state => pump(state, 'update'))
      .then(state => {
        db.collection('pump').updateOne({}, { $set: state }, {upsert: true});
        // TODO: the server doesn't know that this is t1d state
        ch.sendToQueue('server', new Buffer(JSON.stringify(state)));
      });
  });

  ch.consume('cgm', msg => {
    ch.ack(msg);

    const command = JSON.parse(msg.content);
    console.log(`******* received pump command to ${command.type} *********`);
  });
}

// async function init(db, ch) {
//   // load t1d
//
//   pump.on('history', event => {
//     console.log(`received event: ${JSON.stringify(event)}`)
//     db.collection('history').insertOne({
//       // TODO: should this be pump date instead?
//       // if so, what to do with pump clock changes?
//       // also, datestamp is a silly name
//       datestamp: new Date(),
//       ...event,
//     });
//   });
//
//
//   const cgm = CGM();
//   cgm.on('glucose', event => {
//     console.log(`received glucose event: ${JSON.stringify(event)}`)
//     const readDate = new Date();
//     db.collection('cgms').updateOne({ 'id': 'ABCDEF' }, {$set: { readDate, 'glucose': event }}, {upsert: true});
//     db.collection('cgm').insertOne({ readDate, glucose: event });
//     ch.sendToQueue('cgm', new Buffer(JSON.stringify({ readDate, 'glucose': event })));
//   });
//
//   // TODO: add a status event for cgm and save the battery and clock
//   // for reanimation
//
//   t1d.attachPump(pump);
//   t1d.attachCGM(cgm);
//
//   // TODO: have a pump queue, t1d queue and cgm queue with
//   // the calling code within
//
//   // SOMETHING LIKE THIS:
//   ch.consume('pump', msg => {
//     ch.ack(msg);
//     const { action, args } = JSON.parse(msg.content);
//
//     const state = await db.collection('pump').findOne({})
//       .then(state => {
//         pump(state, action, args);
//         // TODO: reconstitute t1d and
//         // let it receive, something like
// //        pump(state, action, args)(t1d.bolus);
//       });
//
//     db.collection('pump').updateOne({}, { $set: state }, {upsert: true});
//     // TODO: make this a 'server' queue?
//     ch.sendToQueue('pump', new Buffer(JSON.stringify(event)));
//   });
//
//   ch.consume('work', msg => {
//     ch.ack(msg);
//
//     const command = JSON.parse(msg.content);
//
//     console.log(`******* received command to ${command.type} *********`);
//
//     switch(command.type) {
//       case 'update':
//         console.log('***** we are updating ******')
//         t1d.step();
//         pump.step();
//         cgm.step();
//         break;
//       case 'eat':
//         console.log('***** we are eating ******')
//         // TODO: use the real carbs
//         t1d.eat( { carbs: 99 } );
//         break;
//       case 'bolus':
//         pump.bolus(command.dose);
//         break;
//       case 'reset':
//         console.log('resetting');
//         // TODO: first, update the model
//         pump.reset();
//         // TODO: then, save the pump state
//         break;
//       case 'setTempBasal':
//         console.log(`settingTempBasal of ${command.dose} for ${command.duration} minutes.`);
//         // TODO: first, update the model
//         // TODO: promisify this
//         pump.basal.setTemp(command.dose, command.duration);
//         // TODO: then, save the pump state
//         db.collection('history').insertOne({
//           datestamp: new Date(),
//           type: 'temp basal',
//           rate: command.dose,
//           duration: command.duration,
//         });
//         break;
//       default:
//         console.log(`received unknown command: ${command.type}`);
//     }
//
//
//   });
// }
