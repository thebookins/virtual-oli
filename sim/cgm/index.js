const events = require('events');

module.exports = (t1d) => {
  const eventEmitter = new events.EventEmitter();
  const history = []

  setInterval(() => {
    const glucose = t1d.sense();
    history.unshift({
      readDate: new Date(),
      glucose
    });
    if (history.length > 36) {
      history.pop();
    }
    eventEmitter.emit('glucose', glucose);
  }, 5 * 60 * 1000); // every 5 minutes

  return {
    on: (message, callback) => eventEmitter.on(message, callback),
    get history() {
      return history;
    },
  };
};
