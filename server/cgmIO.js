module.exports = (io, cgm) => {
  const nsp = io.of('/cgm');
  cgm.on('glucose', (glucose) => {
    console.log(`got glucose: ${glucose}`);
    nsp.emit('message', {glucose, readDate: new Date()});
  })
}
