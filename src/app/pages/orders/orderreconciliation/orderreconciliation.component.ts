import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseParams } from 'src/app/models';
import { HttpService } from 'src/app/http/http.service';
import { GMTToStr, Authbts, Whetherdisplay } from 'src/app/validates/validates';
import { NzNotificationService } from 'ng-zorro-antd';
@Component({
  templateUrl: './orderreconciliation.html',
  styleUrls: ['./orderreconciliation.less']
})


export class OrderReconciliation {

  // 请求参数
  params: BaseParams = {
    search: {
      channel_keyword: '',
      region_code: '',
      order_type: '',
      pos: '',
      status: '',
      date_type: '1',
      start_date: '',
      end_date: '',
      order_seq: '',
      need_summary: true
    },
    page_size: 20,
    page_no: 1,
    sort: 'timestamp',
    sortDirKey: 'DESC'
  };
  pageSize =
    {
      totalPage: 0,
      count: 0
    };
  btns: any;
  dcdcsvwj: boolean = true;
  showdate: string;
  showdate1: string;
  myDate: any;
  myDate1: any;
  _startDate = null;
  _endDate = null;
  region_name: string;
  constructor(private http: HttpService, private notification: NzNotificationService) {
    this.notification.config({
      nzPlacement: 'topRight'
    });
  }



  ngOnInit(): void {
    this._startDate = new Date(Date.now() - 3600 * 24 * 1000);
    this._endDate = new Date(Date.now() - 3600 * 24 * 1000);
    this.params.search.start_date = GMTToStr(this._startDate);
    this.params.search.end_date = GMTToStr(this._endDate);
    this.btns = Authbts('订单管理', '订单对账表');
    console.log(this.btns);
    this.dcdcsvwj = Whetherdisplay(this.btns, '导出到CSV文件');
    // 获取门店列表
    this.http.getStorelist.request()
      .subscribe(stores => {
        this.stores = stores;
        this.params.search.region_code = this.stores[0].code;
        this.region_name = this.stores[0].codename;
        this.getreconciliationlist(this.params);
      });
    // 获取企业渠道
    this.getchannels();
    // 获取列表

  }

  // 获取渠道
  channels: any[];
  getchannels(): void {
    this.http.getChannels.request({ 'ebls_split': true })
      .subscribe(channels => {
        console.log(channels);
        this.channels = channels['rows'];
      });
  }

  // 获取门店列表
  stores: any;
  getStorelist() {
    this.http.getStorelist.request()
      .subscribe(stores => {
        this.stores = stores;
        this.params.search.region_code = this.stores[0].code;
        this.region_name = this.stores[0].codename;
      });
  }

  // 门店列表选择
  searchcode($event) {
    this.params.search.region_code = $event;
  }
  // 门店列表选择显示编码加名称
  searchname($event) {
    this.region_name = $event;
  }
  //接收翻页操作传过来的值，然后请求服务得到新数据
  childparams($event) {
    let childoption = $event;
    this.params.page_no = childoption.page_no;
    this.cow = (childoption.page_no - 1) * childoption.page_size;
    this.getreconciliationlist(childoption);
  }
  changecount: any = 0;
  // 获取退单列表
  cow: number = 0; // 序号
  reconciliationlists: any;
  collect: any;
  conllect1: any;
  getreconciliationlist(params) {
    if (String(params.search.start_date).length === 10) {
      params.search.start_date = String(params.search.start_date) + ' 00:00:00';
    }
    if (String(params.search.end_date).length === 10) {
      params.search.end_date = String(params.search.end_date) + ' 23:59:59';
    }
    // let datePipe = new DatePipe('en-US');
    // param.search.start_date = datePipe.transform(this.params.search.start_date, 'yyyy-MM-dd 00:00:00');
    // param.search.end_date = datePipe.transform(this.params.search.end_date, 'yyyy-MM-dd 23:59:59');
    this.cow = (params.page_no - 1) * params.page_size;
    this.http.orderReport.request(params)
      .subscribe(res => {
        if (res) {
          this.collect = res['order_summary'];
          this.conllect1 = res['return_order_summary'];
          this.reconciliationlists = res['rows'];
          for (let i = 0; i < this.reconciliationlists.length; i++) {
            if (String(this.reconciliationlists[i].settle_date).substr(0, 10) !== String(this.reconciliationlists[i].pos_time).substr(0, 10)) {
              this.reconciliationlists[i].highlight = true;
            } else {
              this.reconciliationlists[i].highlight = false;
            }
          }
          this.pageSize.count = res['count'];
          this.changecount = res['count'];
          console.log(this.pageSize);

        }
      });
  }



