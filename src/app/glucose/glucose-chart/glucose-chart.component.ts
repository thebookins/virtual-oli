import { Component, OnInit, OnDestroy } from '@angular/core';

import { GlucoseService } from '../glucose.service';
import { Glucose } from '../glucose';

@Component({
  selector: 'app-glucose-chart',
  templateUrl: './glucose-chart.component.html',
  styleUrls: ['./glucose-chart.component.css']
})
export class GlucoseChartComponent implements OnInit, OnDestroy {

  glucose:Glucose[];
  glucoseBaseTime:number;

  public datasets:Array<any>;

  private sub: any;


  public options:any = {
    animation: {
      duration: 0
    },
    pointBorderColor: 'green',
    pointBackgroundColor: 'green',
    scales: {
      xAxes: [{
        type: 'linear',
        position: 'bottom',
        ticks: {
          min: -3,
          max: 0,
          stepSize: 1
        },
      }],
      yAxes: [{
        display: true,
        ticks: {
          suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
          suggestedMax: 20    // maximim will be 20, unless there is a higher value.
        }
      }]
    },
    legend: { display: false }
  };

  public colors:Array<any> = [
    { // green
      backgroundColor: 'green',
      borderColor: 'green'
    },
    { // purple circles
      backgroundColor: 'white',
      borderColor: 'purple'
    }
  ];

  // NOTE: this isn't working cos I've changed the gluose API to return only one value
  getGlucose(): void {
    const now = Date.now();
    this.glucoseService.getGlucose()
    .subscribe(glucose => {
      this.glucose = glucose;
      this.datasets = [
        {
          data: glucose.map((g, i) => ({x: (g.readDate.getTime() - now)/1000/60/60, y: g.glucose})),
          fill: false,
          pointRadius: 2,
          showLine: false
        }
      ];
      this.glucoseBaseTime = now;

      setInterval(() => {
        const now = Date.now();
        const timeInterval = (Date.now() - this.glucoseBaseTime) / 1000 / 60 / 60;
        console.log('shifting by ' + timeInterval);
        for (const dataset of this.datasets) {
          for (const point of dataset.data) {
            point.x -= timeInterval;
          }
        }
        this.glucoseBaseTime = now;
        // trick Angular into repainting
        this.datasets = this.datasets.slice();
      }, 1000);

    });
  }

  constructor(private glucoseService: GlucoseService) { }

  ngOnInit() {
    this.getGlucose()
    this.sub = this.glucoseService.glucose.subscribe(data => {
      this.datasets[0].data.push({x: 0, y: data.glucose})
      if (this.datasets[0].data.length > 36) {
        this.datasets[0].data.shift()
      }
    })
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
