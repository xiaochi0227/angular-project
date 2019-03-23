import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseParams } from 'src/app/models';
import { HttpService } from 'src/app/http/http.service';
import { GMTToStr, Authbts, Whetherdisplay } from 'src/app/validates/validates';
import { DatePipe } from '@angular/common';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  templateUrl: './financereport.html',
  styleUrls: ['./financereport.less']
})
export class Financereport {
  myDate: any;
  myDate1: any;
  // 请求参数
  params: any = {
    channel: '',
    region_code: '',
    date_type: '',
    start_time: '',
    end_time: '',
  }

  cow: number;
  rankings: any;
  firstCategories: any;

  datas: any;
  financeorderreportList: any;
  btns: any;
  dcdcsvwj: boolean = true;
  _startDate = null;
  _endDate = null;
  constructor(private router: ActivatedRoute, private http: HttpService, private notification: NzNotificationService) {
    this.notification.config({
      nzPlacement: 'topRight'
    });
  }

  ngOnInit(): void {
    this._startDate = new Date(Date.now() - 3600 * 24 * 1000);
    this._endDate = new Date(Date.now() - 3600 * 24 * 1000);
    this.params.start_time = GMTToStr(this._startDate);
    this.params.end_time = GMTToStr(this._endDate);
    this.btns = Authbts('运营统计', '各店结算表');
    this.dcdcsvwj = Whetherdisplay(this.btns, '导出到CSV文件');

    this.getStorelist();
    this.getchannels();
    this.getfinanceorderreportList(this.params);
  }

  // 查询报表
  getfinanceorderreportList(params) {
    if (String(params.start_time).length === 10) {
      params.start_time = String(params.start_time) + ' 00:00:00';
    }
    if (String(params.end_time).length === 10) {
      params.end_time = String(params.end_time) + ' 23:59:59';
    }
    if (this.check()) {
      this.http.getfinanceorderreport.request(params)
        .subscribe(rows => {
          this.financeorderreportList = rows['data'];
        });
    }
  }

  channels: any[];
  // 获取渠道
  getchannels(): void {
    this.http.getChannels.request({ 'ebls_split': true })
      .subscribe(channels => {
        this.channels = channels['rows'];
      });
  }
  stores: any;
  // 获取门店列表
  getStorelist() {
    this.http.getstorealist.request({})
      .subscribe(stores => {
        this.stores = stores;
      });
  }


  searchcode($event) {
    this.params.region_code = $event;
  }

  // 查询
  search() {
    let datePipe = new DatePipe('en-US');
    this.params.start_time = datePipe.transform(this.params.start_time, 'yyyy-MM-dd 00:00:00');
    this.params.end_time = datePipe.transform(this.params.end_time, 'yyyy-MM-dd 23:59:59');
    this.getfinanceorderreportList(this.params);
  }



  // 导出
  addexport() {
    let datePipe = new DatePipe('en-US');
    let stime = new Date(datePipe.transform(this.params.start_time, 'yyyy-MM-dd'));
    let ntime = new Date(datePipe.transform(this.params.end_time, 'yyyy-MM-dd'));
    let days = (Date.parse(ntime.toDateString()) - Date.parse(stime.toDateString())) / 1000 / 60 / 60 / 24;
    if (days > 30) {
      this.notification.create('error', '温馨提示', "日期范围应在一个月之内");
      return false;
    } else {
      let exportname: any, startdate: any, enddate: any, channel: any;
      let datePipe = new DatePipe('en-US');
      let start_date = datePipe.transform(this.params.start_time, 'yyyy-MM-dd 00:00:00');
      let end_date = datePipe.transform(this.params.end_time, 'yyyy-MM-dd 23:59:59');
      exportname = String(start_date).substr(0, 10) + '到' + String(end_date).substr(0, 10);
      let parame = {
        'path': '/test-export-bsp/saledetail/getfinanceorders',
        'search': {
          channel: this.params.channel,
          region_code: this.params.region_code,
          start_time: start_date,
          end_time: end_date,
        },
        'desc': exportname + '各店结算表',
        'sort': 'total',
        'sortDirKey': 'DESC',
        'export_columns': [
          { 'name': '门店', 'key': 'store_name' },
          { 'name': '渠道', 'key': 'channel_keyword' },
          { 'name': '商品', 'key': 'item_value' },
          { 'name': '商家优惠', 'key': 'sj_disc' },
          { 'name': '商家补贴', 'key': 'total_sj_dp' },
          { 'name': '平台优惠', 'key': 'total_pt_disc' },
          { 'name': '平台补贴', 'key': 'pt_disc' },
          { 'name': '平台佣金', 'key': 'commission_value' },
          { 'name': '运费收入', 'key': 'logistics_sj_value' },
          { 'name': '包装', 'key': 'package_fee' },
          { 'name': '收入', 'key': 'income' },
          { 'name': '退货金额', 'key': 'return_money' },
          { 'name': '实际结算金额', 'key': 'settle_amount' }
        ]

      };


      if (this.check()) {
        this.http.addexport.request(parame)
          .subscribe(row => {

            if (row) {
              this.notification.create('success', '温馨提示',  row['msg']);
            } else {
              this.notification.create('error', '温馨提示', '添加失败,请重试！');
            }

          });
      }
    }
  }

  check() {
    // let n = this.params.start_time.toString().replace(/-/g, '');
    // let b = this.params.end_time.toString().replace(/-/g, '');
    // let oDate1 = new Date(this.params.start_time);
    // let oDate2 = new Date(this.params.end_time);
    // if (!this.params.start_time) {
    //     alert('请选择开始时间');
    //     return false;
    // }
    // if (!this.params.end_time) {
    //     alert('请选择结束时间');
    //     return false;
    // }
    // if (oDate2.getTime() < oDate1.getTime()) {
    //     alert('大于开始时间要大于结束时间');
    //     return false;
    // }

    // if ((parseInt(n) - parseInt(b)) > 31) {
    //     alert('时间间隔不能大于31天');
    //     return false;
    // }
    return true;
  }

  //重置
  Reset() {
    this.params.channel = '';
    this.params.region_code = '';
  }
  startchange(event) {
    this._startDate = event;
    this.params.start_time = GMTToStr(event) + ' 00:00:00';
  }
  endchange(event) {
    this._endDate = event;
    this.params.end_time = GMTToStr(event) + ' 23:59:59';
  }
}
