import { Component, OnInit, OnDestroy } from '@angular/core';
import { CgmService } from './cgm.service';

import { Glucose } from './glucose';

@Component({
  selector: 'app-cgm',
  templateUrl: './cgm.component.html',
  styleUrls: ['./cgm.component.css']
})
export class CgmComponent implements OnInit {
  glucose: Glucose = null;
  private sub: any;

  constructor(private cgmService: CgmService) { }

  ngOnInit() {
    this.sub = this.cgmService.glucose.subscribe(value => this.glucose = value);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
