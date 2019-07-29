import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Person } from './person';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const people = [
      { id: 11, name: 'John', dob: new Date(), glucose: 6  },
      { id: 12, name: 'Ringo', dob: new Date(), glucose: 6  },
      { id: 13, name: 'George', dob: new Date(), glucose: 6 },
      { id: 14, name: 'Paul', dob: new Date(), glucose: 6 },
      { id: 15, name: 'Bono', dob: new Date(), glucose: 6 },
      { id: 16, name: 'Elton', dob: new Date(), glucose: 6 },
      { id: 17, name: 'Edge', dob: new Date(), glucose: 6 },
      { id: 18, name: 'Nick', dob: new Date(), glucose: 6 },
      { id: 19, name: 'Bob', dob: new Date(), glucose: 6 },
      { id: 20, name: 'Leonard', dob: new Date(), glucose: 6 }
    ];

    // this simulates a simple clock process
    setInterval(() => {
      people.forEach(person => {
        person.glucose += 1;
      });
    }, 60000);

    const pumps = [
      { id: 11, name: 'Medtronic 723', person_id: 14 },
    ];

    const pumpEvents = [];

    const cgms = [
      { id: 11, name: 'Dexcom G5', owner_id: 14 }
    ];

    const cgmEvents = [
      { id: 11, date: new Date(), glucose: 6, cgm_id: 11 }
    ];

    const meals = [
      { id: 11, date: new Date(0), carbs: 30, person_id: 14 },
      { id: 12, date: new Date(10000), carbs: 23, person_id: 14 }
    ];

    return {
      // people
      people,
      meals,
      // pumps
      pumps,
      'pump-events': pumpEvents,
      // cgms
      cgms,
      'cgm-events': cgmEvents
    };
  }

  // Overrides the genId method to ensure that a hero always has an id.
  // If the heroes array is empty,
  // the method below returns the initial number (11).
  // if the heroes array is not empty, the method below returns the highest
  // hero id + 1.
  genId(people: Person[]): number {
    return people.length > 0 ? Math.max(...people.map(person => person.id)) + 1 : 11;
  }
}
