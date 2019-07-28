import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Meal } from './meal';
import { MessageService } from '../message.service';

import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MealService {

  private mealsUrl = 'api/meals';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  getMealsFor(id: number): Observable<Meal[]> {
    const url = `${this.mealsUrl}?person_id=${id}`;
    return this.http.get<Meal[]>(url).pipe(
      tap(meals => this.log(`fetched ${meals.length} meals for person id=${id}`)),
      catchError(this.handleError<Meal[]>(`getMealsFor id=${id}`, []))
    );
  }

  getMeal(id: number): Observable<Meal> {
    const url = `${this.mealsUrl}/${id}`;
    return this.http.get<Meal>(url).pipe(
      tap(_ => this.log(`fetched meal id=${id}`)),
      catchError(this.handleError<Meal>(`getMeal id=${id}`))
    );
  }

  /** POST: add a new meal to the server */
  addMeal(meal: Meal): Observable<Meal> {
    return this.http.post<Meal>(this.mealsUrl, meal, this.httpOptions).pipe(
      tap((newMeal: Meal) => this.log(`added meal for person id=${newMeal.person_id}`)),
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
    this.messageService.add(`MealService: ${message}`);
  }
}
