import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/http/http.service';
import { BaseParams } from 'src/app/utils/base.list.params';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'app-costsharingreport',
  templateUrl: './costsharingreport.component.html',
  styleUrls: ['./costsharingreport.component.less']
})
export class CostsharingreportComponent implements OnInit {
  public params: BaseParams = {
    search: {},
    page_size: 50,
    page_no: 1,
    sort: 'timestamp',
    sortDirKey: 'DESC'
  };
  public queryList = new Array();
  public res: any;
  public pageSize =
    {
      totalPage: 0,
      count: 0
    };
  public promotionslists: any;
  constructor(private http: HttpService, private notification: NzNotificationService) {
    this.notification.config({
      nzPlacement: 'topRight'
    });
  }

  ngOnInit() {
    this.queryList = [
      {
        show: true,
        type: "input",
        label: "商品名称",
        name: "item_name",
        value: '',
      },
      {
        show: true,
        type: "input",
        label: "活动名称",
        name: "activity_id",
        value: ''
      },
      {
        show: true,
        type: "select",
        label: "门店",
        name: "region_code",
        search: true,
        list: this.getSelection('region_code')
      },
      {
        show: true,
        type: "select",
        label: "活动渠道",
        name: "channel_keyword",
        list: this.getSelection('channel_keyword')
      },
      {
        show: true,
        type: "date-picker",
        label: "选择时间",
        name1: "startdate",
        name2: "enddate",
        value: [new Date(Date.now() - 3600 * 48 * 1000), new Date(Date.now() - 3600 * 24 * 1000)],
        value1: "",
        value2: ""
      },
      {
        show: true,
        type: "select",
        label: "订单类型",
        name: "receive_price",
        list: [
          {
            name: "正向单",
            code: "1"
          },
          {
            name: "退货单",
            code: "2"
          },
        ],
      },
    ];
  }
  getSelection(name) {
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
              }
            });

          });
        break;
      case 'channel_keyword':
        this.http.enterpriseGetchannels.request({ 'ebls_split': true })
          .subscribe((data) => {
            this.queryList.forEach((item) => {
              if (item.name === name) {
                item.list = JSON.parse(JSON.stringify(data['rows'])).map((item1, index) => {
                  let obj = {
                    code: item1.channel_keyword,
                    name: item1.name
                  };
                  return obj;
                });
              }
            });

          });
        break;
    }

  }
  // 获取所有查询条件
  search($event) {
    this.params.search = $event;
    this.getmoneyDistributionReport();
  }

  // 接收翻页操作传过来的值，然后请求服务得到新数据
  childparams($event) {
    const childoption = $event;
    this.params.page_no = childoption.page_no;
    this.getmoneyDistributionReport();
  }

  getmoneyDistributionReport() {
    this.http.moneyDistributionReport.request(this.params)
      .subscribe((data) => {
        if (data['code'] == 0) {
          this.promotionslists = data['data']['rows'];
          this.pageSize.count = data['data']['count'];
          this.res = data['data'];
        }

      });
  }

  addexport() {
    console.log(this.params.search.startdate);
    console.log(this.params.search.enddate);
    let { startdate, enddate } = this.params.search;
    console.log(startdate);
    console.log((new Date(enddate)).getTime());
    let days = ((new Date(enddate)).getTime() - (new Date(startdate)).getTime()) / 1000 / 60 / 60 / 24;
    console.log(days);

    if (days > 30) {
      this.notification.create('error', '温馨提示', '日期范围应在30天之内');
      return false;
    } else {
      let exportname: any;
      let strdate = String(startdate).substr(0, 10);
      let endstr = String(enddate).substr(0, 10);
      exportname = strdate + "-" + endstr;
      let parame = {
        'path': '/test-export-bsp/order/moneyDistributionReport',
        'search': {},
        'desc': exportname + '促销活动分摊报表',
        'sort': 'total',
        'sortDirKey': 'DESC',
        'export_columns': [
          { 'name': '活动名称', 'key': 'activity_id' },
          { 'name': '活动渠道', 'key': 'channel_keyword' },
          { 'name': '门店名称', 'key': 'region_name' },
          { 'name': '商品名称', 'key': 'item_name' },
          { 'name': '商品编码', 'key': 'item_code' },
          { 'name': '商品条码', 'key': 'barcode' },
          { 'name': '数量', 'key': 'sale_qty' },
          { 'name': '商品原价（元）', 'key': 'original_price' },
          { 'name': '商品金额（元）', 'key': 'sale_value' },
          { 'name': '总折扣（元）', 'key': 'disc_bt_total' },
          { 'name': '渠道承担金额（元）', 'key': 'disc_bt' },
          { 'name': '商家承担金额（元）', 'key': 'disc_bt_sj' }
        ]

      };
      parame.search = this.params.search;
      this.http.addexport.request(parame)
        .subscribe(data => {
          if (data) {
            this.notification.create('success', '温馨提示', data['msg']);
          } else {
            this.notification.create('error', '温馨提示', '添加失败,请重试！');
          }
        });
    }

  }

}
