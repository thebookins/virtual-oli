//const memjs = require('memjs');
//const mc = memjs.Client.create()

module.exports = (db) => {
  const buffer = Buffer.alloc(4);

  var reservoirUnits = 30000;

  // mc.get('reservoir', function(err, val) {
  //   reservoirUnits = (val)? val.readUInt32LE(0) : 30000;
  // })

  function writeState() {
    db.collection('status').update({}, {$inc: reservoir: 10}, {upsert: true})
  }

  return {
    get reservoir() {
      return reservoirUnits;
    },
    set reservoir(x) {
      if((x) && (x !== reservoirUnits)) {
        reservoirUnits = x;
        writeState();
      }
    }
  };
}
