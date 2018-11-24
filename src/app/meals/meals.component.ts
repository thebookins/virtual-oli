import { Component, OnInit } from '@angular/core';
import { Meal } from '../meal';
import { MealService } from '../meal.service';

@Component({
  selector: 'app-meals',
  templateUrl: './meals.component.html',
  styleUrls: ['./meals.component.css']
})
export class MealsComponent implements OnInit {

  meals: Meal[];

  constructor(private mealService: MealService) { }

  add(carbs: number): void {
    if (!carbs) { return; }
    this.mealService.addMeal({ carbs } as Meal)
      .subscribe(meal => {
        this.meals.push(meal);
      });
  }

  getMeals(): void {
    this.mealService.getMeals()
        .subscribe(meals => this.meals = meals);
  }

  ngOnInit() {
    this.getMeals();
  }

}
