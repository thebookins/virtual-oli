import { Component, OnInit, OnDestroy } from '@angular/core';
import { Command } from './command';
import { PumpService } from './pump.service';

@Component({
  selector: 'app-pump',
  templateUrl: './pump.component.html',
  styleUrls: ['./pump.component.css']
})
export class PumpComponent implements OnInit {
  date: Date = null;

  private sub: any;

  constructor(private pumpService: PumpService) { }

  bolus(insulin: number): void {
    if (!insulin) { return; }
    this.pumpService.bolus({ type: 'bolus', dose: insulin } as Command)
      .subscribe(command => {
        // this.meals.push(meal);
      });
  }

  reset(): void {
    this.pumpService.bolus({ type: 'reset' } as Command)
      .subscribe(command => {
        // this.meals.push(meal);
      });
  }

  ngOnInit() {
    this.sub = this.pumpService.date.subscribe(date => this.date = date);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
