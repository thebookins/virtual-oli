import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { MessageService } from '../message.service';

import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class PumpService {
  private pumpSocketUrl = '/pump';
  private socket;

  constructor(private messageService: MessageService) { }

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
  bolus() {
    this.socket.emit('bolus', 1);
  }

  /** Log a PumpService message with the MessageService */
  private log(message: string) {
    this.messageService.add('PumpService: ' + message);
  }
}
