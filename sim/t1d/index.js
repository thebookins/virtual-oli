const Model = require('marjorie');

module.exports = () => {
 const model = Model(1);

  // private data
  var bloodGlucose = 100;
  var cob = 0;
  var iob = 0;

  setInterval(() => {
    model.step(0);
  }, 60 * 1000); // every minute

  return {
    // API (public) functions
    eat: model.eat,

    dose: (units) => {
      iob += units;
    },

    sense: () => model.glucose,
  };
}
