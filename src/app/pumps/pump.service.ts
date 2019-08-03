import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Pump } from './pump';
import { MessageService } from '../message.service';

import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PumpService {

  private pumpsUrl = 'api/pumps';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  getPumpsFor(id: string): Observable<Pump[]> {
    const url = `${this.pumpsUrl}?person_id=${id}`;
    console.log(`url: ${url}`);
    return this.http.get<Pump[]>(url).pipe(
      tap(pumps => this.log(`fetched ${pumps.length} pumps for person id=${id}`)),
      catchError(this.handleError<Pump[]>(`getPumpsFor id=${id}`, []))
    );
  }

  bolus(id: string, units): Observable<string> {
    const url = `${this.pumpsUrl}/${id}`;
    return this.http.post<string>(url, "bolus please", this.httpOptions).pipe(
      // tap((newEvent: string) => this.log(`added person w/ id=${newPerson._id}`)),
      catchError(this.handleError<string>('bolus'))
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

  /** Log a PumpService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`PumpService: ${message}`);
  }
}
