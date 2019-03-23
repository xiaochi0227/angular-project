import { Component, OnInit, OnChanges, ElementRef, ViewChild, Input } from '@angular/core';
import { init, ECharts, EChartOption } from 'echarts';

@Component({
  selector: 'my-echart',
  template: `<div #main style="width:100%;height:350px;"></div>`
})
export class EchartComponent implements OnInit, OnChanges {
  myChart: ECharts;
  width: any;
  height: any;
  @Input()
  option: MyEchartOption;
  @Input()
  echartcolor: any;
  @ViewChild('main') main: ElementRef;

  constructor() {
  }
  ngOnInit() {
    if (this.option.option) {
      this.width = this.option.width;
      this.height = this.option.height;
      this.myChart = init(this.main.nativeElement);
      this.myChart.setOption(this.option.option);
      window.addEventListener('resize', this.myChart.resize);
    }
  }
  ngOnChanges() {
    if (this.option.option) {
      this.main.nativeElement.style.display = 'block';
      this.myChart = init(this.main.nativeElement);
      this.myChart.setOption(this.option.option, true);
      window.addEventListener('resize', this.myChart.resize);
      if (this.echartcolor === '1') {
        const stropt = JSON.stringify(this.option);
        const stropt1 = JSON.parse(stropt);
        stropt1.option.legend.textStyle.color = '#fff';
        if (stropt1.option.series[stropt1.option.series.length - 1].itemStyle) {
          stropt1.option.series[stropt1.option.series.length - 1].itemStyle.normal.color = '#fff';
        }
        if (stropt1.option.series[stropt1.option.series.length - 1].label) {
          stropt1.option.series[stropt1.option.series.length - 1].label.normal.textStyle.color = '#fff';
        }
        this.option = stropt1;
        this.myChart.setOption(this.option.option);

      }
      if (this.echartcolor === '2') {
        const stropt = JSON.stringify(this.option);
        const stropt1 = JSON.parse(stropt);
        stropt1.option.legend.textStyle.color = '#333';
        if (stropt1.option.series[stropt1.option.series.length - 1].itemStyle) {
          stropt1.option.series[stropt1.option.series.length - 1].itemStyle.normal.color = '#333';
        }
        if (stropt1.option.series[stropt1.option.series.length - 1].label) {
          stropt1.option.series[stropt1.option.series.length - 1].label.normal.textStyle.color = '#333';
        }
        this.option = stropt1;
        this.myChart.setOption(this.option.option);

      }
    } else {
      this.main.nativeElement.style.display = 'none';
      console.log(this.myChart);

    }
  }
}

export interface MyEchartOption {
  width: number;
  height: number;
  option: EChartOption;
}
