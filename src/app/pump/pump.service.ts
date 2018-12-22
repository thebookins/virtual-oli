import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Command } from './command';
import { MessageService } from '../message.service';

import * as io from 'socket.io-client';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class PumpService {
  private pumpUrl = '/api/pump';  // URL to web api
  private pumpSocketUrl = '/pump';
  private socket;

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  get date(): Observable<Date> {
    let observable = new Observable<Date>(observer => {
      // TODO: we probably don't need to connect to the socket again each time
      this.socket = io('/pump');
      this.socket.on('date', (date) => {
        observer.next(date);
      });
      return () => {
        this.socket.disconnect();
      };
    })
    return observable.pipe(
      tap(date => this.log(`got pump date ${date}`))
    );
  }

  // NOTE: this is using the socket. It could just use HTTP put?
  // bolus() {
  //   this.socket.emit('bolus', 1);
  // }

  /** POST: add a new meal to the server */
  bolus (command: Command): Observable<Command> {
    console.log('in bolus')
    return this.http.post<Command>(this.pumpUrl, command, httpOptions).pipe(
      tap((command: Command) => this.log('sent command'))
      // catchError(this.handleError<Meal>('addMeal'))
    );
  }


  /** Log a PumpService message with the MessageService */
  private log(message: string) {
    this.messageService.add('PumpService: ' + message);
  }
}
