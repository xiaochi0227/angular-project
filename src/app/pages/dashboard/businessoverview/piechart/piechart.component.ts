import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-piechart',
  templateUrl: './piechart.html',
  styleUrls: ['./piechart.scss']
})
export class PiechartComponent implements OnInit {

  constructor(private logger: NGXLogger) { }
  ngOnInit() {}

}
