var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var q = 'tasks';
var url = process.env.CLOUDAMQP_URL || "amqp://localhost";
var open = require('amqplib').connect(url);
var apn = require('apn');

const options = {
  token: {
    key: __dirname + "/sim/cgm/AuthKey_23NRN4PHVP.p8",
    keyId: "23NRN4PHVP",
    teamId: "8ZWMLSD6JG"
  },
  production: false
};

const apnProvider = new apn.Provider(options);



// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;


// // TODO: try async / await here
// mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, client) {
//   if (err) {
//     console.log(err);
//     process.exit(1);
//   }
//
//   // Save database object from the callback for reuse.
//   db = client.db();
//   console.log("Database connection ready");
//
//
//   // TODO: implement step functions for pump, t1d and cgm
//   // step() will deal with any pending commands (bolus, temp basal, suspends etc),
//   // bring the state up to the current time, and save the state back to the db
//   pump.step();
//   t1d.step();
//   cgm.step();
//
//   // ALTERNATIVELY:
//   // pump.step();
//   // t1d.step(pump.insulin)
//   // cgm.step(t1d.glucose)
// });

let glucose;

// Consumer
open.then(function(conn) {
  var ok = conn.createChannel();
  ok = ok.then(function(ch) {
    ch.assertQueue(q);
    ch.consume(q, function(msg) {
      if (msg !== null) {
        console.log(`received message: ${msg.content.toString()}`);
        ch.ack(msg);

        glucose = {
          readDate: new Date(),
          glucose: 6.0
        }

        let deviceToken = "c31ce3c0585db5744839accc7c6a6d42eb7649d0b9608b8df1757be077947240"

        var note = new apn.Notification();
        note.contentAvailable = 1;
        // NOTE: probably not necessary to set this field...
        // note.sound = "";
        note.topic = "com.8ZWMLSD6JG.loopkit.Loop"

        apnProvider.send(note, deviceToken).then( (result) => {
          console.log(JSON.stringify(result));
          // see documentation for an explanation of result
        });

      }
    });
  });
  return ok;
}).then(null, console.warn);

module.exports = {
  get glucose() {
    return glucose;
  }
}
// NOTES:
// The worker needs to step the cgm every 5 minutes only. It will get the glucose
// from the t1d, save the reading to the db and send an APN. It will also update
// the pump and the 1td.

// The t1d and the pump may need to be updated at unspecified intervals.
