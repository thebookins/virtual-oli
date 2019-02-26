const PWD = require('marjorie').PWD;
const events = require('events');

module.exports = (state = undefined) => {
 const model = PWD(1, state);
 const eventEmitter = new events.EventEmitter();

 let insulinPending_mU = 0;
 let cgm = null;

  return {
    // API (public) functions
    step: () => {
      model.step(insulinPending_mU);
      insulinPending_mU = 0;
      eventEmitter.emit('status', model.state);
    },
    eat: (meal) => {
      model.eat(meal.carbs);
      eventEmitter.emit('status', model.state);
    },
    dose: (units) => {
      // iob += units;
    },
    // NOTE: here we are attaching a function to the pump object
    // could be a bit of a convoluted architecture
    // not sure
    attachPump: (pump) => {
      pump.receiver = (insulin) => {
        insulinPending_mU += insulin;
      };
    },
    removePump: (pump) => {
      pump.receiver = null;
    },
    get glucose() {
      return model.glucose;
    },
    // get state() {
    //   console.log(`state: ${model.state}`)
    //   return model.state;
    // },
    attachCGM(cgm) {
      cgm.read = () => model.glucose;
    },
    removeCGM: (cgm) => {
      // TODO: implement
    },
    on: (message, callback) => eventEmitter.on(message, callback),
  };
}
