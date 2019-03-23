import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseParams } from 'src/app/models';
import { HttpService } from 'src/app/http/http.service';
import { NzNotificationService, NzModalService } from 'ng-zorro-antd';
@Component({
  templateUrl: './personalityclass.html',
  styleUrls: ['./personalityclass.less']
})
export class PersonalityclassComponent implements OnInit {
  params: BaseParams = {
    page_no: 1,
    page_size: 50,
    search: {
      region_code: '',	// 门店分组编码
      status: ''		// 活动状态  0：未开始，1：进行中，2：已结束
    },
    sort: 'timestamp',
    sortDirKey: 'DESC',
  };
  stores: any = []; // 企业下所有门店
  activitylist: any = []; // 活动列表
  options: any;
  region_name: string;
  // offlineitem: any = {
  //   group_code: '',  // 门店分组ID
  //   group_name: '',	// 门店分组名称
  //   activity_name: '',		// 活动名称
  //   channels: [    ],	// 上线渠道
  //   online_time: '',	// 上线日期
  //   offline_time: '',	// 下线日期
  //   status: ''   // 活动状态,提前下线传status为3
  // };
  pageSize =
    {
      totalPage: 0,
      count: 0
    };
  changecount: any;
  cow: any;
  queryList: any = [];
  public searchStart = false; // 进行是否查询判断
  public storelist: any; // 门店列表
  constructor(private router: Router, private http: HttpService, private notification: NzNotificationService, private modalService: NzModalService) {
    console.log('persona');

    this.options = {
      onUpdate: (event: any) => {
      }
    };
    this.notification.config({
      nzPlacement: 'topRight'
    });
  }

  ngOnInit() {
    this.queryList = [
      {
        show: true,
        type: "select",
        label: "提交状态",
        name: "status",
        value: '',
        list: [
          { code: '', name: '全部' },
          { code: '1', name: '未提交线上' },
          { code: '2', name: '已提交线上' }
        ]
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
    ];
    this.searchStart = true;
    // this.getstores();
    // this.getactivitylist(this.params);
  }
  getSelection(name, parentCode = null) {
    // 避免经营渠道,已上线渠道，活动渠道多次请求
    switch (name) {
      case 'region_code':
        // 获取门店信息
        this.http.getStorelist.request({})
          .subscribe((data) => {
            if (data['code'] === '0' && data['data']) {
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

    }

  }
  // 获取所有查询条件
  search($event) {
    console.log($event);
    if (this.searchStart) {
      this.params.search = $event;
      this.getactivitylist(this.params);
    }
  }

  // 设置分类排序
  pm_setsort() {

  }
  // 新建分类
  pm_newactive() {
    this.router.navigate(['pages/goods/personalityclassdetail']);
  }
  // 修改分类
  pm_moify(item) {
    // this.router.navigate(['pages/setactivity/modifyactivity',  { items: JSON.stringify(item) }]
    this.router.navigate(['pages/goods/personalityclassdetail', { item: JSON.stringify(item) }]);


  }

  // 提交活动上线
  pm_offline(params) {
    console.log(params);
    this.modalService.confirm({
      nzTitle: '温馨提示',
      nzContent: '是否提交到线上',
      nzOnOk: () => {
        const offlineitem = {
          activity_id: params.activity_id,
          group_code: params.group_code,  // 门店分组ID
          group_name: params.group_name,	// 门店分组名称
          activity_name: params.activity_name,		// 活动名称
          channels: params.channels,	// 上线渠道
          online_time: params.online_time,	// 上线日期
          offline_time: params.offline_time,	// 下线日期
          status: '2',  // 活动状态,提交到线上status为2
          stores: params.stores
        };
        console.log(offlineitem);
        this.http.editscopeactivitys.request(offlineitem)
          .subscribe(res => {
            this.notification.create('success', '温馨提示', res['msg']);
            this.getactivitylist(this.params);
          });
      }
    });
  }
  // 删除活动
  pm_delactive(params) {
    this.modalService.confirm({
      nzTitle: '温馨提示',
      nzContent: '确认删除本条活动',
      nzOnOk: () => {
        this.http.delscopeactivity.request(params)
          .subscribe(res => {
            this.notification.create('success', '温馨提示', res['msg']);
            this.getactivitylist(this.params);
          });
      }
    });
  }

  // 查询企业下所有门店分组
  getstores() {
    this.http.getownregion.request()
      .subscribe(res => {
        let res1: any;
        res1 = res;
        const tmp = [{ region_code: '', region_name: '全部门店' }].concat(res1['data']['stores']);
        this.stores = tmp;
        for (let i = 0; i < this.stores.length; i++) {
          this.stores[i].code = this.stores[i].region_code;
          if (this.stores[i].region_code) {
            this.stores[i].codename = '[' + this.stores[i].region_code + ']' + this.stores[i].region_name;
          } else {
            this.stores[i].codename = this.stores[i].region_name;
          }

        }
      });
  }
  // 获取活动列表
  getactivitylist(params) {
    this.cow = (params.page_no - 1) * params.page_size;
    this.http.getspecialscopeactivitys.request(params)
      .subscribe(res => {
        this.activitylist = res['data']['rows'];
        this.pageSize.count = res['data']['count'];
        this.changecount = res['data']['count'];
        console.log(this.activitylist);
      });
  }
  childparams($event) {
    const childoption = $event;
    this.params.page_no = childoption.page_no;
    this.cow = (childoption.page_no - 1) * childoption.page_size;
    this.getactivitylist(childoption);

  }
  searchcode($event) {
    this.params.search.region_code = $event;
  }
  // 门店列表选择显示编码加名称
  searchname($event) {
    this.region_name = $event;
  }
  Reset() {
    this.params.search.status = '';
    this.params.search.region_code = '';
    this.region_name = '';
  }
}
