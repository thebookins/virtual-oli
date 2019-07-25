import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { Person } from './person';
import { PEOPLE } from './mock-people';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  constructor() { }

  getPeople(): Person[] {
    return PEOPLE;
  }

  getPerson(id: number): Observable<Person> {
    // TODO: send the message _after_ fetching the hero
    // this.messageService.add(`HeroService: fetched hero id=${id}`);
    return of(PEOPLE.find(person => person.id === id));
  }
}
