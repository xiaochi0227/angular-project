import { Component, OnInit } from '@angular/core';
import { Authbts, Whetherdisplay, GMTToStr } from 'src/app/validates/validates';
import { HttpService } from 'src/app/http/http.service';
import { BaseParams } from 'src/app/utils/base.list.params';
import { DatePipe } from '@angular/common';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  templateUrl: './weeksalesrankings.html',
  styleUrls: ['./weeksalesrankings.less']
})
export class WeekSalesRankingsComponent implements OnInit {
  myDate: any;
  myDate1: any;
  // 请求参数
  params: BaseParams = {
    search: {
      startDate: '',
      endDate: '',
      region_code: '',
      online_sup_code: '',
      online_cat_code: '',
      catCode: '',
      channel: ''
    },
    page_size: 50,
    page_no: 1,
  }
  pageSize =
    {
      totalPage: 0,
      count: 0
    };
  cow: number;
  rankings: any;
  stores: any;
  firstCategories: any;
  btns: any;
  dcdcsvwj = true;

  _startDate = null;
  _endDate = null;
  subCategories: any;
  changecount: any;
  queryList: any = [];
  public searchStart = false; // 进行是否查询判断
  public storelist: any; // 门店列表
  public initStorelist: any;
  public channels: any;
  public initchannels: any;
  constructor(private http: HttpService, private notification: NzNotificationService) {
    this.notification.config({
      nzPlacement: 'topRight'
    });
  }
  ngOnInit(): void {
    this._startDate = new Date(Date.now() - 3600 * 24 * 6 * 1000);
    this._endDate = new Date(Date.now());
    this.params.search.startDate = GMTToStr(this._startDate);
    this.params.search.endDate = GMTToStr(this._endDate);
    this.btns = Authbts('运营统计', '商品销售排行');
    // console.log(this.btns);
    // 传给查询组件的参数配置
    /**
     * @parem show：是否为第一行显示
     * @parem type：启用的查询类型 可选项：input,select,double-select,double-input,select-check
     * @parem label: 占位提醒栏
     * @parem name：传给后台的key
     * @parem value：传给后台的value
     * @parem search：是否开启搜索功能
     *
    */
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
        type: "select",
        label: "门店",
        name: "region_code",
        value: '',
        search: true,
        list: this.getSelection('region_code')
      },
      {
        show: true,
        type: "double-select",
        label: "线上品类",
        value: '',
        name1: "online_sup_code",
        name2: "online_cat_code",
        list1: this.getSelection('online_sup_code'),
        list2: []
      },
      {
        show: true,
        type: "date-picker",
        label: "选择时间",
        name1: "startDate",
        name2: "endDate",
        value: '',
        value1: "",
        value2: ""
      }
    ];



    // this.getchannels();
    // this.getweekrankings(this.params);
    // 获取门店列表
    // this.http.getStorelist.request({})
    //   .subscribe(stores => {
    //     if (stores['code'] === '0' && stores['data']) {
    //       this.stores = stores['data'];
    //     }

    //   });
    // this.http.getFirstOnlineCategories.request({ parent: 0 })
    //   .subscribe(categories => {
    //     if (categories['code'] === '010001000' && categories['data']) {
    //       this.firstCategories = categories['data'];
    //     } else {
    //       alert(categories['msg']);
    //     }

    //   });
  }
  // 获取下拉列表
  getSelection(name, parentCode = null) {
    // 避免经营渠道,已上线渠道，活动渠道多次请求
    switch (name) {
      case 'region_code':
        // 获取门店信息
        this.http.getStorelist.request({})
          .subscribe((data) => {
            if (data['code'] === '0' && data['data']) {
              this.initStorelist = data['data'];
              this.storelist = JSON.parse(JSON.stringify(data['data']));
              this.queryList.forEach((item) => {
                if (item.name === name) {
                  item.list = JSON.parse(JSON.stringify(data['data'])).map((item1, index) => {
                    let obj = {
                      code: item1.code,
                      name: item1.codename
                    };
                    return obj;
                  });
                  item.list.unshift({
                    code: "",
                    name: "全部门店"
                  });
                }
              });
              this.searchStart = true;
            }


          });
        break;
      case 'online_sup_code':
        this.http.getFirstOnlineCategories.request({ "parent": 0 })
          .subscribe((data) => {
            console.log(data);
            if (data['code'] === '010001000' && data['data']) {
              this.queryList.forEach((item) => {
                if (item.name1 === name) {
                  // item.list = data;
                  item.list1 = JSON.parse(JSON.stringify(data['data'])).map((item1) => {
                    let obj = {
                      code: item1.code,
                      name: item1.name
                    };
                    return obj;
                  });
                }
              });
            }

          });
        break;
      case 'online_cat_code':
        this.http.getFirstOnlineCategories.request({ "parent": parentCode })
          .subscribe((data) => {
            console.log(data);
            if (data['code'] === '010001000' && data['data']) {
              this.queryList.forEach((item) => {
                if (item.name2 === name) {
                  // item.list = data;
                  item.list2 = JSON.parse(JSON.stringify(data['data'])).map((item1) => {
                    let obj = {
                      code: item1.code,
                      name: item1.name
                    };
                    return obj;
                  });
                }

              });
            }
          });
        break;
      case 'channel_keyword':
        this.http.getChannels.request({})
          .subscribe((data) => {
            if (data['code'] === '0' && data['data']) {
              this.channels = data['data']['rows'];
              this.initchannels = JSON.parse(JSON.stringify(data['data']['rows']));

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
    console.log($event);
    if (this.searchStart) {
      this.params.search = $event;
      this.params.search.catCode = '';
      this.getweekrankings(this.params);
    }
  }

  getweekrankings(params) {
    this.cow = (params.page_no - 1) * params.page_size;
    this.http.getweekrankings.request(params)
      .subscribe(rankings => {
        if (rankings['code'] === '0') {
          this.rankings = rankings['data']['rows'];
          this.pageSize.count = rankings['data']['count'];
          this.changecount = rankings['data']['count'];
        }

      });
  }

  // search(searchobj) {


  //   if (searchobj.search.online_cat_code !== '') {
  //     searchobj.search.catCode = searchobj.search.online_cat_code;
  //   } else if (searchobj.search.online_cat_code === '' && searchobj.search.online_sup_code === '') {
  //     searchobj.search.catCode = '';
  //   } else if (searchobj.search.online_cat_code === '' && searchobj.search.online_sup_code !== '') {
  //     searchobj.search.catCode = searchobj.search.online_sup_code;
  //   }
  //   searchobj.search.startDate = String(searchobj.search.startDate);
  //   searchobj.search.endDate = String(searchobj.search.endDate);

  //   this.getweekrankings(searchobj);
  // }
  // 接收翻页操作传过来的值，然后请求服务得到新数据
  childparams($event) {
    const childoption = $event;
    this.params.page_no = childoption.page_no;
    this.cow = (childoption.page_no - 1) * childoption.page_size;
    this.getweekrankings(childoption);

  }

  rest() {
    this.params.search.channel = '';
    this.params.search.online_sup_code = '';
    this.params.search.online_cat_code = '';
    this.params.search.catCode = '';
    this.params.search.region_code = '';
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
      let exportname: any, startdate: any, enddate: any, channel: any;
      if (this.params.search.startDate) {
        const strdate = String(this.params.search.startDate).substr(0, 10);
        startdate = strdate + '―';
      } else { startdate = ''; }
      if (this.params.search.endDate) {
        const endstr = String(this.params.search.endDate).substr(0, 10);
        enddate = endstr + '-';
      } else { enddate = ''; }
      if (this.params.search.channel) { channel = this.params.search.channel + '-'; } else { channel = '' }
      exportname = startdate + enddate + channel;
      const parame = {
        'path': '/test-report-bsp/homepage/bspreport/getStoreSaleRanking',
        'search': {},
        'desc': exportname + '商品销售排行',
        'sort': 'total',
        'sortDirKey': 'DESC',
        'export_columns': [
          { 'name': '商品条码', 'key': 'barcode' },
          { 'name': '商品编码', 'key': 'item_code' },
          { 'name': '商品名称', 'key': 'name' },
          { 'name': '数量', 'key': 'total' },
          { 'name': '金额', 'key': 'money' }
        ]

      };

      if (this.params.search.online_cat_code !== '') {
        this.params.search.catCode = this.params.search.online_cat_code;
      } else if (this.params.search.online_cat_code === ''
        && this.params.search.online_sup_code === '') {
        this.params.search.catCode = '';
      } else if (this.params.search.online_cat_code === ''
        && this.params.search.online_sup_code !== '') {
        this.params.search.catCode = this.params.search.online_sup_code;
      }
      this.params.search.startDate = String(this.params.search.startDate);
      this.params.search.endDate = String(this.params.search.endDate);
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
  startchange(event) {
    this._startDate = event;
    this.params.search.startDate = GMTToStr(event) + ' 00:00:00';
  }
  endchange(event) {
    this._endDate = event;
    this.params.search.endDate = GMTToStr(event) + ' 23:59:59';
  }
}
