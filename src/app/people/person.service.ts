import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Person } from './person';
import { MessageService } from '../message.service';

import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  private peopleUrl = '/api/people';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  getPeople(): Observable<Person[]> {
    return this.http.get<Person[]>(this.peopleUrl)
      .pipe(
        tap(_ => this.log('fetched people')),
        catchError(this.handleError<Person[]>('getPeople', []))
      );
  }

  getPerson(id: string): Observable<Person> {
    const url = `${this.peopleUrl}/${id}`;
    console.log(`url: ${url}`);
    return this.http.get<Person>(url).pipe(
      tap(_ => this.log(`fetched person id=${id}`)),
      catchError(this.handleError<Person>(`getPerson id=${id}`))
    );
  }

  /** POST: add a new person to the server */
  addPerson (person: Person): Observable<Person> {
    return this.http.post<Person>(this.peopleUrl, person, this.httpOptions).pipe(
      tap((newPerson: Person) => this.log(`added person w/ id=${newPerson._id}`)),
      catchError(this.handleError<Person>('addPerson'))
    );
  }

  eat(id: string, carbs: Person): Observable<Person> { // TODO: make a meal class?
    console.log('eating');
    const url = `${this.peopleUrl}/${id}`;
    console.log(url);
    return this.http.post<Person>(url, carbs, this.httpOptions).pipe(
      tap(() => this.log('eating success')),
      catchError(this.handleError<Person>('eat'))
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

  /** Log a PersonService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`PersonService: ${message}`);
  }

  // if we were in the devices service it would be
  // getDevices()
  // getDevice(id: number)
  // getDevicesForOwner(id: number)
  // THIS MIGHT WORK BETTER
}
