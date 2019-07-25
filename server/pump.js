const express = require('express');
const router = express.Router();

const Queue = require('bull');

// Serve on PORT on Heroku and on localhost:5000 locally
const PORT = process.env.PORT || '5000';
// Connect to a local redis intance locally, and the Heroku-provided URL in production
const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

//const url = process.env.CLOUDAMQP_URL || "amqp://localhost";
// const open = require('amqplib').connect(url);

module.exports = (db) => {
  const workQueue = new Queue('work', REDIS_URL);

  router.get('/', (req, res) => {
    console.log('in get')
    db.collection('history').find({}).toArray(function(err, docs) {
      if (err) {
        console.log('Failed to get pump history');
      } else {
        res.status(200).json(docs);
      }
    });
  });

  router.post('/', async (req, res) => {
    console.log('in post')
    var command = req.body;

    // TODO: validation
    // if (!req.body.carbs) {
    //   handleError(res, "Invalid user input", "Must provide carbs.", 400);
    // }

    // TODO: give the pump its own queue
    // TODO: actually use the payload
    console.log(`sending ${JSON.stringify(command)}`)
    let job = await workQueue.add(command);
    res.json({ id: job.id });
  });

  //   conn.createChannel().then(function(ch) {
  //     return ch.assertQueue('pump').then(function(ok) {
  //       ch.consume('pump', function(msg) {
  //         if (msg !== null) {
  //           console.log(msg.content.toString());
  //           const status = JSON.parse(msg.content);
  //           pumpNsp.emit('status', status);
  //           ch.ack(msg);
  //         }
  //       });
  //     })
  //   }).then(null, console.warn);
  // });

  return router;
};


//
//   // app.get('/api/pump/status', pumpAPI.status);
//   app.get('/api/pump/status', function(req, res) {
//     db.collection('pump').findOne({}, function(err, doc) {
//       if (err) {
//         console.log('Failed to get pump');
//       } else {
//         res.status(200).json(doc);
//       }
//     });
//   });

//
//   // app.get('/api/pump/basal', ???)
//   // app.post('/api/pump/basal', ???)
//
//     // app.get('/api/pump/history', ???)
//     // app.post('/api/pump/temp')
//     //
//
