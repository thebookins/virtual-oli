var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// TODO: try async / await here
mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, client) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = client.db();
  console.log("Database connection ready");

  // t1d
  // TODO: this constructor will load a new t1d from the database
  const t1d = require('./sim/t1d')(db);

  // cgm
  // TODO: this constructor will load a new cgm from the database
  const cgm = require('./sim/cgm')(db);

  // pump
  // TODO: this construcor will load a new pump from the database
  const pump = require('./sim/pump')(db);

  // hook up t1d, pump and cgm
  t1d.attachPump(pump);
  t1d.attachCGM(cgm);

  // TODO: implement step functions for pump, t1d and cgm
  // step() will deal with any pending commands (bolus, temp basal, suspends etc),
  // bring the state up to the current time, and save the state back to the db
  pump.step();
  t1d.step();
  cgm.step();

  // ALTERNATIVELY:
  // pump.step();
  // t1d.step(pump.insulin)
  // cgm.step(t1d.glucose)
});


// NOTES:
// The worker needs to step the cgm every 5 minutes only. It will get the glucose
// from the t1d, save the reading to the db and send an APN. It will also update
// the pump and the 1td.

// The t1d and the pump may need to be updated at unspecified intervals.
