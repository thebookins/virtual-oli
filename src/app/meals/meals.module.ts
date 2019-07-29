import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';

import { MealListComponent } from './meal-list/meal-list.component';



@NgModule({
  declarations: [MealListComponent],
  imports: [
    CommonModule,
    MatChipsModule
  ],
  exports: [MealListComponent]
})
export class MealsModule { }
