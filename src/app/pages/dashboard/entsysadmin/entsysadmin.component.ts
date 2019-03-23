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
  templateUrl: './entsysadmin.html',
  styleUrls: ['./entsysadmin.less'],
})
export class EntsysAdminComponent implements OnInit {
  @Input() lineOption: MyEchartOption;
  @Input() datas: JSON;
  @Input() pieoption: MyEchartOption;
  @Input() echartcolor: any;
  @ViewChild(EchartComponent)
  private Child: EchartComponent;
  orderdaytotalent: any;
  myDate: string;
  type = 1;
  loadingimg = false;
  showdate: string;
  userrights: any;
  constructor(private route: ActivatedRoute, private router: Router, private http: HttpService) {
    const datePipe = new DatePipe('en-US');
    const newDate = new Date;
    this.showdate = this.addDate1(newDate, 0);
    const preDate = newDate.setDate(newDate.getDate());
    this.myDate = datePipe.transform(preDate, 'yyyy-MM-dd');
    const localuser = window.localStorage.getItem('userinfo');
    this.userrights = JSON.parse(localuser);
  }
  setblock: any;
  showblock = true;
  wait: number;
  ngOnInit(): void {
    const localuser = window.localStorage.getItem('userinfo');
    this.echartcolor = 1;
    this.types = 1;
    this._initLineChart(this.myDate, this.type);

  }

