import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Person } from './person';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const people = [
      { id: 11, name: 'John', dob: new Date()  },
      { id: 12, name: 'Ringo', dob: new Date()  },
      { id: 13, name: 'George', dob: new Date() },
      { id: 14, name: 'Paul', dob: new Date() },
      { id: 15, name: 'Bono', dob: new Date() },
      { id: 16, name: 'Elton', dob: new Date() },
      { id: 17, name: 'Edge', dob: new Date() },
      { id: 18, name: 'Nick', dob: new Date() },
      { id: 19, name: 'Bob', dob: new Date() },
      { id: 20, name: 'Leonard', dob: new Date() }
    ];

    // TODO: it might be best to have a pumps collection and a cmgs collection
    // rather than just a devices collection
    const devices = [
      { id: 11, name: 'Medtronic 723', owner_id: 14 },
      { id: 12, name: 'Dexcom G5', owner_id: 14 }
    ];

    const meals = [
      { id: 11, date: 0, carbs: 30, person_id: 14 },
      { id: 12, date: 0, carbs: 23, person_id: 14 }      
    ];

    return {people, devices, meals};
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
