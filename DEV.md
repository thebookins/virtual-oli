# Development notes

## Avatar (patient) api
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


   return {
     dose: (units) => {
       // iob += units;
     },

     sense: () => model.glucose,
   };
 }
