import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Command } from './command';
import { Status } from './status';
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
  private pumpStatusUrl = '/api/pump/status';  // URL to web api
  private pumpSocketUrl = '/pump';
  private socket;

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  // get date(): Observable<Date> {
  //   let observable = new Observable<Date>(observer => {
  //     // TODO: we probably don't need to connect to the socket again each time
  //     this.socket = io('/pump');
  //     this.socket.on('date', (date) => {
  //       observer.next(date);
  //     });
  //     return () => {
  //       this.socket.disconnect();
  //     };
  //   })
  //   return observable.pipe(
  //     tap(date => this.log(`got pump date ${date}`))
  //   );
  // }

  get status(): Observable<Status> {
    let observable = new Observable<Status>(observer => {
      // TODO: we probably don't need to connect to the socket again each time
      this.socket = io('/pump');
      this.http.get<Status>(this.pumpStatusUrl)
        .subscribe(status => {
          observer.next(status);
        });
      this.socket.on('status', (value) => {
        observer.next(value);
        console.log('got status: ' + value);
      });
      return () => {
        this.socket.disconnect();
      };
    })
    return observable.pipe(
      tap(status => this.log(`got pump status with reservoir ${status.reservoir}`))
    );
  }

  // // TODO: bundle pump status into a class with a single getter that returns an observable
  // get reservoir(): Observable<Number> {
  //   let observable = new Observable<Number>(observer => {
  //     // TODO: we probably don't need to connect to the socket again each time
  //     this.socket = io('/pump');
  //     this.socket.on('reservoir', (value) => {
  //       observer.next(value);
  //     });
  //     return () => {
  //       this.socket.disconnect();
  //     };
  //   })
  //   return observable.pipe(
  //     tap(reservoir => this.log(`got pump reservoir ${reservoir}`))
  //   );
  // }
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
