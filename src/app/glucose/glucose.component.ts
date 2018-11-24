import { Component, OnInit } from '@angular/core';
import { GlucoseService } from '../glucose.service';
import { Glucose } from '../glucose';

@Component({
  selector: 'app-glucose',
  templateUrl: './glucose.component.html',
  styleUrls: ['./glucose.component.css']
})
export class GlucoseComponent implements OnInit {

  glucose: Glucose = null;

  private sub: any;

  constructor(private glucoseService: GlucoseService) { }

  ngOnInit() {
    this.sub = this.glucoseService.glucose.subscribe(data => this.glucose = data);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
