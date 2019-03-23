import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { BaseParams } from 'src/app/models';
import { HttpService } from 'src/app/http/http.service';
import { GMTToStr, Authbts, Whetherdisplay } from 'src/app/validates/validates';
import { DatePipe } from '@angular/common';
import { NzNotificationService } from 'ng-zorro-antd';


@Component({
  templateUrl: './order.html',
  styleUrls: ['./order.less']
})
export class Order implements OnInit, AfterViewInit {
  stores: any;
  //请求参数
  params: BaseParams = {
    search: {
      channel_keyword: '',
      channel_sheetno: '',
      order_status: '',
      region_code: '',
      startdate: '',
      enddate: '',
      mobile: '',
      type: '',
      date: '',
      pos: '',
      sghx: false,
      order_seq: '',
      time_type: '1',
      bill_type: '',
      pre_order: false
    },
    page_size: 20,
    page_no: 1,
    sort: 'order_time',
    sortDirKey: 'DESC'
  };
  pageSize =
    {
      totalPage: 0,
      count: 0
    };
  newvision: any = false;
  selectsearchtype: any = 1;
  selectsearchvalue: any;
  dateValue: any = '1';
  showdate: string;
  showdate1: string;
  hidesearch: boolean = false;
  btns: any;
  dcdcsvwj: boolean = true;
  dyxp: boolean = true;
  _startDate = null;
  _endDate = null;
  region_name: string;
  userentid: any;
  user: any;
  orderprocessingswitch: any; // 订单处理开关
  selectedindex = 0;
  ngAfterViewInit() {

  }
  modalwidth: number; // 弹出框宽度
  modaltitle: string; // 弹出框title
  modalstatus: boolean; // 弹出框状态
  modalconfirloading: boolean; // 弹出框提交loading
  confirmisshow: boolean; // 弹出框是否显示确认按钮
  constructor(private router: ActivatedRoute, private http: HttpService, private notification: NzNotificationService) {
    // let datePipe = new DatePipe('en-US');
    // let newDate = new Date;
    // let preDate = newDate.setDate(newDate.getDate());
    // let preDate1 = newDate.setDate(newDate.getDate());
    // this.showdate = datePipe.transform(preDate, 'yyyy-MM-dd 23:59:59');
    // this.showdate1 = datePipe.transform(preDate1, 'yyyy-MM-dd 00:00:00');
    const localuser = window.localStorage.getItem('userinfo');
    this.userentid = JSON.parse(localuser).ent_id;
    this.user = JSON.parse(localuser).code;
    this.notification.config({
      nzPlacement: 'topRight'
    });
  }

  recommends: Array<string>;

