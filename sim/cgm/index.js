const events = require('events');

module.exports = () => {
  const eventEmitter = new events.EventEmitter();
  const everyFiveMinutes = 5 * 60 * 1000;
  const latestGlucose = {
    readDate: new Date(0),
    glucose: null
  };

  let read = () => 0;

  setInterval(() => {
    latestGlucose.readDate = new Date(),
    latestGlucose.glucose = read();
//    eventEmitter.emit('glucose', read());
  }, everyFiveMinutes);

  const api = {
    on: (message, callback) => eventEmitter.on(message, callback),
    set read(fn) {
      read = fn;
    },
    get glucose() {
      return latestGlucose;
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
