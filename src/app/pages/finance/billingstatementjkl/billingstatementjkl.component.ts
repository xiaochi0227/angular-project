import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpService } from 'src/app/http/http.service';
import { GMTToStr, Authbts, Whetherdisplay } from 'src/app/validates/validates';
import { forkJoin } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'app-billingstatementjkl',
  templateUrl: './billingstatementjkl.component.html',
  styleUrls: ['./billingstatementjkl.component.less']
})
export class BillingstatementjklComponent implements OnInit {

  datePipe: DatePipe;
  // 搜索条件模型
  searchModel: any = {
    dateRange: '',
    region_code: '',
    payMethod: null
  };
  payMethodList = [
    {
      name: '支付宝',
      value: '1118'
    },
    {
      name: '微信',
      value: '8'
    },
    {
      name: '礼金卡',
      value: '1001'
    }
  ];
  // 是否显示导出CSV按钮
  exportBtn = false;
  // 设置费率按钮
  setPayBtn = false;
  cow: Number = 0; // 序号
  // 封装后的数组用户展示表格
  list: any[] = [];
  loading: boolean = false;
  stores: any[] = [];

  pageIndex = 1;
  params: any = {
    search: {},
    page_size: 20,
    page_no: 1,
  };
  pageSize: any =
    {
      totalPage: 0,
      count: 0
    };

  visible: boolean;
  rateopt = {
    rate: {
      alipay: '',
      wechat: '',
      ljk: ''
    }
  };

  constructor(private http: HttpService, private notification: NzNotificationService) {
    this.datePipe = new DatePipe('en-US');
    this.notification.config({
      nzPlacement: 'topRight'
    });
  }

  formatterPercent = value => `${value}%`;
  parserPercent = value => value.replace('%', '');

  // 获取费率
  getrate() {
    this.http.getRate.request({}).subscribe((res: any) => {
      if (res.code === '0' && res.data) {
        this.rateopt = res.data;
      }
    });
  }
  // 保存费率
  save(rateopt) {
    console.log(rateopt);
    this.http.saveRate.request(rateopt).subscribe((res: any) => {
      if (res.code === '0') {
        this.visible = false;
        this.search();
      }
    });
  }

  // 重置
  reset() {
    if (this.loading) {
      return;
    }
    this.params.search.region_code = '';
    this.params.search.payMethod = null;
    this.initSearchModel();
    this.search();
  }

  // 接收翻页操作传过来的值，然后请求服务得到新数据
  childparams($event) {
    const childoption = $event;
    this.params.page_no = childoption.page_no;
    this.search();
  }

  // 查询
  search() {
    if (this.loading) {
      return;
    }
    this.getData();
  }

  // 封装查询参数
  fetchSearchParams() {
    const dateRange = this.searchModel.dateRange;
    const month = this.searchModel.month;
    const startDateStr = this.datePipe.transform(dateRange[0], 'yyyy-MM-dd 00:00:00');
    const endDeteStr = this.datePipe.transform(dateRange[1], 'yyyy-MM-dd 23:59:59');
    const params = {
      startDate: startDateStr,
      endDate: endDeteStr,
      region_code: this.searchModel.region_code,
      payMethod: this.searchModel.payMethod,
      point: '0.0'
    };
    this.params.search = params;
    this.cow = (this.params.page_no - 1) * this.params.page_size;
  }
  // 加载数据
  getData() {
    this.loading = true;
    this.fetchSearchParams();
    this.http.getStoresReport.request(this.params).subscribe((result: any) => {
      if (result['code'] === '0') {
        this.list = result.data.row || [];
        this.pageSize.count = result.data.count || 0;
        this.loading = false;
      } else {
        this.notification.create('error', '温馨提示', '数据未返回，请重试!');
        this.loading = false;
      }
    });
  }

  // 获取门店列表用于查询
  getStoreList() {
    this.http.getEntStorelist.request({}).subscribe((result: any) => {
      this.stores = [{ code: '', codename: '全部门店' }].concat(result);
    });
  }

  // 初始化searchModel
  initSearchModel() {
    this.searchModel.dateRange = [new Date(Date.now() - 3600 * 24 * 1000), new Date(Date.now() - 3600 * 24 * 1000)];
  }

  ngOnInit() {
    const btns = Authbts('财务对账', '商城记账单');
    console.log('btns', btns);
    this.exportBtn = Whetherdisplay(btns, '导出到CSV文件');
    this.setPayBtn = Whetherdisplay(btns, '设置费率');
    this.getStoreList();
    this.initSearchModel();
    this.getData();
  }

  // 导出
  addexport() {
    let exportname: any, startDate: any, endDate: any, region_code: any;
    if (this.params.search.startDate) {
      const strdate = String(this.params.search.startDate).substr(0, 10);
      startDate = strdate + '―';
    } else { startDate = ''; }
    if (this.params.search.endDate) {
      const endstr = String(this.params.search.endDate).substr(0, 10);
      endDate = endstr + '-';
    } else { endDate = ''; }
    if (this.params.search.region_code) {
      region_code = this.params.search.region_code + '-';
    } else {
      region_code = '';
    }
    exportname = region_code + startDate + endDate;
    let parame = {
      'path': '/bsp/jkl/report',
      'search': {
        ent_id: '',
        channel: '',
        region_code: '',
        startDate: '',
        endDate: '',
        exclude_pos_money: ''
      },
      'desc': exportname + '商城记账单',
      'export_columns': [
        { 'name': '支付方式', 'key': 'payName' },
        { 'name': '交易日期', 'key': 'date' },
        { 'name': '店号', 'key': 'regionCode' },
        { 'name': '店名(线上)', 'key': 'regionName' },
        { 'name': '账套', 'key': 'zt' },
        { 'name': '账套编号', 'key': 'ztbh' },
        { 'name': '商品金额', 'key': 'totalItemValue' },
        { 'name': '购卡金额', 'key': 'cardValue' },
        { 'name': '运费', 'key': 'logisticsValue' },
        { 'name': '商品优惠', 'key': 'totalSjDisc' },
        { 'name': '积分优惠', 'key': 'pointDisc' },
        { 'name': '优惠券', 'key': 'disc' },
        { 'name': '购卡优惠', 'key': 'cardDisc' },
        { 'name': '实际支付', 'key': 'payableValue' },
        { 'name': '手续费', 'key': 'serviceCharge' },
        { 'name': '净值', 'key': 'netWorth' },
        { 'name': '差额', 'key': 'difference' }
      ]
    };
    if (this.params.search.startDate !== '' && this.params.search.endDate !== '') {
      const datePipe = new DatePipe('en-US');
      const stime = new Date(datePipe.transform(this.params.search.startDate, 'yyyy-MM-dd'));
      const ntime = new Date(datePipe.transform(this.params.search.endDate, 'yyyy-MM-dd'));
      const days = (Date.parse(ntime.toDateString()) - Date.parse(stime.toDateString())) / 1000 / 60 / 60 / 24;
      if (days > 30) {
        this.notification.create('warning', '温馨提示', '请导出一个月之内的数据!');
        return false;
      } else {
        parame.search = this.params.search;
        this.http.addexport.request(parame)
          .subscribe(data => {
            console.log(data);
            this.notification.create('success', '温馨提示', data['msg']);
          });
       }
    } else {
      this.notification.create('error', '温馨提示', ' 导出需要选择时间范围! ');
    }

  }

}
