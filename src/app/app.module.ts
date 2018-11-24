import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { GlucoseDetailsComponent } from './glucose/glucose-details/glucose-details.component';
import { MealListComponent } from './meals/meal-list/meal-list.component';

@NgModule({
  declarations: [
    AppComponent,
    GlucoseDetailsComponent,
    MealListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