  // time = (wait) => {
  //   if (wait === 0) {
  //     this._initLineChart(this.myDate,this.type);
  //   } else {
  //     this.wait--;
  //   }
  // }
  storerankings: any;
  storerankingsres: any;
  categoryTopNum: any;
  totalCategoryNum: any = [];
  private _initLineChart = (date1, type) => {
    this.totalCategoryNum = [];
    // this.lineOption.option = {};
    console.log(date1);
    console.log(type);

    this.http.dashboarddata.request({ date: date1, type: type })
      .subscribe(
        data => {
          console.log(data);

          this.orderdaytotalent = data;
          if (data) {
            this.categoryTopNum = data['categoryTopNum'];
            if (data['totalCategoryNum']) {
              for (let i = 0; i < data['totalCategoryNum']; i++) {
                this.totalCategoryNum.push(i + 1);
              }
            }
            this.loadingimg = false;
            if (data['allTotal'] === 0) {
              this.pieoption = null;
            } else {
              this.pieoption = {
                width: 100,
                height: 320,
                option: piechannel(this.orderdaytotalent)
              };
            }


            this.datas = this.orderdaytotalent;
            if (data['allTotal'] === 0) {
              this.lineOption = null;
            } else {
              if (this.type == 1) {
                this.lineOption = {
                  width: 100,
                  height: 320,
                  option: convert2OrderAmount1(this.orderdaytotalent)
                };
              } else if (this.type == 2) {
                this.lineOption = {
                  width: 100,
                  height: 320,
                  option: convert2OrderAmount2(this.orderdaytotalent)
                };
              } else if (this.type == 3) {
                this.lineOption = {
                  width: 100,
                  height: 320,
                  option: convert2OrderAmount3(this.orderdaytotalent)
                };


              } else if (this.type == 4) {
                this.lineOption = {
                  width: 100,
                  height: 320,
                  option: convert2OrderAmount4(this.orderdaytotalent)
                };


              } else if (this.type == 5) {
                this.lineOption = {
                  width: 100,
                  height: 320,
                  option: convert2OrderAmount5(this.orderdaytotalent)
                };

              }
            }




            this.storerankings = [];
            this.storerankings = data['stores'];
            this.storerankingsres = data['stores'];
            let guests: any;
            let items: any;
            let stores: any;
            if (this.orderdaytotalent) {
              guests = this.orderdaytotalent.guests;
              items = this.orderdaytotalent.items;
              stores = this.orderdaytotalent.stores;
            }

            let gue: any;

            if (guests) {
              for (let i = 0; i < guests.length; i++) {
                for (let j = 0; j < guests.length; j++) {
                  if (guests[i].total == guests[j].total) {
                    if (guests[i].money > guests[j].money) {
                      gue = guests[j];
                      guests[j] = guests[i];
                      guests[i] = gue;
                    }
                  }
                }
              }
            }

            let ite: any;
            if (items) {
              for (let i = 0; i < items.length; i++) {
                for (let j = 0; j < items.length; j++) {
                  if (items[i].total == items[j].total) {
                    if (items[i].money > items[j].money) {
                      ite = items[j];
                      items[j] = items[i];
                      items[i] = ite;
                    }
                  }
                }
              }
            }

            let sto: any;
            if (stores) {
              for (let i = 0; i < stores.length; i++) {
                for (let j = 0; j < stores.length; j++) {
                  if (stores[i].total == stores[j].total) {
                    if (stores[i].money > stores[j].money) {
                      sto = stores[j];
                      stores[j] = stores[i];
                      stores[i] = sto;
                    }
                  }
                }
              }
            }
            // this.wait = 60;
          }
        },
        error => {
          console.error(error);
        }
      );


  }
  types: number;
  setcategorytop(date, type, topnum) {
    this.lineOption = null;
    this.http.dashboarddata.request({ date: date, type: type, topnum: topnum })
      .subscribe(res => {
        if (res['code'] === '0') {
          this._initLineChart(this.myDate, this.type);
        }
      });
  }
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
    }
    if (type == 3) {
      this.dispre = false;
      this.targetdate1 = 0;
      this.showdate = this.addMonth1(newDate, 0);
      this.myDate = this.addMonth(newDate, this.targetdate1);
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


    this._initLineChart(this.myDate, this.type);
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
      let a = this.i;
      this.loadingimg = true;
      let datePipe = new DatePipe('en-US');
      let newDate = new Date;
      this.targetdate = this.targetdate1 - a;
      this.showdate = this.addDate1(newDate, this.targetdate);

      this.myDate = this.addDate(newDate, this.targetdate);
      this._initLineChart(this.myDate, type);
      this.i++;

    }
    if (type == 2) {
      this.j = 1;
      let a = this.i;
      this.loadingimg = true;
      let datePipe = new DatePipe('en-US');
      let newDate = new Date;
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
      this._initLineChart(this.myDate, type);
      this.i++;
    }
    if (type == 3) {
      this.j = 1;
      let a = this.i;
      this.loadingimg = true;
      let datePipe = new DatePipe('en-US');
      let newDate = new Date;
      this.targetdate = this.targetdate1 - a;
      this.showtargetdate = this.targetdate1 - a;
      this.showdate = this.addMonth1(newDate, this.targetdate);
      this.myDate = this.addMonth(newDate, this.targetdate);
      console.log(this.myDate);

      this._initLineChart(this.myDate, type);
      this.i++;
    }


  }

  getnextdata(type) {
    this.showblock = false;
    // clearInterval(this.setblock);
    if (type == 1) {
      this.i = 1;
      let a = this.j;
      this.loadingimg = true;
      let datePipe = new DatePipe('en-US');
      let newDate = new Date;
      this.targetdate1 = this.targetdate + a;
      if (this.targetdate1 == 0) {
        this.showdate = this.addDate1(newDate, this.targetdate1);
        this.myDate = this.addDate(newDate, this.targetdate1);
        this._initLineChart(this.myDate, type);
        this.j++;
        this.dis = true;
        this.showblock = true;
        // this.setblock = setInterval(() => {
        //   this.time(this.wait);
        // }, 1000);
      } else {

        this.showdate = this.addDate1(newDate, this.targetdate1);
        this.myDate = this.addDate(newDate, this.targetdate1);
        this._initLineChart(this.myDate, type);
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
        this._initLineChart(this.myDate, type);
        this.j++;
        this.dis = true;
        this.showblock = true;
        // this.setblock = setInterval(() => {
        //   this.time(this.wait);
        // }, 1000);
      } else {

        this.showdate = this.addDate1(newDate, this.showtargetdate1) + '--' + this.addDate1(newDate, this.showtargetdate1 + 6);
        this.myDate = this.addDate(newDate, this.targetdate1);
        this._initLineChart(this.myDate, type);
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
        this._initLineChart(this.myDate, type);
        this.j++;
        this.dis = true;
        this.showblock = true;
        // this.setblock = setInterval(() => {
        //   this.time(this.wait);
        // }, 1000);
      } else {
        this.showdate = this.addMonth1(newDate, this.showtargetdate1);
        this.myDate = this.addMonth(newDate, this.targetdate1);
        this._initLineChart(this.myDate, type);
        this.j++;
      }
    }
  }

  addDate(date, days) {
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
    console.log(months);

    const d = new Date(date);
    //  d.setMonth(d.getMonth() + months);
    d.setMonth(date.getMonth() + months, 1);
    console.log(d.getMonth());

    let month: any = d.getMonth() + 1;
    let day: any = d.getDate();
    if (month < 10) {
      month = '0' + month;
    }
    if (day < 10) {
      day = '0' + day;
    }
    const val = d.getFullYear() + '-' + month + '-' + '01';
    return val;
  }

  addMonth1(date, months) {
    let d = new Date(date);
    d.setMonth(date.getMonth() + months, 1);
    let month: any = d.getMonth() + 1;
    let val: any;
    if (month < 10) {
      month = '0' + month;
    }
    val = d.getFullYear() + '年' + month + '月';
    return val;
  }


  search: any = {
    type: "",
    date: "",
    code: "",
    mobile: ""
  };



  // 跳转到详情页面
  goorder(order: any): void {
    if (this.userrights.usertype != 3) {
      this.search.type = this.type;
      this.search.date = this.myDate;
      if (order.code) {
        this.search.code = order.code;
      }
      if (order.mobile) {
        this.search.mobile = order.mobile;
      }



      const link = ['/pages/orders/order', this.search];
      this.router.navigate(link);
    }

  }
  // 查看无销量门店
  wxlmd: any = false;
  clickcount = 0;
  togglestore(event) {
    if (this.clickcount % 2 !== 0) {
      this.wxlmd = false;
      event.value = '查看无销量门店';

      this.clickcount = 0;
    } else {
      this.clickcount = 1;
      this.wxlmd = true;
      event.value = '关闭';
    }
  }
  home(event) {
    this.wxlmd = false;
    event.value = '查看无销量门店';

    this.clickcount = 0;
  }

  salerankings: any;
  // 查看门店销售排行
  getsaleRanking(data1, type) {
    this.http.getsaleRanking.request({ date: data1, type: type })
      .subscribe(res => {
        this.storerankings = [];
        this.storerankings = res['data'].rows;
      });
  }
  clickcount1 = 0;
  togglestore1(event) {
    if (this.clickcount1 % 2 !== 0) {
      event.value = '查看全部';
      this.storerankings = [];
      this.storerankings = this.storerankingsres;
      this.clickcount1 = 0;
    } else {
      this.clickcount1 = 1;
      this.getsaleRanking(this.myDate, this.type);
      event.value = '收起';
    }
  }
}

