import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PersonListComponent } from './person-list/person-list.component';
import { PersonDetailComponent } from './person-detail/person-detail.component';

const routes: Routes = [
  {
    path: '',
    component: PersonListComponent
  },
  {
    path: ':id',
    component: PersonDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PeopleRoutingModule { }
