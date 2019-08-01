// TODO: add logic for dropped update (i.e. during dyno restart)
var cron = require('node-cron');

const Queue = require('bull');


// var q = 'work';
// var url = process.env.CLOUDAMQP_URL || "amqp://localhost";
// var open = require('amqplib').connect(url);
const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

const workQueue = new Queue('work', REDIS_URL);



// let ch;

// open.then(function(conn) {
//   var ok = conn.createChannel();
//   ok = ok.then(function(c) {
//     c.assertQueue(q);
//     ch = c;
//   });
//   return ok;
// }).then(null, console.warn);

cron.schedule('* * * * *', async () => {
  console.log('running a task every minute');
  const command = {
    type: 'update',
    args: [Date.now().toString()]
  }
 let job = await workQueue.add(command);

//  ch.sendToQueue('t1d', new Buffer(JSON.stringify(command)));
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
