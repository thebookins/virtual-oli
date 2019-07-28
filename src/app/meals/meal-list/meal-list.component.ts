import { Component, OnInit, Input } from '@angular/core';
import { Meal } from '../meal';
import { MealService } from '../meal.service';

@Component({
  selector: 'app-meal-list',
  templateUrl: './meal-list.component.html',
  styleUrls: ['./meal-list.component.css']
})
export class MealListComponent implements OnInit {

  @Input() person_id: number;

  meals: Meal[];

  constructor(private mealService: MealService) { }

  add(carbs: number): void {
    if (!carbs) { return; }
    this.mealService.addMeal({ date: new Date(), carbs } as Meal)
      .subscribe(meal => {
        this.meals.push(meal);
      });
  }

  getMeals(): void {
    this.mealService.getMealsFor(this.person_id)
        .subscribe(meals => this.meals = meals);
  }

  ngOnInit() {
    this.getMeals();
  }
}
