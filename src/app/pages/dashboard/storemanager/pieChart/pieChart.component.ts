import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-piechart',
  styleUrls: ['./pieChart.scss'],
  templateUrl: './pieChart.html'
})
// TODO: move easypiechart to component
export class PieChartComponent implements OnInit {
  @Input()
  pieData: Object;
  @Input()
  typeDate: Object;
  charts: Array<Object>;

  constructor() { }
  ngOnInit() {
  }
}
