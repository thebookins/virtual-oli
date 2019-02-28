import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from '../message.service';
import { Glucose } from './glucose';

import * as io from 'socket.io-client';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class CgmService {
  private socket;

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  get glucose(): Observable<Glucose> {
    let observable = new Observable<Glucose>(observer => {
      // TODO: we probably don't need to connect to the socket again each time
      this.socket = io('/cgm');
      this.http.get<Glucose>('/api/cgm')
        .subscribe(value => {
          observer.next(value);
        });
      this.socket.on('glucose', (value) => {
        observer.next(value);
        console.log('got glucose: ' + value.glucose);
      });
      return () => {
        this.socket.disconnect();
      };
    })
    return observable.pipe(
      tap(value => this.log(`got cgm glucose of ${value.glucose}`))
    );
  }

  /** Log a PumpService message with the MessageService */
  private log(message: string) {
    this.messageService.add('CGMService: ' + message);
  }
}
