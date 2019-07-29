// import { Injectable } from '@angular/core';
//
// @Injectable({
//   providedIn: 'root'
// })
// export class CgmService {
//
//   private cgmsUrl = 'api/cgms';
//   private cgmEventsUrl = 'api/cgm-events';
//
//   constructor() { }
//
//   getCgmsFor(id: number): Observable<Cgm[]> {
//     const url = `${this.cgmsUrl}?person_id=${id}`;
//     return this.http.get<Cgm[]>(url).pipe(
//       tap(cgms => this.log(`fetched ${cgms.length} cgms for person id=${id}`)),
//       catchError(this.handleError<Cgm[]>(`getCgmsFor id=${id}`, []))
//     );
//   }
//
//   getEventsFor(id: number): Observable<Event[]> {
//
//   }
//
//   getMeal(id: number): Observable<Meal> {
//     const url = `${this.mealsUrl}/${id}`;
//     return this.http.get<Meal>(url).pipe(
//       tap(_ => this.log(`fetched meal id=${id}`)),
//       catchError(this.handleError<Meal>(`getMeal id=${id}`))
//     );
//   }
//
//   /** POST: add a new meal to the server */
//   addMeal(meal: Meal): Observable<Meal> {
//     return this.http.post<Meal>(this.mealsUrl, meal, this.httpOptions).pipe(
//       tap((newMeal: Meal) => this.log(`added meal for person id=${newMeal.person_id}`)),
//       catchError(this.handleError<Meal>('addMeal'))
//     );
//   }
//
// }
