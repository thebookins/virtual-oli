var express = require("express");
var bodyParser = require("body-parser");
const socketIO = require('socket.io');

var app = express();
app.use(bodyParser.json());

// Create link to Angular build directory
var distDir = __dirname + "/dist/virtual-oli/";
app.use(express.static(distDir));

// Initialize the app.
var server = app.listen(process.env.PORT || 8080, function () {
  var port = server.address().port;
  console.log("App now running on port", port);
});

const io = socketIO(server);
const MEALS = [
  { date: new Date(), value: 6 },
  { date: new Date(), carbs: 5 }
];

const GLUCOSE = [];
const now = new Date().getTime();
for (let minsAgo = 0; minsAgo < 180; minsAgo += 5) {
  GLUCOSE.push({
    readDate: new Date(now - minsAgo * 60 * 1000),
    glucose: 6
  });
}

// t1d
const t1d = require('./sim/t1d')();

// cgm
const cgm = require('./sim/cgm')(t1d);
require('./sim/cgmIO')(io, cgm);

// pump
const pump = require('./sim/pump')(t1d);
require('./sim/pumpIO')(io, pump);

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
});

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);



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

  t1d.eat(newMeal.carbs);
  res.status(201).json(newMeal);
});


/*  "/api/glucose"
 *    GET: returns the last three hours of glucose
 */

app.get("/api/glucose", function(req, res) {
  res.status(200).json(GLUCOSE);
});
