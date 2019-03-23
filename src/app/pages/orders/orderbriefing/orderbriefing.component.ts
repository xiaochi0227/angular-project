import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Authbts, Whetherdisplay, GMTToStr } from 'src/app/validates/validates';
import { HttpService } from 'src/app/http/http.service';
import { DatePipe } from '@angular/common';
import { NzNotificationService } from 'ng-zorro-antd';
@Component({
  templateUrl: './orderbriefing.html',
  styleUrls: ['./orderbriefing.less']
})
export class OrderBriefingComponent implements OnInit {
  myDate: string;
  showdate: string;
  typeDateObj: any = {
    type: 1,
    date: ''
  };
  params: any = {
    search: {
      channel: '',
      startDate: '',
      endDate: '',
      type: '4'
    }
  };
  channels: any[];
  orderbriefings: any;
  btns: any;
  dcdcsvwj = true;
  _startDate = null;
  _endDate = null;
  queryList: any = [];
  public searchStart = false; // 进行是否查询判断
  public storelist: any; // 门店列表
  public initStorelist: any;
  public initchannels: any;
  constructor(private route: ActivatedRoute, private http: HttpService, private notification: NzNotificationService) {
    this.notification.config({
      nzPlacement: 'topRight'
    });
  }

  ngOnInit() {
    this.btns = Authbts('订单管理', '订单简报');
    this.dcdcsvwj = Whetherdisplay(this.btns, '导出到CSV文件');
    this.searchStart = true;
    this.queryList = [
      {
        show: true,
        type: "input",
        label: "渠道",
        name: "channel",
        value: '',
        search: true,
        list: this.getSelection('channel_keyword')
      },
      {
        show: true,
        type: "date-picker",
        label: "选择时间",
        name1: "startDate",
        name2: "endDate",
        value: [new Date(Date.now() - 3600 * 24 * 1000), new Date(Date.now() - 3600 * 24 * 1000)],
        value1: '',
        value2: ''
      }
    ];
  }
  getSelection(name, parentCode = null) {
    // 避免经营渠道,已上线渠道，活动渠道多次请求
    switch (name) {
      case 'channel_keyword':
        this.http.getChannels.request({})
          .subscribe((data) => {
            if (data['code'] === '0' && data['data']) {
              this.channels = data['data']['rows'];
              this.queryList.forEach((item) => {
                if (item.name1 === 'channel_keyword') {
                  item.list1 = data['data']['rows'].map((item1) => {

                    let obj = {
                      code1: item1.channel_keyword,
                      name: item1.name
                    };
                    return obj;
                  });
                }
              });
            }
          });
        break;

    }

  }

  // 获取所有查询条件
  search($event) {
    if (this.searchStart) {
      this.params.search = $event;
      this.params.search.type = '4';
      this.getOrderBriefing(this.params.search);
    }
  }
  // 获取渠道
  getchannels(): void {
    this.http.getChannels.request({ 'ebls_split': true })
      .subscribe(res => {
        if (res['code'] === '0' && res['data']) {
          this.channels = res['data']['rows'];
        }

      });
  }
  getOrderBriefing(date: any) {
    this.http.getorderstatusstore.request(date)
      .subscribe(orderbriefings => {
        if (orderbriefings['code'] === '0') {
          this.orderbriefings = orderbriefings['data'];
        }

      });
  }

  // getBriefings() {
  //   if (this.params.search.startDate !== '' && this.params.search.endDate !== '') {
  //     this.getOrderBriefing(this.params.search);
  //   } else {
  //     alert(' 请输入完整的查询条件! ');
  //   }
  // }
  Reset() {
    this.params.search.channel = '';
    this.params.search.startDate = '';
    this._endDate = null;
    this._startDate = null;
    this.params.search.endDate = '';
  }

  addexport() {
    const datePipe = new DatePipe('en-US');
    const stime = new Date(datePipe.transform(this.params.search.startDate, 'yyyy-MM-dd'));
    const ntime = new Date(datePipe.transform(this.params.search.endDate, 'yyyy-MM-dd'));
    const days = (Date.parse(ntime.toDateString()) - Date.parse(stime.toDateString())) / 1000 / 60 / 60 / 24;
    if (days > 30) {
      this.notification.create('error', '温馨提示', '日期范围应在一个月之内');
      return false;
    } else {
      let exportname: any, startdate: any, enddate: any;
      if (this.params.search.startDate) {
        const strdate = String(this.params.search.startDate).substr(0, 10);
        startdate = strdate + '―';
      } else { startdate = ''; }
      if (this.params.search.endDate) {
        const endstr = String(this.params.search.endDate).substr(0, 10);
        enddate = endstr + '-';
      } else { enddate = ''; }
      exportname = startdate + enddate;
      const parame = {
        'path': '/bsp/bspreport/reportexport/exportorderstatusstore',
        'search': {
          startDate: '',
          endDate: '',
          channel: ''
        },
        'desc': exportname + '订单简报',
        'sort': '',
        'sortDirKey': '',
        'export_columns': [
          { 'name': '门店名称', 'key': 'name' },
          { 'name': '已释放订单数量', 'key': 'statuses.4.total' },
          { 'name': '已释放销售金额', 'key': 'statuses.4.money' },
          { 'name': '已备货订单数量', 'key': 'statuses.6.total' },
          { 'name': '已备货销售金额', 'key': 'statuses.6.money' },
          { 'name': '已签收订单数量', 'key': 'statuses.11.total' },
          { 'name': '已签收销售金额', 'key': 'statuses.11.money' },
          { 'name': '已签收客单价', 'key': 'statuses.11.kdj' },
          { 'name': '已取消订单数量', 'key': 'statuses.15.total' },
          { 'name': '已取消销售金额', 'key': 'statuses.15.money' },
          { 'name': '订单数', 'key': 'total' },
          { 'name': '总金额', 'key': 'money' }
        ]

      };

      if (this.params.search.startDate !== '' && this.params.search.endDate !== '') {
        const datePipe = new DatePipe('en-US');
        parame.search.startDate =
          datePipe.transform(this.params.search.startDate, 'yyyy-MM-dd 00:00:00');
        parame.search.endDate =
          datePipe.transform(this.params.search.endDate, 'yyyy-MM-dd 23:59:59');
        parame.search.channel = this.params.search.channel;
        this.http.addexport.request(parame)
          .subscribe(row => {
            if (row) {
              this.notification.create('success', '温馨提示', row['msg']);
            } else {
              this.notification.create('error', '温馨提示', '添加失败,请重试！');
            }

          });
      } else {
        this.notification.create('error', '温馨提示', ' 导出需要选择时间范围! ');
      }

    }

  }


}
