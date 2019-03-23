import { Component, Input, OnInit } from '@angular/core';
import { Router, Params } from '@angular/router';
import { BaseParams } from 'src/app/models';
import { HttpService } from 'src/app/http/http.service';
import { Authbts, Whetherdisplay, GMTToStr } from 'src/app/validates/validates';
import { DatePipe } from '@angular/common';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  templateUrl: './orderdetailssearch.html',
  styleUrls: ['./orderdetailssearch.less']


})

export class OrderDetailsSearch implements OnInit {

  // 请求参数
  params: BaseParams = {
    search: {
      channel_keyword: '',
      channel_sheetno: '',
      order_status: '',
      region_code: '',
      item_code: '',
      barcode: '',
      online_sup_code: '',
      online_cat_code: '',
      startdate: '',
      enddate: ''
    },
    page_size: 20,
    page_no: 1,
    sort: 'timestamp',
    sortDirKey: 'DESC'
  };



  @Input()
  mycode;
  showdate: string;

  btns: any;
  dcdcsvwj = true;
  _startDate = null;
  _endDate = null;
  goodstotal: any;
  goodsmoney: any;
  constructor(private http: HttpService, private notification: NzNotificationService) {
    this.notification.config({
      nzPlacement: 'topRight'
    });
  }
  page_count = {
    totalPage: 0,
    count: 0
  };

  cow = 0; // 序号
  subCategories: any;
  firstCategories: any;

  ngOnInit(): void {
    this.btns = Authbts('订单管理', '订单明细查询');
    // console.log(this.btns);
    this.dcdcsvwj = Whetherdisplay(this.btns, '导出到CSV文件');
    this.getchannels();
    this.getStorelist();
    this._startDate = new Date(Date.now());
    this._endDate = new Date(Date.now());
    this.params.search.startdate = GMTToStr(this._startDate);
    this.params.search.enddate = GMTToStr(this._endDate);
    this.getorderdetails(this.params);
    this.http.getFirstOnlineCategories.request({ parent: 0 })
      .subscribe(categories => {
        if (categories['code'] === '0' && categories['data']) {
          this.firstCategories = categories['data'];
        }

      });

  }
  setcode(category) {

  }
  getSubOnlineCategories(name: any) {
    this.subCategories = [];
    this.params.search.online_cat_code = '';
    this.http.getSubOnlineCategories.request({ parent: name })
      .subscribe(categories => {
        if (categories['code'] === '0' && categories['data']) {
          this.subCategories = categories['data'];
        }
      });
  }

  channels: any[];
  // 获取渠道
  getchannels(): void {
    this.http.getChannels.request({ 'ebls_split': true })
      .subscribe(channels => {
        if (channels['code'] === '0' && channels['data']) {
          this.channels = channels['data']['rows'];
        }
      });
  }
  stores: any;
  // 获取门店列表
  getStorelist() {
    this.http.getStorelist.request()
      .subscribe(stores => {
        if (stores['code'] === '0' && stores['data']) {
          this.stores = stores['data'];
        }

      });
  }
  changecount: any = 0;
  // 获取订单明细列表
  orderdetails: any;
  exportstartdate: any;
  exportenddate: any;
  getorderdetails(params) {
    this.exportstartdate = params.search.startdate;
    this.exportenddate = params.search.enddate;
    if (String(params.search.startdate).length === 10) {
      params.search.startdate = String(params.search.startdate) + ' 00:00:00';

    }
    if (String(params.search.enddate).length === 10) {
      params.search.enddate = String(params.search.enddate) + ' 23:59:59';

    }
    this.http.getorderdetails.request(params)
      .subscribe(orderdetails => {
        if (orderdetails['code'] === '0' && orderdetails['data']) {
          this.orderdetails = orderdetails['data']['rows'];
          this.page_count.count = orderdetails['data']['count'];
          this.changecount = orderdetails['data']['count'];
          this.goodstotal = orderdetails['data']['total'];
          this.goodsmoney = orderdetails['data']['money'];
        }


      });
  }
  searchcode($event) {
    this.params.search.region_code = $event;
  }
  // 接收翻页操作传过来的值，然后请求服务得到新数据
  childparams($event) {
    let childoption = $event;
    this.params.page_no = childoption.page_no;
    this.cow = (childoption.page_no - 1) * childoption.page_size;
    this.getorderdetails(childoption);

  }
  // 输入条件查询方法
  search(paramsoption) {
    console.log(paramsoption)
    if (paramsoption.search.channel_keyword == '' && paramsoption.search.channel_sheetno == '' && paramsoption.search.item_code == '' && paramsoption.search.barcode == '' && paramsoption.search.online_sup_code == '' && paramsoption.search.order_status == '' && paramsoption.search.region_code == '' && paramsoption.search.enddate == '' && paramsoption.search.startdate == '') {
      this.notification.create('error', '温馨提示', "查询条件不能为空");
      return;
    }
    paramsoption.page_no = 1;
    this.getorderdetails(paramsoption);
  }

