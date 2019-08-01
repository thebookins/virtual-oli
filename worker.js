let throng = require('throng');
let Queue = require('bull');
const MongoClient = require('mongodb').MongoClient;

// Connect to a local redis instance locally, and the Heroku-provided URL in production
let REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

const connectToDB = () => {
  return MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
    .then(client => {
      return client.db();
    });
};

const t1d = require('./sim/t1d2');
const pump = require('./sim/pump');

// Spin up multiple processes to handle jobs to take advantage of more CPU cores
// See: https://devcenter.heroku.com/articles/node-concurrency for more info
let workers = process.env.WEB_CONCURRENCY || 2;

// The maxium number of jobs each worker should process at once. This will need
// to be tuned for your application. If each job is mostly waiting on network
// responses it can be much higher. If each job is CPU-intensive, it might need
// to be much lower.
let maxJobsPerWorker = 50;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function start() {
  connectToDB().then(db => {
    db.collection('cgm-events').createIndex( { "readDate": 1 }, { expireAfterSeconds: 7200 } )


    // Connect to the named work queue
    console.log('creating new work queue');
    let workQueue = new Queue('work', REDIS_URL);

    workQueue.process(maxJobsPerWorker, async (job) => {
      console.log(`worker got data ${JSON.stringify(job.data)}`);

      // db.collection('people').updateMany({}, {
      //   $inc: { glucose: 1 },
      //   $currentDate: { lastModified: true }
      // });

      db.collection('pumps').find().forEach(doc => {
        const updatedState = pump(doc.state, 'basal', insulin => {
          console.log(`insulin bolus: ${insulin}`);
          // TODO: bolus this insulin to the correct person
        });
        db.collection('pumps').updateOne({_id: doc._id}, {$set: {state: updatedState}});
      });

      db.collection('people').find().forEach(person => {
        const updatedState = t1d(person.state, 'step', 1)
        // const updatedGlucose = doc.glucose + 1;
        db.collection('people').updateOne({_id: person._id}, {$set: {state: updatedState}});
      });

      db.collection('cgms').updateMany({}, {
        $inc: { clock: 1 },
        $currentDate: { lastModified: true }
      });

      // each five minutes...
      db.collection('cgms').find({ clock: { $mod: [ 5, 0 ] } }).forEach(cgm => {
        // if five cgm minutes is up...
        db.collection('people').findOne({_id: cgm.person_id})
        .then(person => {
          const glucose = t1d(person.state, 'glucose');
          db.collection('cgm-events').insertOne({readDate: new Date(), glucose});
          console.log(`glucose = ${glucose}`);
        })
      });

      // // TODO: is there a better way to update a document?
      // db.collection('people').find().forEach(person => {
      //   console.log(`got person: ${JSON.stringify(person)}`);
      //   person.glucose = +person.glucose + 1;
      //   db.collection('people').updateOne({ _id: person._id }, { $set: person }, {upsert: true});
      // });
        // // TODO: we are just updating here, other actions to follow
        // .then(state => t1d(state, 'update'))
        // .then(state => {
        //   db.collection('t1d').updateOne({}, { $set: state }, {upsert: true});
        //   // TODO: the server doesn't know that this is t1d state
        //   ch.sendToQueue('server', new Buffer(JSON.stringify(state)));
        // });


  //     // This is an example job that just slowly reports on progress
  //     // while doing no work. Replace this with your own job logic.
  //     let progress = 0;
  //
  //     // throw an error 5% of the time
  //     if (Math.random() < 0.05) {
  //       throw new Error("This job failed!")
  //     }
  //
  //     while (progress < 100) {
  //       await sleep(50);
  //       progress += 1;
  //       job.progress(progress)
  //     }
  //
  //     // A job can return values that will be stored in Redis as JSON
  //     // This return value is unused in this demo application.
  //     return { value: "This will be stored" };
    });

  });
}

// Initialize the clustered worker process
// See: https://devcenter.heroku.com/articles/node-concurrency for more info
throng({ workers, start });
