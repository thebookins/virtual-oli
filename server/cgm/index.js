const events = require('events');

module.exports = (t1d) => {
  const eventEmitter = new events.EventEmitter();

  setInterval(() => {
    eventEmitter.emit('glucose', t1d.sense());
  }, 1000);

  return {
    on: (message, callback) => eventEmitter.on(message, callback),
  };
};
