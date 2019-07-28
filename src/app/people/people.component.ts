import { Component, OnInit } from '@angular/core';

import { Person } from '../person';
import { PersonService } from '../person.service';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent implements OnInit {

  people: Person[];

  constructor(private personService: PersonService) { }

  getPeople(): void {
    this.personService.getPeople()
    .subscribe(people => this.people = people);
  }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.personService.addPerson({ name } as Person)
      .subscribe(person => {
        this.people.push(person);
      });
  }

  ngOnInit() {
    this.getPeople();
  }

}
