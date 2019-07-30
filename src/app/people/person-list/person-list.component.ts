import { Component, OnInit } from '@angular/core';

import { Person } from '../person';
import { PersonService } from '../person.service';

@Component({
  selector: 'app-person-list',
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.css']
})
export class PersonListComponent implements OnInit {

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
