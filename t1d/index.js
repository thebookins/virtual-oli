const Model = require('marjorie');

module.exports = () => {
  const model = Model(1);

  // private data
  var bloodGlucose = 100;
  var cob = 0;
  var iob = 0;

  setInterval(() => {
    console.log('stepping');
    model.step(0);
  }, 1000);

  return {
    // API (public) functions
    eat: model.eat,

    dose: (units) => {
      iob += units;
    },

    sense: () => model.glucose,
  };
}