  // 重置
  OrderRest() {
    this.params.search.channel_keyword = '';
    this.params.search.channel_sheetno = '';
    this.params.search.order_status = '';
    this.params.search.region_code = '';
    this.params.search.startdate = '';
    this.params.search.enddate = '';
    this._startDate = null;
    this._endDate = null;
    this.params.search.online_sup_code = '';
    this.params.search.online_cat_code = '';
    this.params.search.item_code = '';
    this.params.search.barcode = '';
  }

  addexport() {
    const datePipe = new DatePipe('en-US');
    const stime = new Date(datePipe.transform(this.exportstartdate, 'yyyy-MM-dd'));
    const ntime = new Date(datePipe.transform(this.exportenddate, 'yyyy-MM-dd'));
    const days = (Date.parse(ntime.toDateString()) - Date.parse(stime.toDateString())) / 1000 / 60 / 60 / 24;

    if (days > 6) {
      if (this.page_count.count > 150000) {
        this.notification.create('error', '温馨提示', '请导出日期在七天之内或总记录数不大于150000的数据！');
        return false;
      } else {
        this.exportfun();
      }
    } else {
      this.exportfun();
    }
  }

  exportfun() {
    let exportname: any, startdate: any, enddate: any, channel_keyword: any;
    if (this.exportstartdate) {
      let strdate = String(this.exportstartdate).substr(0, 10);
      startdate = strdate + '―';
    } else { startdate = ''; }
    if (this.exportenddate) {
      let endstr = String(this.exportenddate).substr(0, 10);
      enddate = endstr + '-';
    } else { enddate = ''; }
    if (this.params.search.channel_keyword) { channel_keyword = this.params.search.channel_keyword + '-'; } else { channel_keyword = '' }
    exportname = startdate + enddate + channel_keyword;
    let parame = {
      'path': '/test-export-bsp/order/getorderdetails',
      'search': {},
      'desc': exportname + '订单明细',
      'sort': 'timestamp',
      'sortDirKey': 'DESC',
      'export_columns': [
        { 'name': '渠道', 'key': 'channel_keyword' },
        { 'name': '门店编码', 'key': 'region_code' },
        { 'name': '门店名称', 'key': 'region_name' },
        { 'name': '订单号', 'key': 'channel_sheetno' },
        { 'name': '订单状态', 'key': 'order_status' },
        { 'name': '一级分类', 'key': 'online_sup_name' },
        { 'name': '二级分类', 'key': 'online_cat_name' },
        { 'name': '商品编码', 'key': 'item_code' },
        { 'name': '商品条码', 'key': 'barcode' },
        { 'name': '商品名称', 'key': 'item_name' },
        { 'name': '商品售价', 'key': 'sale_price' },
        { 'name': '数量', 'key': 'sale_qty' },
        { 'name': '商品金额', 'key': 'sale_value' },
        { 'name': '商家优惠', 'key': 'disc_value' },
        { 'name': '平台优惠', 'key': 'disc_value_pt' },
        { 'name': '单品商家优惠', 'key': 'disc_bt_sj' },
        { 'name': '平台单品优惠', 'key': 'disc_bt' },
        { 'name': '下单时间', 'key': 'timestamp' }
      ]

    }
    parame.search = this.params.search;
    this.http.addexport.request(parame)
      .subscribe(row => {

        if (row) {
          this.notification.create('success', '温馨提示', row['msg']);
        } else {
          this.notification.create('error', '温馨提示', '添加失败,请重试！');
        }

      });
  }
  startchange(event) {
    this._startDate = event;
    this.params.search.startdate = GMTToStr(event) + ' 00:00:00';
  }
  endchange(event) {
    this._endDate = event;
    this.params.search.enddate = GMTToStr(event) + ' 23:59:59';
  }

}
