// NOTE: this module might better belong in the marjorie library. Not sure.
// We can defer the decision for now.
const Model = require('marjorie');

module.exports = () => {
 const model = Model(1);

 let insulinPending_mU = 0;
 let cgm = null;

 // // TODO: this should really be an array of pumps, delivering (potentially) different drugs
 // // Does the patient have a pump, of the pump have a patient?
 // // Philosophically, I guess the patient has a pump.
 //  setInterval(() => {
 //    // NOTE: should the patient model take an infusion rate, or a bolus?
 //    // (doesn't really matter)
 //    // going with a bolus at this point
 //    model.step(insulinPending_mU);
 //    insulinPending_mU = 0;
 //
 //    if (cgm) {
 //      cgm.interstitialGlucose = model.glucose;
 //    }
 //  }, 60 * 1000); // every minute

  const read = () => {
    insulinPending_mU += insulin;
  }


  return {
    // API (public) functions
    step: () => model.step(0),
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
      return {
        glucose: 6.0
      };
    },
    attachCGM(cgm) {
      cgm.read = () => model.glucose;
    },
    removeCGM: (cgm) => {

    }
  };
}
