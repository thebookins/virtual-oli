import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Person } from '../person';
import { PersonService }  from '../person.service';

@Component({
  selector: 'app-person-detail',
  templateUrl: './person-detail.component.html',
  styleUrls: ['./person-detail.component.css']
})
export class PersonDetailComponent implements OnInit {

  @Input() person: Person;

  constructor(
    private route: ActivatedRoute,
    private personService: PersonService,
    private location: Location
  ) {}

  ngOnInit() {
    this.getPerson();
  }

  getPerson(): void {
    this.route.params.subscribe(params => {
      // const id = +params.id; // don't need this if id is a string
      this.personService.getPerson(params.id)
        .subscribe(person => this.person = person);
    });
  }
}