import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/http/http.service';
import { BaseParams } from 'src/app/utils/base.list.params';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'app-storeonoffrates',
  templateUrl: './storeonoffrates.component.html',
  styleUrls: ['./storeonoffrates.component.less']
})
export class StoreonoffratesComponent implements OnInit {
  params: BaseParams = {
    search: {
    },
    page_no: 1,
    page_size: 50,
    sort: 'business_date',
    sortDirKey: 'ASC'
  };
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
    this.getshopswitchrecord();
  }
  getshopswitchrecord() {
    this.http.getshopswitchrecord.request(this.params)
      .subscribe(row => {
        this.storeonofflist = row['rows'];
        this.pageSize.count = row['count'];
      });
  }
  // 接收翻页操作传过来的值，然后请求服务得到新数据
  childparams($event) {
    const childoption = $event;
    this.params.page_no = childoption.page_no;
    this.getshopswitchrecord();
  }

  addexport() {
    let parame = {
      'path': '/bsp/bspshop/shop/getshopswitchrecord',
      'search': {},
      'desc': '门店营业详情',
      'sort': 'business_date',
      'sortDirKey': 'DESC',
      'export_columns': [
        { 'name': '日期', 'key': 'business_date' },
        { 'name': '门店名称', 'key': 'region_name' },
        { 'name': '门店编码', 'key': 'region_code' },
        { 'name': '当前门店状态', 'key': 'status' },
        { 'name': '状态更新时间', 'key': 'timestamp' },
        { 'name': '渠道', 'key': 'channel' }
      ]

    };
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
