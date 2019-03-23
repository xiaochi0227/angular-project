import { Component, OnInit, ViewChild, ElementRef, QueryList, ContentChild } from '@angular/core';

import { HttpService } from 'src/app/http/http.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { SearchBarComponent } from 'src/app/sharecomponets/search-bar/search-bar.component';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'app-statement',
  templateUrl: './statement.component.html',
  styleUrls: ['./statement.component.less']
})
export class StatementComponent implements OnInit {
  public pageIndex = 1;
  public queryList = new Array();
  public storelist: any; // 门店列表
  public initStorelist: any;
  public channels: any; // 渠道列表
  public initchannels: any;
  public searchStart = false;
  public exclude_pos_money_desc: any; // tip 描述
  public statements: any; // 页面列表数据
  public hzobj: any; // 商品信息
  public types = 0;
  public params: any = {
    search: {},
    page_size: 20,
    page_no: 1,
  };
  memberList: any;
  public pageSize: any =
    {
      totalPage: 0,
      count: 0
    };

  @ViewChild('searchbar') searchbar: SearchBarComponent;
  constructor(private http: HttpService, private router: Router, private notification: NzNotificationService) {
    this.notification.config({
      nzPlacement: 'topRight'
    });
  }

  ngOnInit() {
    this.queryList = [
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
        type: "select",
        label: "渠道",
        name: "channel",
        code: "",
        list: this.getSelection('channel')
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
            this.initStorelist = data;
            this.storelist = JSON.parse(JSON.stringify(data));
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
            this.channels = data['rows'];
            this.initchannels = JSON.parse(JSON.stringify(data['rows']));

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
    this.getbillorderconfig();

  }



  // 获取所有查询条件
  search($event) {
    if (this.searchStart) {
      console.log(this.queryList);
      for (let key in $event) {
        console.log(key);
        this.params.search[key] = $event[key];
      };
      console.log(this.params);
      this.getSotresreport();
    }

  }


  // 接收翻页操作传过来的值，然后请求服务得到新数据
  childparams($event) {
    const childoption = $event;
    this.params.page_no = childoption.page_no;
    this.getSotresreport();

  }

  // 获取订单配置信息
  getbillorderconfig() {
    this.http.getBillOrderConfig.request()
      .subscribe(res => {
        this.exclude_pos_money_desc = res['exclude_pos_money_desc'];
        this.params.search.exclude_pos_money = res['exclude_pos_money'];
        this.params.search.ent_id = "",
          this.searchStart = true;
      });
  }

  // 获取订单列表
  getSotresreport() {
    this.http.getsotresreport.request(this.params)
      .subscribe(data => {
        this.hzobj = data;
        this.statements = data['rows'];
        this.pageSize.count = data['count'];
        console.log(this.hzobj);
      });
  }

  // 导出
  addexport() {
    let exportname: any, start_time: any, end_time: any, channel_keyword: any, region_code: any;
    if (this.params.search.start_time) {
      let strdate = String(this.params.search.start_time).substr(0, 10);
      start_time = strdate + '―';
    } else { start_time = ''; }
    if (this.params.search.end_time) {
      let endstr = String(this.params.search.end_time).substr(0, 10);
      end_time = endstr + '-';
    } else { end_time = ''; }
    if (this.params.search.region_code) { region_code = this.params.search.region_code + '-'; } else { region_code = '' }
    if (this.params.search.channel) { channel_keyword = this.params.search.channel + '-'; } else { channel_keyword = '' }
    exportname = region_code + start_time + end_time + channel_keyword;
    const parame = {
      'path': '/test-export-bsp/saleranking/getsotresreport',
      'search': {
        ent_id: '',
        channel: '',
        region_code: '',
        start_time: '',
        end_time: '',
        exclude_pos_money: ''
      },
      'desc': exportname + '对账单',
      'export_columns': [
        { 'name': '账单日期', 'key': 'time' },
        { 'name': '门店ID', 'key': 'region_code' },
        { 'name': '门店名称', 'key': 'region_name' },
        { 'name': '渠道', 'key': 'channel_name' },
        { 'name': '结算金额(线上)', 'key': 'money' },
        // { 'name': '价签金额', 'key': 'marked_value' },
        { 'name': '核销金额(线下)', 'key': 'posMoney' },
        { 'name': '不参与核销金额', 'key': 'nmoney' },
        { 'name': '未核销金额', 'key': 'noposMoney' },
        { 'name': '差额', 'key': 'cMoney' }
      ]

    };
    if (this.params.search.start_time !== '' && this.params.search.end_time !== '') {
      const datePipe = new DatePipe('en-US');
      const stime = new Date(datePipe.transform(this.params.search.start_time, 'yyyy-MM-dd'));
      const ntime = new Date(datePipe.transform(this.params.search.end_time, 'yyyy-MM-dd'));
      const days = (Date.parse(ntime.toDateString()) - Date.parse(stime.toDateString())) / 1000 / 60 / 60 / 24;
      if (days > 30) {
        this.notification.create('warning', '温馨提示', '请导出一个月之内的数据!');
        return false;
      } else {
        this.http.addexport.request(parame)
          .subscribe(data => {
            if (data) {
              this.notification.create('success', '温馨提示', data['msg']);
            } else {
              this.notification.create('error', '温馨提示', '添加失败,请重试！');
            }
          })
      }

    } else {
      this.notification.create('error', '温馨提示', ' 导出需要选择日期! ');
    }

  }


  getdate(i) {
    this.types = i;
    this.params.page_no = 1;
    const datePipe = new DatePipe('en-US');
    const newDate = new Date;
    let preDate, preDate1;
    if (i === 1) {
      preDate = newDate.setDate(newDate.getDate());
      preDate1 = newDate.setDate(newDate.getDate() - 6);
    }
    if (i === 2) {
      preDate = newDate.setMonth(newDate.getMonth());
      preDate1 = newDate.setMonth(newDate.getMonth() - 1);
    }
    if (i === 3) {
      preDate = newDate.setMonth(newDate.getMonth());
      preDate1 = newDate.setMonth(newDate.getMonth() - 3);
    }
    this.queryList.forEach((item) => {
      if (item.name1 === 'start_time') {
        item.value = [new Date(preDate1), new Date(preDate)];
      }
    });
    console.log(this.searchbar.search());
    // this.searchbar.search();

  }

  gotodetail(opt) {
    const search: any = {
      ent_id: this.params.search.ent_id,
      region_code: '',
      channel_keyword: '',
      date: '',
      region_name: ''
    };
    if (opt.time) {
      search.date = opt.time;
    }
    if (opt.channel_keyword) {
      search.channel_keyword = opt.channel_keyword;
    }
    if (opt.region_code) {
      search.region_code = opt.region_code;
    }
    if (opt.region_name) {
      search.region_name = opt.region_name;
    }
    console.log(search);
    this.router.navigate(['/pages/finance/billingdetails', { parme: JSON.stringify(search) }]);

  }

}
