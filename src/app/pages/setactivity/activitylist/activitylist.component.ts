import { Component, OnInit, Injector } from '@angular/core';
import { BaseParams } from 'src/app/utils/base.list.params';
import { HttpService } from 'src/app/http/http.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'src/app/services/breadcrumb.service';
import { NzNotificationService, NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'app-activitylist',
  templateUrl: './activitylist.component.html',
  styleUrls: ['./activitylist.component.less'],

})
export class ActivitylistComponent implements OnInit {
  public params: BaseParams = {
    search: {},
    page_size: 50,
    page_no: 1,
    sort: 'timestamp',
    sortDirKey: 'DESC'
  };
  public queryList = new Array();
  public activeList = new Array();
  public pageSize =
    {
      totalPage: 0,
      count: 0
    };
  public searchStart = false;
  constructor(private activatedRoute: ActivatedRoute,
    public router: Router, private http: HttpService, private breadcrumbService: BreadcrumbService, private notification: NzNotificationService, private modalService: NzModalService) {
    this.breadcrumbService.sendMessage(0);
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
        list: this.getSelection('region_code'),
        code: "",
      },
      {
        show: true,
        type: "select",
        label: "活动状态",
        name: "status",
        code: "",
        list: [
          {
            name: "全部",
            code: ""
          },
          {
            name: "未开始",
            code: "1"
          },
          {
            name: "进行中",
            code: "2"
          },
          {
            name: "已结束",
            code: "3"
          },
        ],
      },
    ];
  }

  getSelection(name) {
    this.http.getStorelist.request({})
      .subscribe((data) => {
        this.searchStart = true;
        this.queryList.forEach((item) => {
          if (item.name === name) {
            item.list = JSON.parse(JSON.stringify(data)).map((item1, index) => {
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
      });
  }


  // 获取所有查询条件
  search($event) {
    this.params.search = $event;
    if (this.searchStart) {
      this.getsearchresults();
    }
  }

  // 接收翻页操作传过来的值，然后请求服务得到新数据
  childparams($event) {
    const childoption = $event;
    this.params.page_no = childoption.page_no;
    this.getsearchresults();
  }

  // 获取活动列表
  getsearchresults() {
    this.http.getscopeactivitys.request(this.params)
      .subscribe(res => {
        this.activeList = res['rows'];
        this.pageSize.count = res['count'];
        console.log(this.activeList);
      });
  }

  // 提前下线分类活动
  pm_offline(params) {
    this.modalService.confirm({
      nzTitle: '温馨提示',
      nzContent: '是否提前下线',
      nzOnOk: () => {
        const offlineitem = {
          activity_id: params.activity_id,
          // group_code: params.group_code,  // 门店分组ID
          // group_name: params.group_name,	// 门店分组名称
          stores: [
            {
              region_code: params.region_code,
              region_name: params.region_name,
            }
          ],
          activity_name: params.activity_name,		// 活动名称
          channels: params.channels,	// 上线渠道
          online_time: params.online_time,	// 上线日期
          offline_time: params.offline_time,	// 下线日期
          status: '3'   // 活动状态,提前下线传status为3
        };
        console.log(offlineitem);
        this.http.offlineitem.request(offlineitem)
          .subscribe(res => {
            if (res['code'] === '0') {
              this.notification.create('success', '温馨提示', '活动已提前下线');
              this.getsearchresults();
            }
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
            this.getsearchresults();
          });
      }
    });
  }

  // 新建活动
  addNewActive() {
    this.router.navigate(['pages/setactivity/newactivity']);
  }
  // 修改分类
  pm_moify(item) {
    this.router.navigate(['pages/setactivity/newactivity', { item: JSON.stringify(item) }]);
  }

}
