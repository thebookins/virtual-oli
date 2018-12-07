import { Component, OnInit, OnDestroy } from '@angular/core';
import { PumpService } from './pump.service';

@Component({
  selector: 'app-pump',
  templateUrl: './pump.component.html',
  styleUrls: ['./pump.component.css']
})
export class PumpComponent implements OnInit {
  date: Date = null;

  private sub: any;

  constructor(public pumpService: PumpService) { }

  ngOnInit() {
    this.sub = this.pumpService.date.subscribe(date => this.date = date);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
