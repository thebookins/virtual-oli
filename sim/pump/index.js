module.exports = () => {
  const basal_rate_U_per_hour = 10;

  let deliver = (insulin) => {
    console.log(`delivering ${insulin} units into nothing`);
  };

  const state = {
    reservoir: 300
  }

  setInterval(() => {
    const dose = basal_rate_U_per_hour / 3600;
    deliver(basal_rate_U_per_hour / 3600);
    state.reservoir -= dose;
  }, 1000);

  const api = {
    bolus: (insulin) => {
      console.log(`bolusing ${insulin} units`);
      deliver(insulin);
    },
    set deliver(fn) {
      deliver = fn;
    },
    get reservoir() {
      return state.reservoir;
    }
  };

  return api;
}

// NOTE: temporarily commented out here while we work out what this module does
// const events = require('events');
// const state = require('./state')();
//
// module.exports = (t1d) => {
//   var eventEmitter = new events.EventEmitter();
//
//   // TODO: move this stuff in state.js
//   // private data
//   var timestamp = 0;
//   var insulinDeficit_U = 0;
//
//   var basal_rate_U_per_hour = 10;
//
//   setInterval(() => {
//     timestamp++;
//     insulinDeficit_U += basal_rate_U_per_hour / 3600;
//     if (insulinDeficit_U >= 0.05) {
//       bolus(0.05);
//       insulinDeficit_U -= 0.05;
//     }
//     if (!(timestamp % 10)) { // every five minutes
//       // NOTE: why are we doing this?
//       eventEmitter.emit('reservoir', state.reservoirUnits/100);
//     }
//   }, 1000);
//
//   var bolus = (units) => {
//     state.reservoirUnits -= units*100;
//     t1d.dose(units);
//     return true;
//   }
//
//   return {
//     // API (public) functions
//     bolus,
//
//     prime: (reservoirUnits) => {
//       state.reservoirUnits = reservoirUnits;
//     },
//
//     on: (message, callback) => eventEmitter.on(message, callback)
//   };
// }
