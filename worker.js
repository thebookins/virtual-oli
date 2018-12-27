const MongoClient = require('mongodb').MongoClient;

const q = 'tasks';
const url = process.env.CLOUDAMQP_URL || "amqp://localhost";
const open = require('amqplib').connect(url);
const apn = require('apn');
const Pump = require('./sim/pump');

// TODO: not sure if we can keep a persistent reference here:
// what if another dyno is running?
const T1d = require('./sim/t1d');

const options = {
  token: {
    key: __dirname + "/sim/cgm/AuthKey_23NRN4PHVP.p8",
    keyId: "23NRN4PHVP",
    teamId: "8ZWMLSD6JG"
  },
  production: false
};

const deviceToken = "c31ce3c0585db5744839accc7c6a6d42eb7649d0b9608b8df1757be077947240"

const apnProvider = new apn.Provider(options);

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
let db;
let t1d;
let pump;


MongoClient.connect(process.env.MONGODB_URI, function (err, client) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = client.db();
  console.log("Database connection ready");

  // load t1d
  let state = {};
  db.collection('t1d').findOne({}, function(err, doc) {
    if (err) {
      console.log('Failed to get t1d');
    } else {
      console.log('Got t1d from db');
      state = doc;
    }
    t1d = T1d(state);
  });


  state = {};
  db.collection('pump').findOne({}, function(err, doc) {
    if (err) {
      console.log('Failed to get pump');
    } else {
      console.log('Got pump from db');
      state = doc;
    }
    pump = Pump(state);

    // hook them up
    t1d.attachPump(pump);
  });
});

function sendAPN() {
  var note = new apn.Notification();
  note.contentAvailable = 1;
  note.topic = "com.8ZWMLSD6JG.loopkit.Loop"
  apnProvider.send(note, deviceToken).then( (result) => {
    console.log(JSON.stringify(result));
  });
}

function update(timestamp) {
  for (let n = 0; n < 5; n+=1) {
    t1d.step();
    pump.step();
  }
  db.collection('t1d').update({}, t1d.state, {upsert: true});

  db.collection('pump').update({}, pump.state, {upsert: true});

  // TODO: this collection needs to be created somewhere
  db.collection('cgms').update({'id': 'ABCDEF'}, {$set: { 'readDate': new Date(), 'glucose': t1d.glucose }}, {upsert: true});
  db.collection('cgm').insertOne({readDate: new Date(timestamp), glucose: 6.0}, function(err, doc) {
    if (err) {
      console.log(`Failed to insert glucose: ${err}.`);
    }
    sendAPN();
  });
}

// Consumer
open.then(function(conn) {
  var ok = conn.createChannel();
  ok = ok.then(function(ch) {
    ch.assertQueue(q);
    ch.consume(q, function(msg) {
      if (msg !== null) {
        ch.ack(msg);
        console.log(`received message: ${msg.content.toString()}`);
        const command = JSON.parse(msg.content);


        // MY CODE here
        switch(command.type) {
          case 'eat':
            console.log('eating');
            // TODO: update model before and save state after eating
            t1d.eat( { carbs: 100 } );
            break;
          case 'bolus':
            console.log('bolusing');
            // TODO: first, update the model
            pump.bolus(command.dose)
            // TODO: then, save the pump state
            .then(b => {
              db.collection('history').insertOne({datestamp: new Date(), type: 'bolus', dose: b});
            });
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
            pump.setTempBasal(command.dose, command.duration);
            // TODO: then, save the pump state
            db.collection('history').insertOne({
              datestamp: new Date(),
              type: 'temp basal',
              rate: command.dose,
              duration: command.duration,
            });
            break;
          default:
            update(parseFloat(msg.content.toString()));
        }
        // MY CODE here

      }
    });
  });
  return ok;
}).then(null, console.warn);

// NOTES:
// The worker needs to step the cgm every 5 minutes only. It will get the glucose
// from the t1d, save the reading to the db and send an APN. It will also update
// the pump and the 1td.

// The t1d and the pump may need to be updated at unspecified intervals.
