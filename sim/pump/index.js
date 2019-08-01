const pump = (state, action, ...args) => {
  const basal = (receiver) => {
    state.clock += 1;
    state.reservoir -= 1;
    receiver(1);
    return state;
  }

  const bolus = (units, receiver) => {
    state.reservoir -= units;
    receiver(units);
    return state;
  }

  fn = (() => {
    switch(action) {
      case 'basal': return basal;
      case 'bolus': return bolus;
      default: return () => {};
    }
  })();

  return (fn.length <= args.length) ?
    fn(...args) :
    (...more) => pump(state, action, ...args, ...more);
};

module.exports = pump;
