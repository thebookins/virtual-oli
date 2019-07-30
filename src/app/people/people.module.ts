import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

import { PeopleRoutingModule } from './people-routing.module';
import { PersonListComponent } from './person-list/person-list.component';
import { PersonDetailComponent } from './person-detail/person-detail.component';
import { PumpsModule } from '../pumps/pumps.module';


@NgModule({
  declarations: [PersonListComponent, PersonDetailComponent],
  imports: [
    CommonModule,
    PeopleRoutingModule,
    MatCardModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    PumpsModule
  ],
  // exports: [
  //   PersonListComponent,
  //   PersonDetailComponent
  // ]
})
export class PeopleModule { }
