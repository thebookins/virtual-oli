module.exports = (io, cgm) => {
  const nsp = io.of('/cgm');
  cgm.on('glucose', (glucose) => {
    nsp.emit('message', {glucose, readDate: new Date()});
  })

  return {
    latest: function(req, res) {
      res.render('api/cgm', cgm.glucose)
    }
  }
}
