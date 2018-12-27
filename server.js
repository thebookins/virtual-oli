const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const q = 'tasks';

const url = process.env.CLOUDAMQP_URL || "amqp://localhost";
const open = require('amqplib').connect(url);

let ch;

open.then(function(conn) {
  var ok = conn.createChannel();
  ok = ok.then(function(c) {
    c.assertQueue(q);
    ch = c;
  });
  return ok;
}).then(null, console.warn);

// TODO: this will eventually run in its own process;
// no need to require here
const worker = require('./worker');

const socketIO = require('socket.io');

const app = express();
app.use(bodyParser.json());

// Create link to Angular build directory
const distDir = __dirname + '/dist/virtual-oli/';
app.use(express.static(distDir));

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
let db;

// Connect to the database before starting the application server.
MongoClient.connect(process.env.MONGODB_URI, function (err, client) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = client.db();
  console.log("Database connection ready");

  // NOTE: THIS SHOULD BE DELETED; JUST FOR TESTING
  db.collection('status').update({}, {$inc: {reservoir: 10}}, {upsert: true});

  // Initialize the app.
  const server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

// const io = socketIO(server);

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

// io.on('connection', (socket) => {
//   console.log('Client connected');
//   socket.on('disconnect', () => console.log('Client disconnected'));
// });

// setInterval(() => io.emit('time', new Date().toTimeString()), 1000);

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
  ch.sendToQueue(q, new Buffer(JSON.stringify({type: 'eat'})));
  res.status(201).json(newMeal);
});

/*  "/api/cgm"
 *    GET: returns the last three hours of glucose
 */

// CGM endpoints
// app.get('/api/cgm', cgmAPI.latest);
app.get('/api/cgm', function(req, res) {
  db.collection('cgms').findOne({ 'id': 'ABCDEF' }, function(err, doc) {
    if (err) {
      console.log('Failed to get glucose');
    } else {
      res.status(200).json(doc);
    }
  });
});

//
// // pump endpoints
// app.get('/api/pump', pumpAPI.history);
app.get('/api/pump', function(req, res) {
  db.collection('history').find({}).toArray(function(err, docs) {
    if (err) {
      console.log('Failed to get pump history');
    } else {
      res.status(200).json(docs);
    }
  });
});

app.post('/api/pump', function(req, res) {
  var command = req.body;

  // TODO: validation
  // if (!req.body.carbs) {
  //   handleError(res, "Invalid user input", "Must provide carbs.", 400);
  // }

  // TODO: give the pump its own queue
  // TODO: actually use the payload
  ch.sendToQueue(q, new Buffer(JSON.stringify(command)));
  res.status(201).json(command);
});

// app.get('/api/pump/status', pumpAPI.status);
app.get('/api/pump/status', function(req, res) {
  db.collection('pump').findOne({}, function(err, doc) {
    if (err) {
      console.log('Failed to get pump');
    } else {
      res.status(200).json(doc);
    }
  });
});

// app.get('/api/pump/basal', ???)
// app.post('/api/pump/basal', ???)

  // app.get('/api/pump/history', ???)
  // app.post('/api/pump/temp')
  //
