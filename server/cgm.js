// https://stackoverflow.com/questions/6059246/how-to-include-route-handlers-in-multiple-files-in-express/37309212#37309212

var express = require('express'),
    router = express.Router();

module.exports = (db) => router.get('/', function(req, res) {
  db.collection('cgm').find({}).toArray(function(err, docs) {
    if (err) {
      console.log('Failed to get glucose history');
    } else {
      res.status(200).json(docs);
    }
  });
});



//   /*  "/api/cgm"
//    *    GET: returns the last three hours of glucose
//    */
//
//   // CGM endpoints
//   // app.get('/api/cgm', cgmAPI.latest);
//   app.get('/api/cgm', function(req, res) {
//     db.collection('cgms').findOne({ 'id': 'ABCDEF' }, function(err, doc) {
//       if (err) {
//         console.log('Failed to get glucose');
//       } else {
//         res.status(200).json(doc);
//       }
//     });
//   });
//
//   // CGM endpoints
//   // app.get('/api/cgm', cgmAPI.latest);\
//   // TODO: change this API name (make it part of CGM)
  // app.get('/api/cgm', function(req, res) {
  //   db.collection('cgm').find({}).toArray(function(err, docs) {
  //     if (err) {
  //       console.log('Failed to get glucose history');
  //     } else {
  //       res.status(200).json(docs);
  //     }
  //   });
  // });
//   //

//
//   open.then(function(conn) {
//     var ok = conn.createChannel();
//     ok = ok.then(function(c) {
//
//       c.assertQueue('work');
//       ch = c;
////

//       ch.assertQueue('cgm');
//       ch.consume('cgm', function(msg) {
//         if (msg !== null) {
//           console.log(msg.content.toString());
//           const glucose = JSON.parse(msg.content);
//           cgmNsp.emit('glucose', glucose);
//           ch.ack(msg);
//         }
//       });
//     });
//
//     return ok;
//   }).then(null, console.warn);
//

// const cgmNsp = io.of('/cgm');
// setTimeout(() => {
//   cgmNsp.emit('glucose', {
//     readDate: Date(),
//     glucose: 100
//   });
// }, 1000);
