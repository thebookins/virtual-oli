// list of endpoints:
//
// /api/cgm: glucose history (http), latest glucose (socket)
//
// /api/pump: pump history (http)

// TODO: move all the amqplib stuff out of here and put in cgm, pump and t1d files

const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;

// TODO: maybe define these in worker only???
const t1d = require('./sim/t1d2');
const pump = require('./sim/pump');

let Queue = require('bull');
// Connect to a local redis instance locally, and the Heroku-provided URL in production
let REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";


// const socketIO = require('socket.io');

const app = express();
app.use(bodyParser.json());

// Create link to Angular build directory
const distDir = __dirname + '/dist/';
app.use(express.static(distDir));

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
let db;

// Connect to the database before starting the application server.
MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
.then(client => {
  // Save database object from the callback for reuse.
  db = client.db();
  console.log("Database connection ready");
  // Initialize the app.
  init(db);
})
.catch(err => {
  console.log(err);
  process.exit(1);
});

function init(db) {
  const server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });

  let workQueue = new Queue('work', REDIS_URL);

  // const io = socketIO(server);

  // io.on('connection', (socket) => {
  //   console.log('Client connected');
  //   socket.on('disconnect', () => console.log('Client disconnected'));
  // });

//   const pumpNsp = io.of('/pump');

/*  "/api/people"
 *    GET: finds all people
 *    POST: creates a new person
 */

app.get('/api/people', function(req, res) {
  db.collection('people').find({}).toArray(function(err, docs) {
    if (err) {
      console.log('Failed to get people');
    } else {
      res.status(200).json(docs);
    }
  });
});

app.post('/api/people', function(req, res) {
  // TODO: implement
});

/*  "/api/people/:id"
 *    GET: find person by id
 *    PUT: update person by id (not yet implemented)
 *    POST: send an action to the person (e.g. eat, dose)
 *    DELETE: delete person by id
 */

app.get("/api/people/:id", function(req, res) {
  db.collection('people').findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get person");
    } else {
      res.status(200).json(doc);
    }
  });
});

app.put("/api/people/:id", function(req, res) {
  // TODO: implement
});

app.post("/api/people/:id", function(req, res) {
  // TODO: implement
});

app.delete("/api/people/:id", function(req, res) {
  // TODO: implement
});

/*  "/api/pumps"
 *    GET: finds all pumps for person by person_id
 *    POST: creates a new pump
 */

app.get("/api/pumps", function(req, res) {
  db.collection('pumps').find({
    person_id: new ObjectID(req.query.person_id)
  }).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get pumps");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.post("/api/pumps", function(req, res) {
  // TODO: implement
});

/*  "/api/pumps/:id"
 *    GET: find pump by id
 *    POST: send an action to the pump (e.g. bolus, suspend)
 *    DELETE: delete pump by id
 */

app.get("/api/pumps/:id", function(req, res) {
  // TODO: implement
});

app.post("/api/pumps/:id", async function(req, res) {
  var newEvent = req.body;

  // TODO: match type to action, get amount from request
  if (!req.body.type) {
    handleError(res, "Invalid user input", "Must provide an event type.", 400);
  }

  // TODO: consider farming this out to the worker
  // that way we keep all the logic in one place

  console.log(`finding pump with id ${req.params.id}`)
  await db.collection('pumps').findOne({ _id: new ObjectID(req.params.id) })
  .then(doc => {
    console.log(doc);
    const dose = insulin => {
      db.collection('people').findOne({_id: doc.person_id})
      .then(person => {
        console.log(JSON.stringify(person));
        const updatedState = t1d(person.state, 'dose', insulin * 1000);
        db.collection('people').updateOne({_id: person._id}, {$set: {state: updatedState}});
      });
    };
    const updatedState = pump(doc.state, 'bolus', 1, dose);
    db.collection('pumps').updateOne({_id: doc._id}, {$set: {state: updatedState}});
  });

  await db.collection('pump-events').insertOne(newEvent, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new event.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});



app.get("/api/cgms", function(req, res) {
  db.collection('cgms').find({
    person_id: new ObjectID(req.query.person_id)
  }).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get cgms");
    } else {
      res.status(200).json(docs);
    }
  });
});


  // ANGULAR DEFAULT ENDPOINT
  app.get('/*', function(req, res) {
    return res.sendFile('index.html', {root: distDir});
  });
}
