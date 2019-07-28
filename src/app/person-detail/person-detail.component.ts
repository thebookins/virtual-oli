import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Person } from '../person';
import { Device } from '../device';
import { PersonService }  from '../person.service';

@Component({
  selector: 'app-person-detail',
  templateUrl: './person-detail.component.html',
  styleUrls: ['./person-detail.component.css']
})
export class PersonDetailComponent implements OnInit {

  @Input() person: Person;

  @Input() devices: Device[];

  constructor(
    private route: ActivatedRoute,
    private personService: PersonService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getPerson();
  }

  getPerson(): void {
    this.route.params.subscribe(params => {
      const id = +params.id;
      this.personService.getPerson(id)
        .subscribe(person => this.person = person);
      this.personService.getDevicesFor(id)
        .subscribe(devices => this.devices = devices);

    });
  }
}
