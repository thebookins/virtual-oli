const PWD = require('marjorie').PWD;
// const events = require('events');

const curry = (state, action, ...args) => {
  const model = PWD(1, state);

  const step = () => {
    model.step();
    return model.state;
  };

  const dose = (U) => {
    model.dose(U);
    return model.state;
  };

  const glucose = () => {
    return model.glucose;
  }

  const fn = (() => {
    switch(action) {
      case 'step': return step;
      case 'dose': return dose;
      case 'glucose': return glucose;
      default: return () => state;
    }
  })();

  return (fn.length <= args.length) ?
    fn(...args) :
    (...more) => curry(state, action, ...args, ...more);
};

module.exports = curry;
