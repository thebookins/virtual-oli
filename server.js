var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

const socketIO = require('socket.io');

var app = express();
app.use(bodyParser.json());

// Create link to Angular build directory
var distDir = __dirname + "/dist/virtual-oli/";
app.use(express.static(distDir));

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server.
// TODO: try async / await here
mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, client) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = client.db();
  console.log("Database connection ready");

  db.collection('status').update({}, {$inc: {reservoir: 10}}, {upsert: true});

  // Initialize the app.
  const server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });


  const io = socketIO(server);
  const MEALS = [
    { date: new Date(), value: 6 },
    { date: new Date(), carbs: 5 }
  ];

  // // t1d
  // const t1d = require('./sim/t1d')();

  // // cgm
  // const cgm = require('./sim/cgm')(db);
  // const cgmAPI = require('./sim/cgm/io')(io, cgm);
  //
  // // pump
  // const pump = require('./sim/pump')();
  // const pumpAPI = require('./sim/pump/io')(io, pump, db);

  // // hook up t1d, pump and cgm
  // t1d.attachPump(pump);
  // t1d.attachCGM(cgm);

  io.on('connection', (socket) => {
    console.log('Client connected');
    socket.on('disconnect', () => console.log('Client disconnected'));
  });

  setInterval(() => io.emit('time', new Date().toTimeString()), 1000);

  //setTimeout(() => t1d.addPump(pump), 6000);


  /*  "/api/meals"
   *    GET: finds all meals
   *    POST: adds a new meal
   */

  app.get("/api/meals", function(req, res) {
    res.status(200).json(MEALS);
  });

  app.post("/api/meals", function(req, res) {
    var newMeal = req.body;

    if (!req.body.carbs) {
      handleError(res, "Invalid user input", "Must provide carbs.", 400);
    }

    // t1d.eat(newMeal);
    res.status(201).json(newMeal);
  });


  // NOTE: queue stuff: destined for a worker process - here now to save money!!!
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

  var glucose;

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


  /*  "/api/cgm"
   *    GET: returns the last three hours of glucose
   */

  // CGM endpoints
  // app.get('/api/cgm', cgmAPI.latest);
  app.get('/api/cgm', function(req, res) {
    res.json(glucose);
  });

  //
  // // pump endpoints
  // app.get('/api/pump', pumpAPI.history);
  app.get('/api/pump', function(req, res) {
    res.json([]);
  });
  // app.post('/api/pump', pumpAPI.post);
  // app.get('/api/pump/status', pumpAPI.status);
  app.get('/api/pump/status', function(req, res) {
    const status = {
      // clock,
      // batteryVolts,
      // batteryStatus,
      suspended: false,
      bolusing: false,
      reservoir: 80.5,
      // model,
      // pumpID
    }
    res.json(status);
  },
);
  // app.get('/api/pump/history', ???)
  // app.get('/api/pump/basal', ???)
  // app.post('/api/pump/basal', ???)
  // app.post('/api/pump/temp')
  //
  // app.post('bolus', ???)
});
