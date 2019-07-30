import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { PeopleSummaryComponent }  from './people-summary/people-summary.component';
// import { PersonDetailComponent }  from './person-detail/person-detail.component';

const routes: Routes = [
  { path: '', redirectTo: '/people', pathMatch: 'full' },
  // { path: 'people', component: PeopleSummaryComponent },
  {
    path: 'people',
    loadChildren: () => import('./people/people.module').then(mod => mod.PeopleModule)
  }
  // { path: 'detail/:id', component: PersonDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
