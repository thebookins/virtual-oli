import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ChartsModule } from 'ng2-charts';

import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';

import { AppComponent } from './app.component';
import { GlucoseDetailsComponent } from './glucose/glucose-details/glucose-details.component';
import { MealListComponent } from './meals/meal-list/meal-list.component';
import { MessagesComponent } from './messages/messages.component';
import { GlucoseChartComponent } from './glucose/glucose-chart/glucose-chart.component';
import { PumpComponent } from './pump/pump.component';
import { PwdComponent } from './pwd/pwd.component';

@NgModule({
  declarations: [
    AppComponent,
    GlucoseDetailsComponent,
    MealListComponent,
    MessagesComponent,
    GlucoseChartComponent,
    PumpComponent,
    PwdComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ChartsModule,
    MatTabsModule,
    MatChipsModule,
    MatExpansionModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
