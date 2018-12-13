var PUMP_COLLECTION = "pump";

module.exports = (io, pump, db) => {
  const nsp = io.of('/pump');

  // pump.on('reservoir', (value) => nsp.emit('reservoir', value));

  // NOTE: not sure of the wisdom of separating pump from io
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

  return {
    status: function(req, res) {
      const status = {
        // clock,
        // batteryVolts,
        // batteryStatus,
        suspended: false,
        bolusing: false,
        reservoir: 150,
        // model,
        // pumpID
      }
      res.json(status);
    },
    history: function(req, res) {
      res.json([]);
    },
    post: function(req, res) {
      var post = req.body;

      db.collection(PUMP_COLLECTION).insertOne(bolus, function(err, doc) {
        if (err) {
          handleError(res, err.message, "Failed to create new expense.");
        } else {
          // TODO: bolus the t1d (do we have a reference???)
          res.status(201).json(doc.ops[0]);
        }
      })
    }
  }
}
