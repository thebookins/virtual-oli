# Development notes

## PWD api
Things we might want to do with the patient.
 - eat(meal): meal may contain things in addition to carbs (e.g. fat, protein)
 - fingerstick(): return blood glucose
 - hba1c(): return HbA1c (alternatively, we could have a method like 'fingerprick' that returns a blood object, and the blood object we could then interrogate for glucose and hba1c)
 - inject(bolus): for regular needle injections; bolus will contain information about the drug (e.g. lantus, novorapid, glucagon etc.)
 - addPump(pump): When a pump is added, step() will query the pump for infusion rate.
 - removePump()
 - addCGM(cgm): When a cgm is added, step() will set the intersitial glucose conc on the cgm object.
 - removeCGM()

Things that should be under the hood at some level:
 - step
 - stepUntil

## Database
The database should hold the simulator state at all times.

Things that we will need:
 - creationTime
 - lastUpdatedTime

 I'm thinking that the db could have the following collections:
  - pumps (one document per pump, containing id, user?, lastUpdated, reservoir, battery, suspended, bolusing; everything required to reconstitute a pump)
  - Pump history (indexed by pump id, each document is one pump event). Alternatively, I guess we could have one collection per pump, not sure which is most efficient. These documents could auto-expire if we want: https://docs.mongodb.com/manual/tutorial/expire-data/
  - cgms (one document per cgm, contining id, user?, lastTx, battery, buffer containing last 36 readings; everything required to reconstitute a cgm). Alternatively we could use a capped collection (similar to a circular buffer), one collection per cgm: https://docs.mongodb.com/manual/core/capped-collections/.
  - people (one document per person, containing id, user? lastUpdated, all model state)
  - users

## Message architecture
### `clock` (producer)
 - send an update message once every minute to the worker (the minimum delta for the model)
### `server` (producer and consumer)
 - on GET just query the database and return the requested value
 - on POST send the command message
 - on pump clock event relay this to connected sockets
### `worker`: (producer and consumer)
 - on update message update the model to the requested time (the cgm will issue an APN once every five minutes)
 - on command message do what it says
 - on pump clock event relay this message to the server
