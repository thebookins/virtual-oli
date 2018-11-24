const events = require('events');

module.exports = (t1d) => {
  const eventEmitter = new events.EventEmitter();

  setInterval(() => {
    console.log(`emitteing glucose: ${t1d.sense()}`)
    eventEmitter.emit('glucose', t1d.sense());
  }, 1000);

  return {
    on: (message, callback) => eventEmitter.on(message, callback),
  };
};
