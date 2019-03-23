import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/http/http.service';
import { DatePipe } from '@angular/common';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'app-testsettlement',
  templateUrl: './testsettlement.component.html',
  styleUrls: ['./testsettlement.component.less']
})
export class testsettlementComponent implements OnInit {
  public pageIndex = 1;
  public queryList = new Array();
  public storelist: any; // 门店列表
  public settlementlists: any;
  public channels: any; // 渠道列表
  public initchannels: any;
  public ordersdetails: any; // 订单详情信息
  public ordersdetail: any;   // 订单基本信息
  public modalShow = false; // 订单详情弹窗
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

  constructor(private http: HttpService, private notification: NzNotificationService) {
    this.notification.config({
      nzPlacement: 'topRight'
    });
  }



  ngOnInit() {
    this.queryList = [
      {
        show: true,
        type: "select",
        label: "所属渠道",
        name: "channel_keyword",
        code: "",
        list: this.getSelection('channel')
      },
      {
        show: true,
        type: "input",
        label: "订单号",
        name: "channel_sheetno",
        value: ''
      },
      {
        show: true,
        type: "select",
        label: "门店",
        name: "region_code",
        search: true,
        code: "",
        list: this.getSelection('region_code')
      },

      {
        show: true,
        type: "date-picker",
        label: "账单时间",
        name1: "start_time",
        name2: "end_time",
        value: [new Date(Date.now() - 3600 * 48 * 1000), new Date(Date.now() - 3600 * 24 * 1000)],
        value1: "",
        value2: ""
      },
      {
        show: true,
        type: "select",
        label: "日期类型",
        name: "date_type",
        code: "order_time",
        list: [
          {
            name: "完成日期",
            code: "complete_time"
          },
          {
            name: "下单日期",
            code: "order_time"
          },
        ],
      },
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
            this.queryList.forEach((item) => {
              if (item.name === name) {
                item.list = JSON.parse(JSON.stringify(data)).map((item1, index) => {
                  let obj = {
                    code: item1.code,
                    name: item1.codename
                  };
                  return obj;
                });
                item.list.push({
                  code: "",
                  name: "全部门店"
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
  // 接收翻页操作传过来的值，然后请求服务得到新数据
  childparams($event) {
    const childoption = $event;
    this.params.page_no = childoption.page_no;
    this.gettestsettlement();
  }
  // 获取所有查询条件
  search($event) {
    console.log($event);
    this.params.search = $event;
    this.gettestsettlement();

  }

  gettestsettlement() {
    this.http.gettestsettlement.request(this.params)
      .subscribe(data => {
        this.settlementlists = data['rows'];
        this.pageSize.count = data['count'];
      });

  }

  // 获取订单详情
  gotodetail(item) {
    console.log(item);
    this.http.getOrderListDetail.request(item)
      .subscribe(data => {
        this.modalShow = true;
        this.ordersdetail = data;
        this.ordersdetails = data['order_details'];
      })
  }

  closeModel() {
    this.modalShow = false;
  }

  // 导出
  // 导出
  addexport() {
    let parame = {
      'path': '/test-export-bsp/balance/getbalances',
      'search': {
        channel_keyword: '',
        region_code: '',
        start_date: '',
        end_date: '',
        date_type: '',
        channel_sheetno: ''
      },
      'desc': '商家结算对账表',
      'export_columns': [
        { 'name': '渠道', 'key': 'channel_name' },
        { 'name': '渠道订单号', 'key': 'channel_sheetno' },
        { 'name': '门店', 'key': 'region_name' },
        { 'name': '原价', 'key': 'total_item_yj' },
        { 'name': '成交价', 'key': 'total_item_value' },
        { 'name': '整单优惠总额', 'key': 'total_disc_value' },
        { 'name': '商家整单优惠', 'key': 'total_sj_disc' },
        { 'name': '平台单品优惠', 'key': 'total_pt_dp' },
        { 'name': '商家单品总优惠', 'key': 'total_sj_dp' },
        { 'name': '商家运费优惠', 'key': 'logistics_sj_disc' },
        { 'name': '提成销售额', 'key': 'total_item_js' },
        // { 'name': '订单总额', 'key': 'total_sale_value' },
        { 'name': '下单时间', 'key': 'order_time' },
        { 'name': '完成时间', 'key': 'complete_time' }

      ]

    };
    if (this.params.search.start_date !== '' && this.params.search.end_date !== '') {
      parame.search = this.params.search;
      this.http.addexport.request(parame)
        .subscribe(data => {
          console.log(data);
          this.notification.create('success', '温馨提示', data['msg']);
        });
    } else {
      this.notification.create('error', '温馨提示', ' 导出需要选择时间范围! ');
    }

  }

}
