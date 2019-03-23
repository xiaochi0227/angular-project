import { Component, OnInit } from '@angular/core';

import { Route, ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/http/http.service';
import { DatePipe } from '@angular/common';
import { NzNotificationService } from 'ng-zorro-antd';
@Component({
  selector: 'app-billingdetails',
  templateUrl: './billingdetails.component.html',
  styleUrls: ['../statement/statement.component.less']
})
export class BillingdetailsComponent implements OnInit {
  public queryList = new Array();
  public searchStart = false;
  public billingdetails: any; // 订单详情信息
  public hzobj: any; // 订单详情信息
  public ordersdetailnew: any; // 单个订单详情
  public params: any = {
    search: {},
    page_size: 20,
    page_no: 1,
  };
  public pageSize: any =
    {
      totalPage: 0,
      count: 0
    };
  statements: any;
  pageIndex: number;
  childparams: any;
  constructor(private route: ActivatedRoute, private http: HttpService, private notification: NzNotificationService) {
    this.notification.config({
      nzPlacement: 'topRight'
    });
  }


  ngOnInit() {
    this.route.params.forEach((paramsInfo) => {
      console.log(paramsInfo);
      if (paramsInfo['parme']) {
        this.params.search = JSON.parse(paramsInfo['parme']);
      }
    });
    console.log(this.params);
    this.params.search.date_type = 'settle_date';
    this.params.search.need_summary = true;
    this.queryList = [
      {
        show: true,
        type: "select",
        label: "门店",
        name: "region_code",
        search: true,
        code: this.params.search.region_code ? this.params.search.region_code : "",
        list: this.getSelection('region_code')
      },
      {
        show: true,
        type: "select",
        label: "渠道",
        name: "channel",
        code: this.params.search.channel_keyword ? this.params.search.channel_keyword : "",
        list: this.getSelection('channel')
      },
      {
        show: true,
        type: "input",
        label: "订单序号",
        name: "order_seq",
        value: ''
      },
      {
        show: true,
        type: "input",
        label: "订单编号",
        name: "channel_sheetno",
        value: ''
      },
      {
        show: true,
        type: "select",
        label: "订单类型",
        name: "order_type",
        code: "all",
        list: [
          {
            name: "全部",
            code: "all"
          },
          {
            name: "正向单",
            code: "order"
          },
          {
            name: "退货单",
            code: "order_return"
          },
          {
            name: "调整单",
            code: "adjust_order"
          },
        ],
      },
      {
        show: true,
        type: "date-picker",
        label: "时间",
        name1: "start_date",
        name2: "end_date",
        value: this.params.search.start_date ? [new Date(this.params.search.start_date[0]), new Date(this.params.search.end_date[0])] : [new Date(Date.now() - 3600 * 48 * 1000), new Date(Date.now() - 3600 * 24 * 1000)],
        value1: "",
        value2: ""
      },
      {
        show: true,
        type: "select",
        label: "异常单类型",
        name: "pos_type",
        code: "",
        list: [
          {
            name: "全部",
            code: ""
          },
          {
            name: "未核销",
            code: "1"
          },
          {
            name: "跨天核销",
            code: "2"
          }
        ],
      },
      {
        show: true,
        type: "checkbox",
        label: "超卖",
        name: "sghx",
        code: false
      }

    ];
  }

  // 获取下拉列表
  getSelection(name, parentCode = null) {
    // 避免经营渠道,已上线渠道，活动渠道多次请求
    switch (name) {
      case 'region_code':
        // 获取门店信息
        this.http.getStorelist.request({})
          .subscribe((data) => {
            this.searchStart = true;
            this.queryList.forEach((item) => {
              if (item.name === name) {
                item.list = JSON.parse(JSON.stringify(data)).map((item1, index) => {
                  if (item.code == "") {
                    if (index === 0) {
                      item.code = item1.code;
                    }
                  }
                  let obj = {
                    code: item1.code,
                    name: item1.codename
                  };
                  return obj;
                });
              }
            });
          });
        break;
      case 'channel':
        // 获取渠道
        this.http.getChannels.request({})
          .subscribe((data) => {
            this.queryList.forEach((item) => {
              if (item.name === name) {
                item.list = data['rows'].map((item1) => {
                  let obj = {
                    code: item1.channel_keyword,
                    name: item1.name
                  };
                  return obj;
                });
                item.list.push({
                  code: "",
                  name: "请选择渠道"
                });
              }
            });
          });
        break;
    }


  }


  // 获取所有查询条件
  search($event) {
    console.log(this.params);

    if (this.searchStart) {
      console.log(this.queryList);
      for (let key in $event) {
        this.params.search[key] = $event[key];
      };
      console.log(this.params);
      this.getbillingdetails();

    }

  }


  // 获取订单详情
  getbillingdetails() {
    this.http.getbillingdetails.request(this.params)
      .subscribe(data => {
        this.billingdetails = data['data']['rows'];
        this.hzobj = data;
        this.pageSize.count = data['data']['count'];
      })
  }

  // 查看订单详情
  toview(jyqd) {

    const params = {
      ent_id: '',
      channel_sheetno: jyqd.channel_sheetno,
      sheetno: jyqd.sheetno,
      order_type: jyqd.order_type
    };
    params.ent_id = this.params.search.ent_id;
    this.http.getbillingDetail.request(params)
      .subscribe(data => {
        this.ordersdetailnew = data;
      });
  }

  // 导出
  addexport() {
    if (this.params.start_date !== '' && this.params.end_date !== '') {
      const datePipe = new DatePipe('en-US');
      const stime = new Date(datePipe.transform(this.params.start_date, 'yyyy-MM-dd'));
      const ntime = new Date(datePipe.transform(this.params.end_date, 'yyyy-MM-dd'));
      const days = (Date.parse(ntime.toDateString()) - Date.parse(stime.toDateString())) / 1000 / 60 / 60 / 24;
      if (days > 6) {
        if (this.pageSize.count > 10000) {
          this.notification.create('error', '温馨提示', '请导出日期在七天之内或总账单数不大于10000的数据！');
          return false;
        } else {
          this.exportfun();
        }
      } else {
        this.exportfun();
      }

    } else {
      this.notification.create('error', '温馨提示', ' 导出需要选择日期! ');
    }

  }

  exportfun() {
    let exportname: any, start_date: any, end_date: any, channel_keyword: any, region_code: any;
    if (this.params.search.start_date) {
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
    const parame = {
      'path': '/test-export-bsp/billOrder/findOrder',
      'search': {},
      'desc': exportname + '账单导出',
      'export_columns': [
        { 'name': '账单日期', 'key': 'settle_date' },
        { 'name': '门店名称', 'key': 'region_name' },
        { 'name': '门店编码', 'key': 'region_code' },
        { 'name': '渠道', 'key': 'channel_keyword' },
        { 'name': '订单编号', 'key': 'channel_sheetno' },
        { 'name': '订单序号', 'key': 'order_seq' },
        { 'name': '结算金额(线上)', 'key': 'total_sale_value' },
        { 'name': '核销金额(线下)', 'key': 'pos_money' },
        { 'name': '差额', 'key': 'balance' },
        // { 'name': '价签金额', 'key': 'marked_value' },
        { 'name': '未核销金额', 'key': 'noposMoney' },
        { 'name': '不参与核销金额', 'key': 'exclude_pos_money' },
        { 'name': '订单原价', 'key': 'total_item_value' },
        { 'name': '商家优惠(整单)', 'key': 'total_sj_disc' },
        { 'name': '平台补贴(单品)', 'key': 'total_pt_dp' },
        { 'name': '佣金', 'key': 'commission_value' },
        { 'name': '商家包装费', 'key': 'package_fee' },
        { 'name': '餐盒费', 'key': 'box_value' },
        { 'name': '商家运费收入', 'key': 'logistics_sj_value' },
        { 'name': '运费佣金', 'key': 'logistics_sj_commission' },
        { 'name': '订单类型', 'key': 'order_type' },
        { 'name': '关联订单号', 'key': 'sheetno' },
        { 'name': '订单状态', 'key': 'status' }
      ]

    };
    parame.search = this.params.search;
    this.http.addexport.request()
      .subscribe(row => {
        if (row) {
          this.notification.create('success', '温馨提示', row['msg']);
        } else {
          this.notification.create('error', '温馨提示', '添加失败,请重试！');
        }
      });
  }


}
