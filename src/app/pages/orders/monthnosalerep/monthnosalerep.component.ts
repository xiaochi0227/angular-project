import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseParams } from 'src/app/models';
import { HttpService } from 'src/app/http/http.service';
import { GMTToStr, Authbts, Whetherdisplay } from 'src/app/validates/validates';
import { DatePipe } from '@angular/common';
import { NzNotificationService } from 'ng-zorro-antd';
@Component({
  templateUrl: './monthnosalerep.html',
  styleUrls: ['./monthnosalerep.less']
})
export class MonthnoSalerepComponent {
  channels: any[];
  params: any = {
    search: {
      region_code: '',
      month: null
    },
    page_size: 50,
    page_no: 1,
  };
  nosales: any;
  btns: any;
  dcdcsvwj: boolean = true;
  pageSize =
    {
      totalPage: 0,
      count: 0
    };
  region_name: any;
  constructor(private http: HttpService, private notification: NzNotificationService) {
    const newDate = new Date;
    if (newDate.getMonth() === 0) {
      const datevalue = (newDate.getFullYear() - 1) + '-12';
      this.params.search.month = datevalue;
    } else {
      this.params.search.month = newDate.getFullYear() + '-' + this.formatmonth(newDate.getMonth());
    }
    // this.params.search.date = datePipe.transform(preDate, 'yyyy-MM-dd');

    this.notification.config({
      nzPlacement: 'topRight'
    });
  }

  _disabledMonth(current: Date) {
    // return current && moment(current).day(0).valueOf() > moment().valueOf();
  }
  formatmonth(datemonth) {
    let month: string;
    if (datemonth < 10) {
      month = '0' + datemonth;
    } else {
      month = datemonth;
    }
    return month;
  }
  ngOnInit() {
    this.btns = Authbts('运营统计', '月无销量报表');
    console.log(this.btns);
    this.dcdcsvwj = Whetherdisplay(this.btns, '导出到CSV文件');
    this.http.getstorealist.request({})
      .subscribe(stores => {
        this.stores = stores;
        const tmp = [{ code: '', codename: '全部门店' }].concat(this.stores);
        this.stores = tmp;
        if (this.stores[0]) {
          this.params.search.region_code = this.stores[0].code;
          this.region_name = this.stores[0].codename;
        }
        this.getMonthnoSaleres(this.params);
      });
  }
  stores: any;
  changecount: any = 0;
  cow: number = 0; // 序号
  // 获取门店列表
  getStorelist() {
    this.http.getstorealist.request({})
      .subscribe(stores => {
        this.stores = stores;
      });
  }

  search(param) {
    param.page_no = 1;
    if (typeof param.search.month !== 'string') {
      const gety = param.search.month.getFullYear();
      param.search.month = gety + '-' + this.formatmonth(param.search.month.getMonth() + 1);
    }
    this.getMonthnoSaleres(param);
  }
  getMonthnoSaleres(param: any) {
    this.cow = (param.page_no - 1) * param.page_size;
    this.http.getmonthunsaleitem.request(param)
      .subscribe(res => {
        this.nosales = res['data']['rows'];
        this.pageSize.count = res['data']['count'];
        this.changecount = res['data']['count'];
      });
  }
  // 接收翻页操作传过来的值，然后请求服务得到新数据
  childparams($event) {
    let childoption = $event;
    this.params.page_no = childoption.page_no;
    this.cow = (childoption.page_no - 1) * childoption.page_size;
    this.getMonthnoSaleres(childoption);
  }

  searchcode($event) {
    this.params.search.region_code = $event;
  }
  // 门店列表选择显示编码加名称
  searchname($event) {
    this.region_name = $event;
  }
  Reset() {
    const newDate = new Date;
    this.params.search.month = newDate.getFullYear() + '-' + this.formatmonth(newDate.getMonth());
    this.params.search.region_code = this.stores[0].code;
  }

  // 月无销量报表导出`
  addexport() {

    const parame = {
      'path': '/test-report-bsp/salesdetail//bspreport/getmonthunsaleitem',
      'search': {
        region_code: this.params.search.region_code,
        month: this.params.search.month
      },
      'desc': this.params.search.month + '月无销量报表',
      'export_columns': [
        { 'name': '日期', 'key': 'month' },
        { 'name': '门店', 'key': 'region_name' },
        { 'name': '商品编码', 'key': 'item_code' },
        { 'name': '商品条码', 'key': 'barcode' },
        { 'name': '商品名称', 'key': 'item_name' },
        { 'name': '一级分类', 'key': 'online_sup_name' },
        { 'name': '二级分类', 'key': 'online_cat_name' }
      ]

    };


    if (this.params.search.month !== '') {
      this.http.addexport.request(parame)
        .subscribe(row => {

          if (row) {
            this.notification.create('success', '温馨提示', row['msg']);
          } else {
            this.notification.create('error', '温馨提示', '添加失败,请重试！');
          }

        });
    } else {
      this.notification.create('error', '温馨提示', ' 导出需要选择日期! ');
    }

  }

}
