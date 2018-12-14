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
var server;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");

  db.collection('status').update({}, {$inc: {reservoir: 10}}, {upsert: true});

  // Initialize the app.
  server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

const io = socketIO(server);
const MEALS = [
  { date: new Date(), value: 6 },
  { date: new Date(), carbs: 5 }
];

// t1d
const t1d = require('./sim/t1d')();

// cgm
const cgm = require('./sim/cgm')();
const cgmAPI = require('./sim/cgm/io')(io, cgm);

// pump
const pump = require('./sim/pump')();
const pumpAPI = require('./sim/pump/io')(io, pump, db);

// hook up t1d, pump and cgm
t1d.attachPump(pump);
t1d.attachCGM(cgm);

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

  t1d.eat(newMeal);
  res.status(201).json(newMeal);
});


/*  "/api/cgm"
 *    GET: returns the last three hours of glucose
 */

// CGM endpoints
app.get('/api/cgm', cgmAPI.latest);

// pump endpoints
app.get('/api/pump', pumpAPI.history);
app.post('/api/pump', pumpAPI.post);
app.get('/api/pump/status', pumpAPI.status);
// app.get('/api/pump/history', ???)
// app.get('/api/pump/basal', ???)
// app.post('/api/pump/basal', ???)
// app.post('/api/pump/temp')
//
// app.post('bolus', ???)
