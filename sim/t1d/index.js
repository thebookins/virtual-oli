// NOTE: this module might better belong in the marjorie library. Not sure.
// We can defer the decision for now.
const { Pump, Model } = require('marjorie');

module.exports = (state) => {
 const model = Model(1, state);

 let insulinPending_mU = 0;
 let cgm = null;

  return {
    // API (public) functions
    step: () => {
      model.step(insulinPending_mU);
      insulinPending_mU = 0;
    },
    eat: (meal) => model.eat(meal.carbs),
    dose: (units) => {
      // iob += units;
    },
    // NOTE: here we are attaching a function to the pump object
    // could be a bit of a convoluted architecture
    // not sure
    attachPump: (pump) => {
      pump.deliver = (insulin) => {
        insulinPending_mU += insulin;
      };
    },
    removePump: (pump) => {
      pump.deliver = null;
    },
    get glucose() {
      return model.glucose;
    },
    get state() {
      console.log(`state: ${model.state}`)
      return model.state;
    },
    attachCGM(cgm) {
      cgm.read = () => model.glucose;
    },
    removeCGM: (cgm) => {
      // TODO: implement
    }
  };
}
