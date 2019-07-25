const PWD = require('marjorie').PWD;
const events = require('events');

module.exports = (state = undefined) => {
 const model = PWD(1, state);
 const eventEmitter = new events.EventEmitter();

 // NOTE: need to rethink this setup: insulinPending_mU is not preserved on tear-down/rebuild
 // we could keep a ref to the pump and ask for it when step is called
 // then the pump is responsible for saving that state
 // or i guess we could save the state here
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
      pump.receiver = (insulin_U) => {
        insulinPending_mU += 1e3 * insulin_U;
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
