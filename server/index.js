var express = require("express");
var bodyParser = require("body-parser");
const socketIO = require('socket.io');

var app = express();
app.use(bodyParser.json());

// Create link to Angular build directory
var distDir = __dirname + "/dist/virtual-oli";
app.use(express.static(distDir));

// Initialize the app.
var server = app.listen(process.env.PORT || 8080, function () {
  var port = server.address().port;
  console.log("App now running on port", port);
});

const io = socketIO(server);
const MEALS = [
  { date: new Date(), carbs: 100 },
  { date: new Date(), carbs: 50 }
];

// t1d
const t1d = require('./t1d')();

// cgm
const cgm = require('./cgm')(t1d);
require('./cgmIO')(io, cgm);

// pump
const pump = require('./pump')(t1d);
require('./pumpIO')(io, pump);

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
