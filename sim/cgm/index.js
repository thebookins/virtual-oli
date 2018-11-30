const events = require('events');

module.exports = () => {
  const eventEmitter = new events.EventEmitter();
  const everyFiveMinutes = 5 * 60 * 1000;

  let read = () => 0;

  setInterval(() => {
    console.log(`emitting glucose of ${read()}`)
    eventEmitter.emit('glucose', read());
  }, 1000);

  const api = {
    on: (message, callback) => eventEmitter.on(message, callback),
    set read(fn) {
      read = fn;
    }
  };

  return api;
}

// NOTE: the old one
//
// module.exports = (t1d) => {
//   const eventEmitter = new events.EventEmitter();
//   const history = []
//
//   setInterval(() => {
//     const glucose = t1d.sense();
//     history.unshift({
//       readDate: new Date(),
//       glucose
//     });
//     if (history.length > 36) {
//       history.pop();
//     }
//     eventEmitter.emit('glucose', glucose);
//   }, 5 * 60 * 1000); // every 5 minutes
//
//   return {
//     on: (message, callback) => eventEmitter.on(message, callback),
//     get history() {
//       return history;
//     },
//   };
// };
