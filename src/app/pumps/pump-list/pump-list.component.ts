import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Pump } from '../pump';
import { PumpService } from '../pump.service';

@Component({
  selector: 'app-pump-list',
  templateUrl: './pump-list.component.html',
  styleUrls: ['./pump-list.component.css']
})
export class PumpListComponent implements OnInit {

  @Input() person_id: number;

  pumps: Pump[];

  constructor(private pumpService: PumpService) { }

  ngOnChanges() {
    this.pumps = [];
    this.pumpService.getPumpsFor(this.person_id)
        .subscribe(pumps => this.pumps = pumps);
  }

  ngOnInit() {
  }

}
