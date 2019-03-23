import { Component, OnInit, Input, OnChanges, Output, AfterContentInit, EventEmitter, ViewChild } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.less']
})
export class SearchBarComponent implements OnInit, OnChanges {
  @Input() queryList;
  @Input() searchStart; // 启动search
  @Output() childemit: EventEmitter<any> = new EventEmitter<any>();
  @Output() searchSubOnlineCategories: EventEmitter<any> = new EventEmitter<any>();
  size: any;

  public closeText = '展开更多↓';
  public hidesearch = true;           // 进行当前状态记录
  public inittogglesearch = true;      // 判断是否有显示更多的按钮
  public initQueryList = new Array(); // 进行初始数据记录

  constructor() { }

  ngOnInit() {
    this.inittogglesearch = this.queryList.some(item => item['show'] === false);
    this.search();
  }

  ngOnChanges() {
    if (this.searchStart) {
      this.search();
      this.initQueryList = JSON.parse(JSON.stringify(this.queryList));
    }
  }

  // 展开更多按钮
  togglesearch() {
    this.hidesearch = !this.hidesearch;
    this.closeText = this.hidesearch ? '展开更多↓' : '关闭↑';
    this.queryList = this.queryList.map((item, index) => {
      if (index > 3) {
        item.show = this.hidesearch ? false : true;
      }
      return item;
    });

  }

  // 传出搜索结果
  search() {
    console.log(this.queryList);
    let emitObj = {};
    this.queryList.forEach((item) => {
      switch (item.type) {
        case 'input':
          emitObj[item.name] = item.value;
          break;
        case 'select':
          emitObj[item.name] = item.code;
          break;
        case 'double-select':
          emitObj[item.name1] = item.code1;
          emitObj[item.name2] = item.code2;
          break;
        case 'select-check':
          emitObj[item.name1] = item.code1;
          emitObj[item.name2] = item.code2;
          break;
        case 'double-input':
          emitObj[item.name1] = item.value1;
          emitObj[item.name2] = item.value2;
          break;
        case 'date-picker':
          if (item.value) {
            let starTime = new Date(item.value[0]);
            let endTime = new Date(item.value[1]);

            let startMonth = (starTime.getMonth() + 1) < 10 ? '0' + (starTime.getMonth() + 1) : starTime.getMonth() + 1;
            let endMonth = (endTime.getMonth() + 1) < 10 ? '0' + (endTime.getMonth() + 1) : endTime.getMonth() + 1;
            let startDate = (starTime.getDate() + 1) < 10 ? '0' + (starTime.getDate() + 1) : starTime.getDate() + 1;
            let endDate = (endTime.getDate() + 1) < 10 ? '0' + (endTime.getDate() + 1) : endTime.getDate() + 1;
            console.log(starTime);
            emitObj[item.name1] = `${starTime.getFullYear()}-${startMonth}-${startDate} 00:00:00`;
            emitObj[item.name2] = `${endTime.getFullYear()}-${endMonth}-${endDate} 23:59:59`;
          }
          break;
        case 'radio':
          emitObj[item.name] = item.code;
          break;
        case 'checkbox':
          emitObj[item.name] = item.code;
          break;
      }
    });
    this.childemit.emit(emitObj);
    console.log(emitObj);
  }


  reset() {
    // 只重置数据，不重置状态
    console.log(this.initQueryList);
    console.log(this.queryList);

    // this.queryList = JSON.parse(JSON.stringify(this.initQueryList));
    this.queryList = this.queryList.map((item) => {
      switch (item.type) {
        case 'input':
          item.value = null;
          break;
        case 'select':
          item.code = null;
          break;
        case 'double-select':
          item.code1 = null;
          item.code2 = null;
          break;
        case 'select-check':
          item.code1 = null;
          item.code2 = null;
          break;
        case 'double-input':
          item.value1 = null;
          item.value2 = null;
          break;
        case 'date-picker':
          item.value = null;
          break;
      }

      // if (index > 3) {
      //   item.show = this.hidesearch ? false : true;
      // }
      return item;
    });


  }
  // 搜索二级线上品类
  getSubOnlineCategories(event) {
    console.log(event);
    this.searchSubOnlineCategories.emit(event);

  }



}
