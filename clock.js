// TODO: add logic for dropped update (i.e. during dyno restart)
var cron = require('node-cron');

var q = 'tasks';
var url = process.env.CLOUDAMQP_URL || "amqp://localhost";
var open = require('amqplib').connect(url);

cron.schedule('*/5 * * * *', () => {
  console.log('running a task every five minutes');
  // Publisher
  open.then(function(conn) {
    var ok = conn.createChannel();
    ok = ok.then(function(ch) {
      ch.assertQueue(q);
      ch.sendToQueue(q, new Buffer(Date.now().toString()));
    });
    return ok;
  }).then(null, console.warn);
});

// var q = 'tasks';
//
//
// // Consumer
// open.then(function(conn) {
//   var ok = conn.createChannel();
//   ok = ok.then(function(ch) {
//     ch.assertQueue(q);
//     ch.consume(q, function(msg) {
//       if (msg !== null) {
//         console.log(msg.content.toString());
//         ch.ack(msg);
//       }
//     });
//   });
//   return ok;
// }).then(null, console.warn);
//
// // Publisher
// open.then(function(conn) {
//   var ok = conn.createChannel();
//   ok = ok.then(function(ch) {
//     ch.assertQueue(q);
//     ch.sendToQueue(q, new Buffer('something to do'));
//   });
//   return ok;
// }).then(null, console.warn);
