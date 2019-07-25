// list of endpoints:
//
// /api/cgm: glucose history (http), latest glucose (socket)
//
// /api/pump: pump history (http)

// TODO: move all the amqplib stuff out of here and put in cgm, pump and t1d files

const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const socketIO = require('socket.io');

const app = express();
app.use(bodyParser.json());

// Create link to Angular build directory
const distDir = __dirname + '/../dist/';
app.use(express.static(distDir));

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
let db;

// Connect to the database before starting the application server.
MongoClient.connect(process.env.MONGODB_URI)
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
  const io = socketIO(server);

  io.on('connection', (socket) => {
    console.log('Client connected');
    socket.on('disconnect', () => console.log('Client disconnected'));
  });

//   const pumpNsp = io.of('/pump');

  const cgmRoutes = require('./cgm')(db);
  app.use('/api/cgm', cgmRoutes);

  const pumpRoutes = require('./pump')(db);
  app.use('/api/pump', pumpRoutes);

  const t1dRoutes = require('./t1d')(db);
  app.use('/api/t1d', t1dRoutes);

  // ANGULAR DEFAULT ENDPOINT
  app.get('/*', function(req, res) {
    // return res.sendFile(distDir + 'index.htmly');
    return res.sendFile('index.html', {root: distDir});
  });
}
