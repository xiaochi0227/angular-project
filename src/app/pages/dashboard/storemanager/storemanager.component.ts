import { Component, ViewChild, Input, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpService } from 'src/app/http/http.service';
import {
  convert2OrderAmount2, convert2OrderAmount1,
  convert2OrderAmount3, convert2OrderAmount4, convert2OrderAmount5, piechannel
} from '../echart.convert.util';
import { MyEchartOption, EchartComponent } from 'src/app/theme/echarts';

@Component({
  templateUrl: './storemanager.html',
  styleUrls: ['./storemanager.less'],
})
export class StoreManagerComponent implements OnInit {
  @Input() lineOption: MyEchartOption;
  @Input() datas: JSON;
  @Input() pieoption: MyEchartOption;
  orderdaytotalent: any;
  myDate: string;
  type = 1;
  loadingimg = false;
  showdate: string;
  constructor(private http: HttpService) {
    const datePipe = new DatePipe('en-US');
    const newDate = new Date;
    this.showdate = this.addDate1(newDate, 0);
    const preDate = newDate.setDate(newDate.getDate());
    const preDate1 = newDate.setDate(newDate.getDate() - 1);
    this.myDate = datePipe.transform(preDate, 'yyyy-MM-dd');
    this.myDate1 = datePipe.transform(preDate1, 'yyyy-MM-dd');
  }
  userstore: any = [];
  ngOnInit() {
    const localuser = window.localStorage.getItem('userinfo');
    this.userstore = JSON.parse(localuser).userstores;
    this.types = 1;
    this._initLineChart(this.myDate, this.myDate1, this.type);
    // 获取列表
    this.getStoreOrders(this.userstore);


  }
  order1: any = [];
  order2: any = [];
  precelist: any = [];
  stocklist: any = [];
  getStoreOrders(userstore: any): void {
    const data = { userstore: userstore };
    this.http.getStoreOrders.request(data)
      .subscribe(res => {
        this.order1 = res['orders1'];
        this.order2 = res['orders2'];
        this.precelist = res['precelist'];
        this.stocklist = res['stocklist'];
      });

  }
  typeDateObj: any = {
    type: '',
    myDate: ''
  };
  setblock: any;
  showblock: boolean = true;
  wait: number;

  salerankings: any;
  // 查看门店销售排行
  getsaleRanking(data1, type) {
    this.http.getsaleRanking.request({ date: data1, type: type })
      .subscribe(res => {
        this.salerankings = res['data'].rows;
      });
  }
  private _initLineChart = (date1, date2, type) => {
    this.http.dashboarddata.request({ date: date1, type: type })
      .subscribe(
        data => {
          this.orderdaytotalent = data;
          if (data) {
            this.loadingimg = false;
            this.pieoption = {
              width: 100,
              height: 320,
              option: piechannel(this.orderdaytotalent)
            };
          }
          this.datas = this.orderdaytotalent;
          if (this.type == 1) {
            this.lineOption = {
              width: 100,
              height: 320,
              option: convert2OrderAmount1(this.orderdaytotalent)
            };
            this.typeDateObj.type = this.type;
            this.typeDateObj.myDate = this.myDate1;
          } else if (this.type == 2) {
            this.lineOption = {
              width: 100,
              height: 320,
              option: convert2OrderAmount2(this.orderdaytotalent)
            };
            this.typeDateObj.type = this.type;
            this.typeDateObj.myDate = this.myDate1;
          } else if (this.type == 3) {
            this.lineOption = {
              width: 100,
              height: 320,
              option: convert2OrderAmount3(this.orderdaytotalent)
            };
            this.typeDateObj.type = this.type;
            this.typeDateObj.myDate = this.myDate1;

          } else if (this.type == 4) {
            this.lineOption = {
              width: 100,
              height: 320,
              option: convert2OrderAmount4(this.orderdaytotalent)
            };
            this.typeDateObj.type = this.type;
            this.typeDateObj.myDate = this.myDate1;

          } else if (this.type == 5) {
            this.lineOption = {
              width: 100,
              height: 320,
              option: convert2OrderAmount5(this.orderdaytotalent)
            };
            this.typeDateObj.type = this.type;
            this.typeDateObj.myDate = this.myDate1;

          }

        },
        error => {
          console.error(error);
        }
      );

  }
  types: number;
  myDate1: any;

