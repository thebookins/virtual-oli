import { Component, OnInit } from '@angular/core';
import { Meal } from '../meal';
import { MealService } from '../meal.service';

@Component({
  selector: 'app-meal-list',
  templateUrl: './meal-list.component.html',
  styleUrls: ['./meal-list.component.css']
})
export class MealListComponent implements OnInit {

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
