var express = require('express'),
    router = express.Router();

module.exports = (db) => router.get('/status', function(req, res) {
  db.collection('t1d').findOne({}, function(err, doc) {
    if (err) {
      console.log('Failed to get t1d');
    } else {
      res.status(200).json(doc);
    }
  });
});

//   const t1dNsp = io.of('/api/t1d/status');

//
//   open.then(function(conn) {
//     var ok = conn.createChannel();
//     ok = ok.then(function(c) {
//
//       c.assertQueue(q);
//       ch = c;
//
//       ch.assertQueue('t1d');
//       ch.consume('t1d', function(msg) {
//         if (msg !== null) {
//           console.log(msg.content.toString());
//           const status = JSON.parse(msg.content);
//           t1dNsp.emit('status', status);
//           ch.ack(msg);
//         }
//       });

//     return ok;
//   }).then(null, console.warn);
//
