import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/http/http.service';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'app-storeonoffrate',
  templateUrl: './storeonoffrate.component.html',
  styleUrls: ['./storeonoffrate.component.less']
})
export class StoreonoffrateComponent implements OnInit {
  public params = {
    page_size: 50,
    page_no: 1,
    sort: "business_date",
    sortDirKey: 'ASC'
  };
  public queryList = new Array();
  public pageSize =
    {
      totalPage: 0,
      count: 0
    };
  public storeonofflist: any;
  constructor(private http: HttpService, private notification: NzNotificationService) {
    this.notification.config({
      nzPlacement: 'topRight'
    });
  }

  ngOnInit() {
    this.queryList = [
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
        type: "input",
        label: "未营业时长",
        name: "no_business_duration",
        value: '',
      },
      {
        show: true,
        type: "input",
        label: "关店次数",
        name: "close_shop_count",
        value: '0'
      }

    ];
  }
  // 获取所有查询条件
  search($event) {
    console.log($event);
    // this.params.search = $event;
    for (let key in $event) {
      console.log(key);
      this.params[key] = $event[key];
    }
    console.log(this.params);
    this.getshopswitchrecord();
  }
  // 接收翻页操作传过来的值，然后请求服务得到新数据
  childparams($event) {
    const childoption = $event;
    this.params.page_no = childoption.page_no;
    this.getshopswitchrecord();
  }
  getshopswitchrecord() {
    this.http.getshopswitchrecords.request(this.params)
      .subscribe(row => {
        this.storeonofflist = row['rows'];
        this.pageSize.count = row['count'];
      });
  }

  addexport() {
    let parame = {
      'path': '/bsp/bspshop/shop/getshopswitchrecords',
      'search': {},
      'desc': '门店营业详情',
      'sort': 'business_dates',
      'sortDirKey': 'DESC',
      'export_columns': [
        { 'name': '日期', 'key': 'business_dates' },
        { 'name': '门店名称', 'key': 'region_name' },
        { 'name': '门店编码', 'key': 'region_code' },
        { 'name': '营业时间段', 'key': 'business_time_duan' },
        { 'name': '计划营业时长', 'key': 'jh_business_duration' },
        { 'name': '实际营业时长', 'key': 'sj_business_duration' },
        { 'name': '关店次数', 'key': 'close_shop_count' },
        { 'name': '未营业时长(小时)', 'key': 'no_business_duration' },
        { 'name': '第一次开关店时间', 'key': 'one_start_end' },
        { 'name': '第二次开关店时间', 'key': 'tow_start_end' },
        { 'name': '第三次开关店时间', 'key': 'three_start_end' },
        { 'name': '渠道', 'key': 'channel' }
      ]

    }
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
