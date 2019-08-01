import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Status } from './status';
import { MessageService } from '../message.service';

import * as io from 'socket.io-client';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class PwdService {
  private t1dStatusUrl = '/api/t1d/status';  // URL to web api
//  private t1dSocketUrl = '/t1d';
  private socket;

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  get status(): Observable<Status> {
    let observable = new Observable<Status>(observer => {
      // TODO: we probably don't need to connect to the socket again each time
      this.socket = io(this.t1dStatusUrl);
      this.http.get<Status>(this.t1dStatusUrl)
        .subscribe(status => {
          observer.next(status);
        });
      this.socket.on('status', (value) => {
        observer.next(value);
        console.log('got status: ' + value.glucose.accessible.Q);
      });
      return () => {
        this.socket.disconnect();
      };
    })
    return observable.pipe(
      tap(status => this.log(`got t1d status with glucose ${status.glucose.accessible.Q}`))
    );
  }

  /** Log a PumpService message with the MessageService */
  private log(message: string) {
    this.messageService.add('PwdService: ' + message);
  }
}