  ngOnInit(): void {
    this._startDate = new Date(Date.now());
    this._endDate = new Date(Date.now());
    this.params.search.startdate = GMTToStr(this._startDate);
    this.params.search.enddate = GMTToStr(this._endDate);
    this.btns = Authbts('订单管理', '订单详情');
    this.dcdcsvwj = Whetherdisplay(this.btns, '导出到CSV文件');
    this.dyxp = Whetherdisplay(this.btns, '打印小票');
    this.router.params.forEach((datas: Params) => {
      if (datas['type'] && datas['date']) {
        let regioncode = datas['code'];
        this.params.search.region_code = regioncode;
        this.params.search.mobile = datas['mobile'];
        this.params.search.type = datas['type'];
        this.params.search.date = datas['date'];
      } else {
        this.params.search.region_code = '';
        this.params.search.mobile = '';
        this.params.search.type = '';
        this.params.search.date = '';
        // this.params.search.startdate = String(this.showdate1);
        // this.params.search.enddate = String(this.showdate);
      }
      const status = datas['status'];
      if (status) {
        this.params.search.status = status;
        this.getorderstatus(status);
      } else {
        this.params.search.status = '';
      }
    });



    this.getOrdersLists(this.params);

    this.getStorelist();

    this.getchannels();
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
  channels: any[];
  // 获取渠道
  getchannels(): void {
    this.http.getChannels.request({ 'ebls_split': true })
      .subscribe(channels => {
        if (channels['code'] === '0' && channels['data']['rows']) {
          this.channels = channels['data']['rows'];
          const tmp = [{ channel_keyword: '', name: '全部渠道' }].concat(this.channels);
          this.channels = tmp;
        }
      });
  }
  dedupe(array) {
    return Array.from(new Set(array));
  }
  searchcode($event) {
    this.params.search.region_code = $event;
    this.getOrdersLists(this.params);
  }
  // 门店列表选择显示编码加名称
  searchname($event) {
    this.region_name = $event;
  }

  orders: any;
  totalpage: number;
  exportstartdate: any;
  exportenddate: any;
  changecount: any = 0;
  // 订单列表 ，订单数量

  getOrdersLists(params) {

    this.exportstartdate = params.search.startdate;
    this.exportenddate = params.search.enddate;
    if (String(params.search.startdate).length === 10) {
      params.search.startdate = String(params.search.startdate) + ' 00:00:00';
    }
    if (String(params.search.enddate).length === 10) {
      params.search.enddate = String(params.search.enddate) + ' 23:59:59';
    }
    if (!/^[0-9]{1,10}$/.test(this.params.search.order_seq) && this.params.search.order_seq !== '') {
      this.notification.create('error', '温馨提示', '订单序号只能输入正整数并且小于10位!');
    } else {
      this.cow = (params.page_no - 1) * params.page_size;
      this.http.getorders.request(params)
        .subscribe(res => {
          if (res['code'] === '0' && res['data']) {
            this.orders = res['data'];
            if (res['data']['start']) {
              this.params.search.startdate = String(res['data']['start']);
              this._startDate = new Date(this.params.search.startdate);
            }
            if (res['data']['end']) {
              this.params.search.enddate = String(res['data']['end']);
              this._endDate = new Date(this.params.search.enddate);
            }
            if (res['data']['count']) {
              this.totalpage = (res['data']['count'] % this.params.page_size == 0) ?
                Math.floor(res['data']['count'] / this.params.page_size)
                : Math.ceil(res['data']['count'] / this.params.page_size);
              this.pageSize.count = res['data']['count'];
              this.changecount = res['data']['count'];
            }
          }
        });
    }

  }

  totaldiv12: boolean = false;
  orderogs: any;
  getOrdersLog(order) {
    this.totaldiv12 = true;
    let channel_sheetno = order.channel_sheetno;
    let data = { channel_sheetno: channel_sheetno };
    this.http.getorderslog.request(data)
      .subscribe(orderog => {
        this.orderogs = orderog;
      });
  }


  // 获取门店列表
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

  ordersdetailnew: any;
  clickarr: any[] = [];
  selectedOrder: any[] = [];
  selectorder: any;
  // 订单详情
  getorderdetailnew(channel_sheetno: any, order) {
    if (!this.ordersdetailnew) {
      this.selectorder = order;
      const opt = {
        search: { channel_sheetno: channel_sheetno, request_type: 'PC' }
      }
      this.http.getorderdetail.request(opt)
        .subscribe(ordersdetailnew => {
          if (ordersdetailnew['code'] === '0' && ordersdetailnew['data']) {
            this.ordersdetailnew = ordersdetailnew['data'];
          }

        });
      if (order.channel_keyword === 'MTWM') {
        this.gotoorderstatus(order.mtwm_out_key);
      } else {
        this.gotoorderstatus(channel_sheetno);
      }
    } else {
      this.ordersdetailnew = false;
    }


  }
  ordersdetail: any;
  getorderdetail(channel_sheetno: any, order: any) {
    if (this.ordersdetail) {
      this.ordersdetail = false;
    } else {
      this.selectedOrder = order;
      const opt = {
        search: { channel_sheetno: channel_sheetno }
      };
      this.http.getorderdetail.request(opt)
        .subscribe(ordersdetail => {
          if (ordersdetail['code'] === '0' && ordersdetail['data']) {
            this.ordersdetail = ordersdetail['data'];
          }
        });
    }

  }

  // 订单查询
  getOrdersQuery() {
    let searchs = this.params.search;
    if (searchs.bill_type == '' && searchs.channel_keyword == '' && searchs.channel_sheetno == '' && searchs.date == '' && searchs.mobile == '' && searchs.order_seq == '' && searchs.order_status == '' && searchs.pos == '' && searchs.region_code == '' && searchs.enddate == '' && searchs.startdate == '') {
      this.notification.create('error', '温馨提示', "请输入查询条件")
      return;
    }
    this.cow = 0;
    this.params.page_no = 1;
    this.params.search.type = '';

    this.getOrdersLists(this.params);
  }
  // 触发式查询
  gosearch(event, data) {

    let isChecked = event.currentTarget.checked;

    if (isChecked) {
      if (data === '1') {
        this.params.search.sghx = true;
      }
      if (data === '2') {
        this.params.search.pre_order = true;
      }

    } else {
      if (data === '1') {
        this.params.search.sghx = false;
      }
      if (data === '2') {
        this.params.search.pre_order = false;
      }
    }
    this.params.page_no = 1;
    this.cow = 0;
    this.getOrdersLists(this.params);



  }
  gosearchnew() {
    this.params.page_no = 1;
    this.cow = 0;
    this.getOrdersLists(this.params);



  }

  OrderRest() {
    this.params.search.channel_keyword = '';
    this.params.search.channel_sheetno = '';
    this.params.search.order_status = '';
    this.params.search.region_code = '';
    this.params.search.startdate = '';
    this.params.search.enddate = '';
    this._startDate = null;
    this._endDate = null;
    this.params.search.mobile = '';
    this.params.search.type = '';
    this.params.search.date = '';
    this.params.search.pos = '';
    this.params.search.order_seq = '';
    this.params.search.sghx = false;
    this.params.search.pre_order = false;
    this.status = '';
    this.types = '';
    this.params.search.time_type = '1';
    this.params.search.bill_type = '';
    this.selectsearchvalue = '';
  }

  addexport() {
    let datePipe = new DatePipe('en-US');
    let stime = new Date(datePipe.transform(this.exportstartdate, 'yyyy-MM-dd'));
    let ntime = new Date(datePipe.transform(this.exportenddate, 'yyyy-MM-dd'));
    let days = (Date.parse(ntime.toDateString()) - Date.parse(stime.toDateString())) / 1000 / 60 / 60 / 24;
    if (days > 30) {
      this.notification.create('error', '温馨提示', "请导出一个月之内的数据!");
      return false;
    } else {
      let exportname: any, startdate: any, enddate: any, pos: any;
      if (this.exportstartdate) {
        let strdate = String(this.exportstartdate).substr(0, 10);
        startdate = strdate + '―';
      } else { startdate = ''; }
      if (this.exportenddate) {
        let endstr = String(this.exportenddate).substr(0, 10);
        enddate = endstr + '-';
      } else { enddate = ''; }
      if (this.params.search.pos === '1') { pos = '已核销' + '-'; } else if (this.params.search.pos === '-1') { pos = '未核销' + '-'; } else { pos = '' }
      exportname = startdate + enddate + pos;
      let parame = {
        'path': '/test-export-bsp/order/getorders',
        'search': {},
        'desc': exportname + '订单详情',
        'sort': 'order_time',
        'sortDirKey': 'DESC',
        'export_columns': [
          { 'name': '渠道', 'key': 'channel_name' },
          { 'name': '门店编码', 'key': 'region_code' },
          { 'name': '门店名称', 'key': 'region_name' },
          { 'name': '订单号', 'key': 'channel_sheetno' },
          { 'name': '是否预约单', 'key': 'pre_order_desc' },
          { 'name': '预计送达开始时间', 'key': 'delivery_time_start' },
          { 'name': '预计送达结束时间', 'key': 'delivery_time_end' },
          { 'name': '配送方式', 'key': 'logistics_mode_desc' },
          { 'name': '订单状态', 'key': 'order_status_center' },
          { 'name': '核销状态', 'key': 'pos' },
          { 'name': '支付金额', 'key': 'payable_value' },
          { 'name': '收入金额', 'key': 'total_sale_value' },
          { 'name': '商品金额', 'key': 'total_item_value' },
          { 'name': '配送费', 'key': 'payable_logistics_value' },
          { 'name': '包装费', 'key': 'package_fee' },
          { 'name': '餐盒费', 'key': 'box_value' },
          { 'name': '平台佣金', 'key': 'commission_value' },
          { 'name': '整单总优惠', 'key': 'total_disc_value' },
          { 'name': '整单商家优惠', 'key': 'total_sj_disc' },
          { 'name': '整单平台优惠', 'key': 'total_pt_disc' },
          { 'name': '单品总优惠', 'key': 'total_dp_disc' },
          { 'name': '单品商家优惠', 'key': 'total_sj_dp' },
          { 'name': '单品平台优惠', 'key': 'total_pt_dp' },
          { 'name': '商家运费收入', 'key': 'freight_value' },
          { 'name': '运费总优惠', 'key': 'logistics_disc' },
          { 'name': '运费商家优惠', 'key': 'logistics_sj_disc' },
          { 'name': '运费平台优惠', 'key': 'logistics_pt_disc' },
          { 'name': '订单序号', 'key': 'order_seq' },
          { 'name': '总件数', 'key': 'total_item_num' },
          { 'name': '收货人', 'key': 'receiver_name' },
          { 'name': '收货人手机号', 'key': 'receiver_mobile' },
          { 'name': '收货人地址', 'key': 'receiver_address' },
          { 'name': '下单时间', 'key': 'order_time' },
          { 'name': '接收时间', 'key': 'receive_time' },
          { 'name': '接单时间', 'key': 'confirm_time' },
          { 'name': '备货时间', 'key': 'stocking_time' },
          { 'name': '配送时间', 'key': 'delivery_time' },
          { 'name': '完成时间', 'key': 'complete_time' },
          { 'name': '取消时间', 'key': 'cancel_time' },
          { 'name': '核销时间', 'key': 'pos_time' },
          { 'name': '下单手机号', 'key': 'buyer_tel' },
          { 'name': '备注', 'key': 'note' }
        ]

      };
      this.params.search.type = '';
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

  cow: number = 0;
  // 订单分页
  getPageOrders(page: any) {
    this.params.search.type = '';
    if (page == 0) {
      this.notification.create('warning', '温馨提示', '已到首页');
      return;
    }
    if (page > this.totalpage) {
      this.notification.create('warning', '温馨提示', '已到尾页');
      return;
    }
    this.params.page_no = page;
    this.cow = (this.params.page_no - 1) * this.params.page_size;
    this.getOrdersLists(this.params);
  }
  types: any = 1;
  status: any = '';
  // 日周月查询
  getdate(xh) {
    this.types = xh;
    this.params.search.startdate = '';
    this.params.search.enddate = '';
    this.cow = 0;
    this.params.page_no = 1;
    if (xh == 1) {
      let datePipe = new DatePipe('en-US');
      let newDate = new Date;
      this.params.search.type = 1;
      this.params.search.date = datePipe.transform(newDate, 'yyyy-MM-dd');
      this.getOrdersLists(this.params);

      // this.params.search.startdate = this.types;
      this.params.search.date = null;
      // this._startDate = event;
    }
    if (xh == 2) {
      let datePipe = new DatePipe('en-US');
      let newDate = new Date;
      let preDate1 = newDate.setDate(newDate.getDate() - 1);
      this.params.search.type = 1;
      this.params.search.date = datePipe.transform(preDate1, 'yyyy-MM-dd');
      this.getOrdersLists(this.params);
    }
    if (xh == 3) {
      let datePipe = new DatePipe('en-US');
      let newDate = new Date;
      let preDate1 = newDate.setDate(newDate.getDate() - 2);
      this.params.search.type = 1;
      this.params.search.date = datePipe.transform(preDate1, 'yyyy-MM-dd');
      this.getOrdersLists(this.params);
    }
    if (xh == 4) {
      let datePipe = new DatePipe('en-US');
      let newDate = new Date;
      let preDate1 = newDate.setDate(newDate.getDate() - 7);
      this.params.search.type = 2;
      this.params.search.date = datePipe.transform(preDate1, 'yyyy-MM-dd');
      this.getOrdersLists(this.params);
    }
    if (xh == 5) {
      let datePipe = new DatePipe('en-US');
      let newDate = new Date;
      this.params.search.type = 3;
      this.params.search.date = datePipe.transform(newDate, 'yyyy-MM-dd');
      this.getOrdersLists(this.params);
    }
    // this.params.search.date = null;


  }
  cleartype() {
    this.params.search.type = '';
  }
  getchannel(channel) {
    this.params.search.channel_keyword = channel;
    this.cow = 0;
    this.params.page_no = 1;
    this.getOrdersLists(this.params);
  }
  getorderstatus(status) {
    this.status = status;
    this.params.search.order_status = status;
    this.cow = 0;
    this.params.page_no = 1;
    this.getOrdersLists(this.params);
  }
  printorder: any;
  ordersdetailprint: any;
  gotoprint(order) {// 小票打印
    this.modalwidth = 800;
    this.modaltitle = '打印小票';
    this.modalstatus = true;
    this.confirmisshow = false;

    this.printorder = order;
    this.http.getorderdetail.request({ channel_sheetno: order.channel_sheetno })
      .subscribe(ordersdetailnew => {
        this.ordersdetailprint = ordersdetailnew;
      });
  }
  closemodal() { // 关闭弹出框时重置modalstatus默认值
    this.modalstatus = false;
  }
  handleokfun(key) {
    switch (key) {
      case '':

        break;
    }
  }

  orderStatus: any;
  totaldiv3: boolean = false;
  // 订单轨迹
  gotoorderstatus(channel_sheetno) {
    this.http.getorderstatus.request({ channel_sheetno: channel_sheetno })
      .subscribe(
        res => {
          this.orderStatus = res;
        });
  }
  invoiceobj: any;
  invoice(opt: any, payable_value) {
    this.modalwidth = 600;
    this.modaltitle = '发票信息';
    this.modalstatus = true;
    this.confirmisshow = false;
    this.invoiceobj = opt;
    this.invoiceobj.money = payable_value;
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
      this.params.search.channel_sheetno = value;
      this.params.search.order_seq = '';
      this.params.search.mobile = '';
    }
    if (type === 2) {
      this.params.search.channel_sheetno = '';
      this.params.search.order_seq = value;
      this.params.search.mobile = '';
    }
    if (type === 3) {
      this.params.search.channel_sheetno = '';
      this.params.search.order_seq = '';
      this.params.search.mobile = value;
    }
    this.cow = 0;
    this.params.page_no = 1;
    this.getOrdersLists(this.params);
  }
  startchangenew(event) {
    this._startDate = event;
    this.params.search.startdate = GMTToStr(event) + ' 00:00:00';
    this.dateValue = '';
    this.cow = 0;
    this.params.page_no = 1;
    this.params.search.date = '';
    this.params.search.type = '';
    this.getOrdersLists(this.params);
  }
  endchangenew(event) {
    this._endDate = event;
    this.params.search.enddate = GMTToStr(event) + ' 23:59:59';
    this.dateValue = '';
    this.cow = 0;
    this.params.page_no = 1;
    this.params.search.date = '';
    this.params.search.type = '';
    this.getOrdersLists(this.params);
  }
  channeltabs(channelopt, j) {
    this.orders = [];
    this.cow = 0;
    this.params.page_no = 1;
    this.params.search.channel_keyword = channelopt;
    this.selectedindex = j;
    this.getOrdersLists(this.params);
  }
  // 接收翻页操作传过来的值，然后请求服务得到新数据
  childparams($event) {
    const childoption = $event;
    this.params.page_no = childoption.page_no;
    this.cow = (childoption.page_no - 1) * childoption.page_size;
    this.getOrdersLists(childoption);
  }
  selectvision(type) {
    if (type === '0') {
      this.newvision = true;
    } else {
      this.newvision = false;
    }

  }
  remark: any;
  // 订单处理
  orderprocessing(order, i) {
    const opt = {
      channel_keyword: order.channel_keyword,
      ent_id: this.userentid,
      region_code: order.region_code,
      user: this.user,
      channel_sheetno: order.channel_sheetno,
      sfty: null,
      reason: null
    };
    if (i === '1') {
      opt.sfty = false;
      opt.reason = this.remark;
    }
    if (i === '2') {
      opt.sfty = true;
    }
    this.http.cancelOrderApprove.request(opt)
      .subscribe(res => {
        if (res['code'] === 1) {
          this.notification.create('success', '温馨提示', '操作成功');
        } else {
          this.notification.create('error', '温馨提示', '操作失败' + '(' + res['msg'] + ')');
        }
      });

  }
  visible: boolean;
  closeMe() {
    this.visible = false;
    this.remark = '';
  }
  updatelist(event) {
    this.getOrdersLists(this.params);
  }
}
