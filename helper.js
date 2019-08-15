const mongodb = require("mongodb");
const ObjectID = mongodb.ObjectID;

// just for posting to NS - can remove later
const request = require('request');

// NOTE: are the classes really necessary any more?
// see the note below (line 18)
const _t1d = require('./sim/t1d2');
const _pump = require('./sim/pump');
const _cgm = require('./sim/cgm')();

const PWD = require('marjorie').PWD;

const postToNS = (entry) => {
  const secret = 'fbad6ca12517a31af38ff50f4c43bd87b03d73ff';
  let ns_url = 'https://third15.herokuapp.com/api/v1/entries.json';
  let ns_headers = {
    'Content-Type': 'application/json'
  };

  ns_headers['API-SECRET'] = secret;

  const optionsNS = {
    url: ns_url,
    timeout: 30*1000,
    method: 'POST',
    headers: ns_headers,
    body: entry,
    json: true
  };

  /*eslint-disable no-unused-vars*/
  request(optionsNS, function (error, response, body) {
  /*eslint-enable no-unused-vars*/
    if (error) {
      console.error('error posting json: ', error);
    } else {
      console.log('uploaded to NS, statusCode = ' + response.statusCode);
    }
  });
};


class Meal {
  constructor(g, t) {
    this.g = g;
    this.t = t;
  }

  absorption(A_G, t_max_G) {
    return (this.g * A_G * this.t * Math.exp(-this.t / t_max_G)) / (t_max_G * t_max_G);
  }

  step(dt) {
    this.t += dt;
  }
}


// TODO: have a think about concurrency as per https://stackoverflow.com/q/11076272
// also have a look at this: https://stackoverflow.com/a/17459488
module.exports = db => {
  const person = {
    dose: id => units => {
      return db.collection('people').updateOne(
        { _id: id },
        { $inc: { pendingInsulin: units } }
      )
    },
    sense: id => {
      return db.collection('people').findOne({ _id: id })
      .then(doc => _t1d(doc.state, 'glucose'));
    },
    eat: id => g => {
      return db.collection('meals').insertOne({
        person_id: new ObjectID(id), // TODO: should id be a string? or an ObjectID?
        date: new Date(), // TODO: perhaps better if date is passed in?
        t: 0,
        carbohydrates: g
      })
    },
    step: () => {
      return db.collection('people').find(
        { },
        { projection: {state: true} }
      ).forEach(doc => {
        return db.collection('people').findOneAndUpdate(
          { _id: new ObjectID(doc._id) },
          { $set: {pendingInsulin: 0} },
          { projection: {pendingInsulin: true} }
        )
        .then(doc => doc.value.pendingInsulin)
        .then(pendingInsulin => {
          db.collection('meals').find({ person_id: doc._id }).toArray(function(err, meals) {
            let state = doc.state || {};
            state.gut = { meals };

            const model = PWD({ state });
            model.bolus(pendingInsulin * 1e3);
            model.step(0);

            state = (({ glucose, insulin }) => ({ glucose, insulin }))(model.state);
            return db.collection('people').updateOne({_id: doc._id}, {$set: { state: state }});
          });
        });
      })
      .then(() => db.collection('meals').updateMany({}, { $inc: { t: 1 } }));
    }
  };

  const pump = {
    bolus: id => units => {
      // TODO: to avoid concurrency issues here, increment a variable
      // e.g. deliveredInsulin for consumption during the step function
      // alternatively, the whole pump could be based on automatic
      // operations in mongodb
      return db.collection('pumps').findOne({ _id: new ObjectID(id) })
      .then(doc => {
        const updatedState = _pump(doc.state, 'bolus', units, person.dose(doc.person_id));
        return db.collection('pumps').updateOne({_id: id}, {$set: {state: updatedState}});
      })
      .then(() => {
        // TODO: post more informative data to pump-events collection
        return db.collection('pump-events').insertOne({type: "bolus"});
      });
    },
    step: () => {
      // for each pump in the database update its state
      // and dose its connected person with the basal insulin
      // TODO: check if the pump is connected
      return db.collection('pumps').find().forEach(doc => {
        const updatedState = _pump(doc.state, 'basal', person.dose(doc.person_id));
        console.log(JSON.stringify(updatedState));
        return db.collection('pumps').updateOne({_id: doc._id}, {$set: {state: updatedState}});
      })
    }
  };

   const cgm = {
     step: () => db.collection('cgms').updateMany({}, {
       $inc: { clock: 1 },
       $currentDate: { lastModified: true }
     }).then(() => {
       return db.collection('cgms').find(
         // every five minutes...
         { clock: { $mod: [ 5, 0 ] } }
       ).forEach(doc => {
         return person.sense(doc.person_id)
         // TODO: limit glucose between 40 and 400 mg/dl
         .then(glucose => {
           console.log(`glucose = ${glucose}`);
           const date = new Date();
           return db.collection('cgms').updateOne(
             {_id: new ObjectID(doc._id)},
             { $set: {latestGlucose: {readDate: date, glucose}}}
           )
           .then(doc => {})
           .then(() => db.collection('cgm-events').insertOne({
             cgm_id: new ObjectID(doc._id),
             readDate: date,
             glucose,
           }))
           .then(() => _cgm.postAPN())
           .then(() => {
             entry = {
               'device': 'vitual-oli',
               'date': date.getTime(),
               'dateString': date.toISOString(),
               'sgv': Math.round(glucose * 18),
               // 'direction': direction,
               'type': 'sgv',
               // 'trend': glucose.trend,
               'glucose': Math.round(glucose * 18)
             };
             postToNS(entry);
           });
         });
       })
     })
   };

  return { person, pump, cgm };
};