  getdata(type) {
    // clearInterval(this.setblock);
    this.i = 1;
    this.j = 1;
    this.dis = true;
    this.loadingimg = true;
    const datePipe = new DatePipe('en-US');
    const newDate = new Date;
    const preDate = newDate.setDate(newDate.getDate());
    this.myDate = datePipe.transform(preDate, 'yyyy-MM-dd');
    if (type == 1) {
      this.dispre = false;
      this.targetdate1 = 0;
      this.showdate = this.addDate1(newDate, 0);
      const preDate1 = newDate.setDate(newDate.getDate() - 1);
      this.myDate1 = datePipe.transform(preDate1, 'yyyy-MM-dd');
    }
    if (type == 2) {
      this.dispre = false;
      this.targetdate1 = 0;
      this.showtargetdate1 = 0;
      let jgdays = newDate.getUTCDay() - 1;
      if (jgdays == -1) {
        jgdays = 6;
        this.showdate = this.addDate1(newDate, -jgdays) + '--' + this.addDate1(newDate, 0);
      } else {
        this.showdate = this.addDate1(newDate, -jgdays) + '--' + this.addDate1(newDate, 0);
      }
      const preDate1 = newDate.setDate(newDate.getDate() - 7);
      this.myDate1 = datePipe.transform(preDate1, 'yyyy-MM-dd');
    }
    if (type == 3) {
      this.dispre = false;
      this.targetdate1 = 0;
      this.showdate = this.addMonth1(newDate, 0);
      const preDate1 = newDate.setDate(newDate.getDate() - 30);
      this.myDate1 = datePipe.transform(preDate1, 'yyyy-MM-dd');
    }
    if (type == 4) {
      this.dispre = true;
      this.dis = true;
      this.targetdate1 = 0;
      this.showtargetdate1 = 0;
      this.showdate = this.addDate1(newDate, -6) + '--' + this.addDate1(newDate, 0);
    }
    if (type == 5) {
      this.dispre = true;
      this.dis = true;
      this.targetdate1 = 0;
      this.showtargetdate1 = 0;
      this.showdate = this.addDate1(newDate, -29) + '--' + this.addDate1(newDate, 0);
    }

    this.type = type;
    this.types = type;


    this._initLineChart(this.myDate, this.myDate1, this.type);
    this.showblock = true;
    // this.setblock = setInterval(() => {
    //   this.time(this.wait);
    // }, 1000);
  }
  private i: number = 1;
  private j: number = 1;
  private targetdate: any;
  private targetdate1: any = 0;
  private showtargetdate: any;
  private showtargetdate1;
  dis: boolean = true;
  dispre: boolean = false;
  getpredata(type) {
    this.dis = false;
    this.showblock = false;
    // clearInterval(this.setblock);
    if (type == 1) {
      this.j = 1;
      const a = this.i;
      this.loadingimg = true;
      const datePipe = new DatePipe('en-US');
      const newDate = new Date;
      this.targetdate = this.targetdate1 - a;
      this.showdate = this.addDate1(newDate, this.targetdate);

      this.myDate = this.addDate(newDate, this.targetdate);
      this.myDate1 = this.addDate(newDate, this.targetdate - 1);
      this._initLineChart(this.myDate, this.myDate1, type);
      this.i++;

    }
    if (type == 2) {
      this.j = 1;
      const a = this.i;
      this.loadingimg = true;
      const datePipe = new DatePipe('en-US');
      const newDate = new Date;
      let jgdays = newDate.getUTCDay() - 1;
      this.targetdate = this.targetdate1 - 7 * a;
      if (jgdays == -1) {
        jgdays = 6;
        if (this.showtargetdate1 == 0) {
          this.showtargetdate = -(jgdays + 7 * a);
        } else {
          this.showtargetdate = this.showtargetdate1 - 7 * a;
        }

        this.showdate = this.addDate1(newDate, this.showtargetdate) + '--' + this.addDate1(newDate, this.showtargetdate + 6);
      } else {
        if (this.showtargetdate1 == 0) {
          this.showtargetdate = -(jgdays + 7 * a);
        } else {
          this.showtargetdate = this.showtargetdate1 - 7 * a;
        }
        this.showdate = this.addDate1(newDate, this.showtargetdate) + '--' + this.addDate1(newDate, this.showtargetdate + 6);
      }


      this.myDate = this.addDate(newDate, this.targetdate);
      this.myDate1 = this.addDate(newDate, this.targetdate - 7);
      this._initLineChart(this.myDate, this.myDate1, type);
      this.i++;
    }
    if (type == 3) {
      this.j = 1;
      const a = this.i;
      this.loadingimg = true;
      const datePipe = new DatePipe('en-US');
      const newDate = new Date;

      this.targetdate = this.targetdate1 - a;
      this.showtargetdate = this.targetdate1 - a;
      this.showdate = this.addMonth1(newDate, this.targetdate);
      this.myDate = this.addMonth(newDate, this.targetdate);
      this.myDate1 = this.addMonth(newDate, this.targetdate - 1);
      this._initLineChart(this.myDate, this.myDate1, type);
      this.i++;
    }


  }