  getchannel(channel) {
    this.params.search.channel_keyword = channel;
    this.cow = 0;
    this.params.page_no = 1;
    this.getreconciliationlist(this.params);
  }
  getorderstatus(status) {
    this.status = status;
    this.params.search.test = status;
    this.cow = 0;
    this.params.page_no = 1;
    this.params.search.type = '';
    this.getreconciliationlist(this.params);
  }
  hxzt: any = '';
  getorderhxzt(hxzt) {
    this.hxzt = hxzt;
    this.params.search.hxzt = hxzt;
    this.cow = 0;
    this.params.page_no = 1;
    this.getreconciliationlist(this.params);
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
  getreconlistQuery() {
    this.cow = 0;
    this.params.page_no = 1;
    this.getreconciliationlist(this.params);
  }

  // 重置查询条件
  OrderRest() {
    this.params.search.channel_keyword = '';
    this.params.search.pos_success = '';
    this.params.search.order_type = '';
    this.params.search.region_code = this.stores[0].code;
    this._startDate = new Date(Date.now() - 3600 * 24 * 1000);
    this._endDate = new Date(Date.now() - 3600 * 24 * 1000);
    this.params.search.start_date = GMTToStr(this._startDate);
    this.params.search.end_date = GMTToStr(this._endDate);
    this.params.search.pos = '';
    this.params.search.date_type = '1';
    this.params.search.status = '';
    this.params.search.order_seq = '';

  }
  // 导出csv
  addexport() {
    this.params.search.need_summary = false;
    let exportname: any, start_date: any, end_date: any, channel_keyword: any, region_code: any;
    if (this.params.search.startdate) {
      let strdate = String(this.params.search.start_date).substr(0, 10);
      start_date = strdate + '―';
    } else { start_date = ''; }
    if (this.params.search.end_date) {
      let endstr = String(this.params.search.end_date).substr(0, 10);
      end_date = endstr + '-';
    } else { end_date = ''; }
    if (this.params.search.region_code) { region_code = this.params.search.region_code + '-'; } else { region_code = '' }
    if (this.params.search.channel_keyword) { channel_keyword = this.params.search.channel_keyword + '-'; } else { channel_keyword = '' }
    exportname = region_code + start_date + end_date + channel_keyword;
    let parame = {
      'path': '/test-export-bsp/balance/orderReport',
      'search': {},
      'desc': exportname + '订单对账表',
      'sort': 'order_time',
      'sortDirKey': 'DESC',
      'export_columns': []
    };
    parame.search = this.params.search;
    let export_columns = [
      { 'name': '订单状态', 'key': 'status' },
      { 'name': '核销状态', 'key': 'pos' },
      { 'name': '发生日期', 'key': 'settle_date' },
      { 'name': '记账日期', 'key': 'pos_time' },
      { 'name': '订单号', 'key': 'channel_sheetno' },
      { 'name': '订单序号', 'key': 'order_seq' },
      { 'name': '渠道', 'key': 'channel_keyword' },
      { 'name': '门店', 'key': 'region_code' },
      { 'name': '收入金额', 'key': 'total_sale_value' },
      { 'name': '佣金', 'key': 'commission_value' },
      { 'name': '商家优惠', 'key': 'total_sj_disc' },
      { 'name': '包装费', 'key': 'package_fee' },
      { 'name': '平台单品优惠', 'key': 'total_pt_dp' },
      { 'name': '手工核销', 'key': 'sghx' },
      { 'name': '线下金额', 'key': 'offline_value' },
      { 'name': '订单类型', 'key': 'order_type' }
    ]
    parame.export_columns = export_columns.slice(0);
    this.http.addexport.request(parame)
      .subscribe(row => {

        if (row) {
          this.notification.create('success', '温馨提示', row['msg']);
        } else {
          this.notification.create('error', '温馨提示', '添加失败,请重试！');
        }

      });
  }

  selupd() {
    if (this.params.search.order_type === "return_order") {
      this.params.search.pos_success = "";
      this.params.search.status = "";
    }
  }
  startchange(event) {
    this._startDate = event;
    this.params.search.start_date = GMTToStr(event) + ' 00:00:00';
  }
  endchange(event) {
    this._endDate = event;
    this.params.search.end_date = GMTToStr(event) + ' 23:59:59';
  }
}
