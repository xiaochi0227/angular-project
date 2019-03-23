import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { BaseParams } from 'src/app/models';
import { HttpService } from 'src/app/http/http.service';
import { GMTToStr, Authbts, Whetherdisplay } from 'src/app/validates/validates';
import { DatePipe } from '@angular/common';
import { NzNotificationService } from 'ng-zorro-antd';
@Component({
  templateUrl: './returnlist.html',
  styleUrls: ['./returnlist.less']
})


export class ReturnList implements OnInit, AfterViewInit {

  // 请求参数
  params: BaseParams = {
    search: {
      channel_keyword: '',
      channel_sheetno: '',
      sheetno: '',
      region_code: '',
      startdate: '',
      enddate: '',
      mobile: '',
      test: '',
      hxzt: '',
      date_type: 'return_time'
    },
    page_size: 50,
    page_no: 1,
    sort: 'return_time',
    sortDirKey: 'DESC'
  };
  pageSize =
    {
      totalPage: 0,
      count: 0
    };
  newvision: any = false;
  selectsearchtype: any = 2;
  selectsearchvalue: any;
  dateValue: any = '1';
  ngAfterViewInit() {

  }
  btns: any;
  dcdcsvwj = true;
  showdate: string;
  showdate1: string;
  myDate: any;
  myDate1: any;
  _startDate = null;
  _endDate = null;
  orderprocessingswitch: any; // 订单处理开关
  selectedindex = 0;
  constructor(private route: ActivatedRoute, private http: HttpService, private notification: NzNotificationService) {
    this.notification.config({
      nzPlacement: 'topRight'
    });
   }



  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      const test = params['test'];
      if (test) {
        this.params.search.test = test;
        this.getorderstatus(test);
      } else {
        this.params.search.test = '';
      }

    });
    this._startDate = new Date(Date.now());
    this._endDate = new Date(Date.now());
    this.params.search.startdate = GMTToStr(this._startDate);
    this.params.search.enddate = GMTToStr(this._endDate);
    this.btns = Authbts('订单管理', '退货单列表');
    this.dcdcsvwj = Whetherdisplay(this.btns, '导出到CSV文件');
    // 获取门店列表
    this.getStorelist();
    // 获取企业渠道
    this.getchannels();
    // 获取退单列表
    this.getreturnlist(this.params);
    this.getorderprocessing();
  }
  getorderprocessing() {
    const opt = {
      search: { property: 1000 }
    };
    this.http.getagreement.request(opt)
      .subscribe(res => {
        if (res['code'] === '1' && res['data']) {
          this.orderprocessingswitch = res['data']['order_examine'];
        }
      });
  }
  // 获取渠道
  channels: any[];
  getchannels(): void {
    this.http.getChannels.request({ 'ebls_split': true })
      .subscribe(channels => {
        if (channels['code'] === '0' && channels['data']) {
          this.channels = channels['data']['rows'];
          const tmp = [{ channel_keyword: '', name: '全部渠道' }].concat(this.channels);
          this.channels = tmp;
        }
      });
  }

  // 获取门店列表
  stores: any;
  getStorelist() {
    this.http.getStorelist.request()
      .subscribe(stores => {
        if (stores['code'] === '0' && stores['data']) {
          this.stores = stores['data'];
          const tmp = [{ code: '', codename: '全部门店' }].concat(this.stores);
          this.stores = tmp;
        }
      });
  }

  // 门店列表选择
  searchcode($event) {
    this.params.search.region_code = $event;
    this.getreturnlist(this.params);
  }
  // 接收翻页操作传过来的值，然后请求服务得到新数据
  childparams($event) {
    let childoption = $event;
    this.params.page_no = childoption.page_no;
    this.cow = (childoption.page_no - 1) * childoption.page_size;
    this.getreturnlist(childoption);
  }
  changecount: any = 0;
  // 获取退单列表
  cow: number = 0; // 序号
  returnlists: any;
  getreturnlist(params) {
    if (String(params.search.startdate).length === 10) {
      params.search.startdate = String(params.search.startdate) + ' 00:00:00';
    }
    if (String(params.search.enddate).length === 10) {
      params.search.enddate = String(params.search.enddate) + ' 23:59:59';
    }
    this.cow = (params.page_no - 1) * params.page_size;
    this.http.getchargeback.request(params)
      .subscribe(returnlists => {
        if (returnlists['code'] === '0' && returnlists['data']) {
          this.returnlists = returnlists['data']['rows'];
          this.pageSize.count = returnlists['data']['count'];
          this.changecount = returnlists['data']['count'];
        }

      });
  }

  // 退货详情
  returndetails: any;
  selectedreturn: any;
  getreturndetail(sheetno: string, returnlist: any) {
    if (this.returndetails) {
      this.returndetails = false;
    } else {
      this.selectedreturn = returnlist;
      const opt = {
        search: { sheetno: sheetno }
      };
      this.http.getreturnlist.request(opt)
        .subscribe(returndetails => {
          if (returndetails['code'] === '0' && returndetails['data']) {
            this.returndetails = returndetails['data'];
          }
        });
    }
  }


  getchannel(channel) {
    this.params.search.channel_keyword = channel;
    this.cow = 0;
    this.params.page_no = 1;
    this.getreturnlist(this.params);
  }
  getorderstatus(status) {
    this.status = status;
    this.params.search.test = status;
    this.cow = 0;
    this.params.page_no = 1;
    this.params.search.type = '';
    this.getreturnlist(this.params);
  }
  hxzt: any = '';
  getorderhxzt(hxzt) {
    this.hxzt = hxzt;
    this.params.search.hxzt = hxzt;
    this.cow = 0;
    this.params.page_no = 1;
    this.getreturnlist(this.params);
  }

  hidesearch: boolean = false;
  j: number = 0;
  togglesearch(event) {
    this.j++;
    if (this.j % 2 !== 0) {
      this.hidesearch = true;
      event.target.value = '收起↑';
    } else {
      this.hidesearch = false;
      event.target.value = '展开更多↓';
    }
  }
  status: any = '';

  // 退单查询
  getReturnlistQuery() {
    this.cow = 0;
    this.params.page_no = 1;
    this.getreturnlist(this.params);
  }

  // 重置查询条件
  OrderRest() {
    this.params.search.channel_keyword = '';
    this.params.search.channel_sheetno = '';
    this.params.search.sheetno = '';
    this.params.search.region_code = '';
    this.params.search.startdate = '';
    this.params.search.enddate = '';
    this._startDate = null;
    this._endDate = null;
    this.params.search.mobile = '';
    this.params.search.test = '';
    this.params.search.hxzt = '';
    this.selectsearchvalue = '';
    this.params.search.date_type = 'return_time';
  }
  // 导出csv
  addexport() {
    let datePipe = new DatePipe('en-US');
    let stime = new Date(datePipe.transform(this.params.search.startdate, 'yyyy-MM-dd'));
    let ntime = new Date(datePipe.transform(this.params.search.enddate, 'yyyy-MM-dd'));
    let days = (Date.parse(ntime.toDateString()) - Date.parse(stime.toDateString())) / 1000 / 60 / 60 / 24;
    if (days > 30) {
      this.notification.create('error', '温馨提示', "日期范围应在一个月之内");
      return false;
    } else {
      let exportname: any, startdate: any, enddate: any, channel_keyword: any;
      if (this.params.search.startdate) {
        let strdate = String(this.params.search.startdate).substr(0, 10);
        startdate = strdate + '―';
      } else { startdate = ''; }
      if (this.params.search.enddate) {
        let endstr = String(this.params.search.enddate).substr(0, 10);
        enddate = endstr + '-';
      } else { enddate = ''; }
      if (this.params.search.channel_keyword) { channel_keyword = this.params.search.channel_keyword + '-'; } else { channel_keyword = '' }
      exportname = startdate + enddate + channel_keyword;
      let parame = {
        'path': '/test-export-bsp/bsporder/chargeback/getchargeback',
        'search': {},
        'desc': exportname + '退货单列表',
        'sort': 'order_time',
        'sortDirKey': 'DESC',
        'export_columns': [
          { 'name': '渠道', 'key': 'channel_keyword' },
          { 'name': '门店', 'key': 'region_name' },
          { 'name': '渠道订单号', 'key': 'channel_sheetno' },
          { 'name': '退货单号', 'key': 'sheetno' },
          { 'name': '订单状态', 'key': 'returnStatus.test' },
          { 'name': '核销状态', 'key': 'returnStatus.pos' },
          { 'name': '退款金额', 'key': 'total_pay_value' },
          { 'name': '佣金', 'key': 'commission_value' },
          { 'name': '退货人', 'key': 'receiver.name' },
          { 'name': '退货人手机号', 'key': 'receiver.mobile' },
          { 'name': '退货时间', 'key': 'return_time' },
          { 'name': '创建时间', 'key': 'create_time' },
          { 'name': '核销时间', 'key': 'pos_time' }
        ]

      };
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
  }

  startchange(event) {
    this._startDate = event;
    this.params.search.startdate = GMTToStr(event) + ' 00:00:00';
  }
  endchange(event) {
    this._endDate = event;
    this.params.search.enddate = GMTToStr(event) + ' 23:59:59';
  }

  selectsearch(type, value) {
    if (type === 1) {
      this.params.search.sheetno = value;
      this.params.search.channel_sheetno = '';
      this.params.search.mobile = '';
    }
    if (type === 2) {
      this.params.search.sheetno = '';
      this.params.search.channel_sheetno = value;
      this.params.search.mobile = '';
    }
    if (type === 3) {
      this.params.search.sheetno = '';
      this.params.search.channel_sheetno = '';
      this.params.search.mobile = value;
    }
    this.cow = 0;
    this.params.page_no = 1;
    this.getreturnlist(this.params);
  }
  startchangenew(event) {
    this._startDate = event;
    this.params.search.startdate = GMTToStr(event) + ' 00:00:00';
    this.dateValue = '';
    this.cow = 0;
    this.params.page_no = 1;
    this.getreturnlist(this.params);
  }
  endchangenew(event) {
    this._endDate = event;
    this.params.search.enddate = GMTToStr(event) + ' 23:59:59';
    this.dateValue = '';
    this.cow = 0;
    this.params.page_no = 1;
    this.getreturnlist(this.params);
  }
  channeltabs(channelopt, j) {
    this.returnlists = [];
    this.cow = 0;
    this.params.page_no = 1;
    this.params.search.channel_keyword = channelopt;
    this.selectedindex = j;
    this.getreturnlist(this.params);
  }
  selectvision(type) {
    if (type === '1') {
      this.newvision = false;
    } else {
      this.newvision = true;
    }

  }
  updatelist(event) {
    this.getreturnlist(this.params);
  }



}

