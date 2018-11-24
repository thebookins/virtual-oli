import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Meal } from './meal';
// TODO: import MessageService

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class MealService {
  private mealsUrl = 'http://localhost:3000/api/meals';  // URL to web api

  constructor(private http: HttpClient) { }

  getMeals(): Observable<Meal[]> {
    return this.http.get<Meal[]>(this.mealsUrl)
  }

  /** POST: add a new meal to the server */
  addMeal (meal: Meal): Observable<Meal> {
    return this.http.post<Meal>(this.mealsUrl, meal, httpOptions).pipe(
      tap((meal: Meal) => this.log(`added meal w/ carbs=${meal.carbs}`)),
      catchError(this.handleError<Meal>('addMeal'))
    );
  }

  /**
    * Handle Http operation that failed.
    * Let the app continue.
    * @param operation - name of the operation that failed
    * @param result - optional value to return as the observable result
    */
   private handleError<T> (operation = 'operation', result?: T) {
     return (error: any): Observable<T> => {

       // TODO: send the error to remote logging infrastructure
       console.error(error); // log to console instead

       // TODO: better job of transforming error for user consumption
       this.log(`${operation} failed: ${error.message}`);

       // Let the app keep running by returning an empty result.
       return of(result as T);
     };
   }

  /** Log a MealService message with the MessageService */
  private log(message: string) {
    // TODO: implement
    //this.messageService.add(`HeroService: ${message}`);
  }
}