  getnextdata(type) {
    this.showblock = false;
    // clearInterval(this.setblock);
    if (type == 1) {
      this.i = 1;
      const a = this.j;
      this.loadingimg = true;
      const datePipe = new DatePipe('en-US');
      const newDate = new Date;
      this.targetdate1 = this.targetdate + a;
      if (this.targetdate1 == 0) {
        this.showdate = this.addDate1(newDate, this.targetdate1);
        this.myDate = this.addDate(newDate, this.targetdate1);
        this.myDate1 = this.addDate(newDate, this.targetdate1 + 1);
        this._initLineChart(this.myDate, this.myDate1, type);
        this.j++;
        this.dis = true;
        this.showblock = true;
        // this.setblock = setInterval(() => {
        //   this.time(this.wait);
        // }, 1000);
      } else {

        this.showdate = this.addDate1(newDate, this.targetdate1);
        this.myDate = this.addDate(newDate, this.targetdate1);
        this.myDate1 = this.addDate(newDate, this.targetdate1 + 1);
        this._initLineChart(this.myDate, this.myDate1, type);
        this.j++;
      }


    }
    if (type == 2) {
      this.i = 1;
      const a = this.j;
      this.loadingimg = true;
      const datePipe = new DatePipe('en-US');
      const newDate = new Date;
      this.targetdate1 = this.targetdate + 7 * a;
      this.showtargetdate1 = this.showtargetdate + 7 * a;
      if (this.targetdate1 == 0) {
        this.showdate = this.addDate1(newDate, this.showtargetdate1) + '--' + this.addDate1(newDate, this.showtargetdate1 + 6);
        this.myDate = this.addDate(newDate, this.targetdate1);
        this.myDate1 = this.addDate(newDate, this.targetdate1 + 7);
        this._initLineChart(this.myDate, this.myDate1, type);
        this.j++;
        this.dis = true;
        this.showblock = true;
        // this.setblock = setInterval(() => {
        //   this.time(this.wait);
        // }, 1000);
      } else {

        this.showdate = this.addDate1(newDate, this.showtargetdate1) + '--' + this.addDate1(newDate, this.showtargetdate1 + 6);
        this.myDate = this.addDate(newDate, this.targetdate1);
        this.myDate1 = this.addDate(newDate, this.targetdate1 + 7);
        this._initLineChart(this.myDate, this.myDate1, type);
        this.j++;
      }
    }
    if (type == 3) {
      this.i = 1;
      const a = this.j;
      this.loadingimg = true;
      const datePipe = new DatePipe('en-US');
      const newDate = new Date;
      this.targetdate1 = this.targetdate + a;
      this.showtargetdate1 = this.showtargetdate + a;
      if (this.targetdate1 == 0) {
        this.showdate = this.addMonth1(newDate, this.showtargetdate1);
        this.myDate = this.addMonth(newDate, this.targetdate1);
        this.myDate1 = this.addMonth(newDate, this.targetdate1 + 1);
        this._initLineChart(this.myDate, this.myDate1, type);
        this.j++;
        this.dis = true;
        this.showblock = true;
        // this.setblock = setInterval(() => {
        //   this.time(this.wait);
        // }, 1000);
      } else {
        this.showdate = this.addMonth1(newDate, this.showtargetdate1);
        this.myDate = this.addMonth(newDate, this.targetdate1);
        this.myDate1 = this.addMonth(newDate, this.targetdate1 + 1);
        this._initLineChart(this.myDate, this.myDate1, type);
        this.j++;
      }
    }
  }

  addDate(date, days) {
    let d = new Date(date);
    d.setDate(d.getDate() + days);
    let month: any = d.getMonth() + 1;
    let day: any = d.getDate();
    if (month < 10) {
      month = '0' + month;
    }
    if (day < 10) {
      day = '0' + day;
    }
    const val = d.getFullYear() + '-' + month + '-' + day;
    return val;
  }

  addDate1(date, days) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    let month: any = d.getMonth() + 1;
    let day: any = d.getDate();
    if (month < 10) {
      month = '0' + month;
    }
    if (day < 10) {
      day = '0' + day;
    }
    const val = d.getFullYear() + '年' + month + '月' + day + '日';
    return val;
  }
  addMonth(date, months) {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months);
    let month: any = d.getMonth() + 1;
    let day: any = d.getDate();
    if (month < 10) {
      month = '0' + month;
    }
    if (day < 10) {
      day = '0' + day;
    }
    const val = d.getFullYear() + '-' + month + '-' + day;
    return val;
  }

  addMonth1(date, months) {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months);
    let month: any = d.getMonth() + 1;
    let day: any = d.getDate();
    if (month < 10) {
      month = '0' + month;
    }
    if (day < 10) {
      day = '0' + day;
    }
    const val = d.getFullYear() + '年' + month + '月';
    return val;
  }


  search: any = {
    type: "",
    date: "",
    code: "",
    mobile: ""
  };
  // 查看无销量门店
  wxlmd: any = false;
  clickcount = 0;
  togglestore(event) {
    if (this.clickcount % 2 !== 0) {
      this.wxlmd = false;
      event.value = '查看门店销售排行';
      this.clickcount = 0;
    } else {
      this.clickcount = 1;
      this.getsaleRanking(this.myDate, this.type);
      this.wxlmd = true;
      event.value = '关闭';
    }
  }
  home(event) {
    this.wxlmd = false;
    event.value = '查看门店销售排行';
    this.clickcount = 0;
  }
}

