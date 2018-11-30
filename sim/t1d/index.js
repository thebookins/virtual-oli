// NOTE: this module might better belong in the marjorie library. Not sure.
// We can defer the decision for now.
const Model = require('marjorie');

module.exports = () => {
 const model = Model(1);

 let insulinPending_mU = 0;

 // TODO: this should really be an array of pumps, delivering (potentially) different drugs
 // Does the patient have a pump, of the pump have a patient?
 // Philosophically, I guess the patient has a pump.
  setInterval(() => {
    // NOTE: should the patient model take an infusion rate, or a bolus?
    // (doesn't really matter)
    // going with a bolus at this point
    model.step(insulinPending_mU);
    insulinPending_mU = 0;
  }, 60 * 1000); // every minute

  const infuse = (insulin) => {
    insulinPending_mU += insulin;
  }

  return {
    // API (public) functions
    eat: (meal) => model.eat(meals.carbs),

    dose: (units) => {
      // iob += units;
    },

    sense: () => model.glucose,

    addPump: (pump) => {
      // NOTE: does something like this work???
      pump.deliver = infuse;
    }
  };
}
