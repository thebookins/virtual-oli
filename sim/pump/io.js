module.exports = (io, pump) => {
  const nsp = io.of('/pump');

  // pump.on('reservoir', (value) => nsp.emit('reservoir', value));

  // NOTE: not sure of the wisom of separating pump from io
  // wouldn't it be better to just run a single interval?
  setInterval(() => {
    nsp.emit('date', new Date().toTimeString());
  }, 1000);

  nsp.on('connection', (socket) => {
    socket.on('bolus', (units) => {
      units = units || 0;
      pump.bolus(units * 1000); // change units to mU
    });
    socket.on('temp basal', (unitsPerHour, duration) => {
      // TODO: implement
    })
  });
}
