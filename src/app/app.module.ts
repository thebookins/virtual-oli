import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ChartsModule } from 'ng2-charts';

import { AppComponent } from './app.component';
import { GlucoseDetailsComponent } from './glucose/glucose-details/glucose-details.component';
import { MealListComponent } from './meals/meal-list/meal-list.component';
import { MessagesComponent } from './messages/messages.component';
import { GlucoseChartComponent } from './glucose/glucose-chart/glucose-chart.component';
import { PumpComponent } from './pump/pump.component';

@NgModule({
  declarations: [
    AppComponent,
    GlucoseDetailsComponent,
    MealListComponent,
    MessagesComponent,
    GlucoseChartComponent,
    PumpComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
