import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ChartsModule } from 'ng2-charts';
import { RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button'
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';


import { AppComponent } from './app.component';

import { PwdComponent, MealDialogComponent } from './pwd/pwd.component';
import { GlucoseDetailsComponent } from './glucose/glucose-details/glucose-details.component';
import { GlucoseChartComponent } from './glucose/glucose-chart/glucose-chart.component';
import { MealListComponent } from './meals/meal-list/meal-list.component';

import { PumpComponent } from './pump/pump.component';

import { MessagesComponent } from './messages/messages.component';
import { HistoryComponent } from './pump/history/history.component';
import { CgmComponent } from './cgm/cgm.component';
import { AppRoutingModule } from './/app-routing.module';
import { PeopleComponent } from './people/people.component';
import { PersonDetailComponent } from './person-detail/person-detail.component';
import { PeopleSummaryComponent } from './people-summary/people-summary.component';

@NgModule({
  declarations: [
    AppComponent,
    GlucoseDetailsComponent,
    MealListComponent,
    MessagesComponent,
    GlucoseChartComponent,
    PumpComponent,
    PwdComponent,
    MealDialogComponent,
    HistoryComponent,
    CgmComponent,
    PeopleComponent,
    PersonDetailComponent,
    PeopleSummaryComponent
  ],
  entryComponents: [
    MealDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ChartsModule,
    MatButtonModule,
    MatTabsModule,
    MatChipsModule,
    MatExpansionModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatToolbarModule,
    MatListModule,
    MatSidenavModule,
    RouterModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
