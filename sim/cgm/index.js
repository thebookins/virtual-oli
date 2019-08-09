var apn = require('apn');

module.exports = () => {
  const options = {
    token: {
      key: __dirname + "/AuthKey_23NRN4PHVP.p8",
      keyId: "23NRN4PHVP",
      teamId: "8ZWMLSD6JG"
    },
    production: false
  };

  const apnProvider = new apn.Provider(options);

  const postAPN = () => {
    let deviceToken = "c31ce3c0585db5744839accc7c6a6d42eb7649d0b9608b8df1757be077947240"

    var note = new apn.Notification();
    note.contentAvailable = 1;
    // NOTE: probably not necessary to set this field...
    // note.sound = "";
    note.topic = "com.8ZWMLSD6JG.loopkit.Loop"

    apnProvider.send(note, deviceToken).then( (result) => {
      console.log(JSON.stringify(result));
      // see documentation for an explanation of result
    });
  };

  return { postAPN };
}
