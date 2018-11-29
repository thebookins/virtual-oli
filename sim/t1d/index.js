const Model = require('marjorie');

module.exports = () => {
 const model = Model(1);

  setInterval(() => {
    model.step(0);
  }, 60 * 1000); // every minute

  return {
    // API (public) functions
    eat: model.eat,

    dose: (units) => {
      // iob += units;
    },

    sense: () => model.glucose,
  };
}
