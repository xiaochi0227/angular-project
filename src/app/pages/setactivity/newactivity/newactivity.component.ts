import { Component, OnInit, Injector } from '@angular/core';
import { HttpService } from 'src/app/http/http.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { BreadcrumbService } from 'src/app/services/breadcrumb.service';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'app-newactivity',
  templateUrl: './newactivity.component.html',
  styleUrls: ['./newactivity.component.less']
})

export class NewactivityComponent implements OnInit {
  public storelist: any;
  public channels: any;
  public newactivity: any = { // 新建活动保存
    activity_name: '',	// 活动名称
    channels: [], // 上线渠道
    stores: [], // 选择的门店
    online_time: '',	// 上线日期
    offline_time: '',	// 下线日期
  };
  public newlist: any;
  public newlisttwo = new Object();
  public selectedMultipleChannel = new Array(); // 渠道选中
  public activeDate: any; // 时间
  selecteditemarr: any = [];
  disabledvalue = false;
  isdisabled: any;
  issave = false;
  public savestatus = false;
  public selectedMultipleStore = new Array();
  public selectedAllStor = false;
  public importtip = false;
  isVisible = false;
  categoryslists: any;
  selectlev: any;
  changestorecount: any;
  codeparam: any;
  levparam: any;
  check: any;
  leverlists: any;
  activityitems: any;
  classparams: any = {
    activity_id: '',
    parent: '0',
    status: '1'
  };
  public pageSize = {
    totalPage: 0,
    count: 0
  };
  cow1 = 0;
  addgoodstocategory: any = { // 待分类商品添加分类保存传参
    search: {
      activity_id: '',
      parentcode: '',
      code: '',
      items: []
    },
    page_no: 1,
    page_size: 10
  };
  constructor(private injector: Injector, private http: HttpService, private router: Router,
    public activatedRoute: ActivatedRoute, private breadcrumbService: BreadcrumbService, private notification: NzNotificationService) {
    this.activatedRoute.data.subscribe(res => {
      console.log(res);
      this.breadcrumbService.sendMessage([{
        name: res.breadcrumb,
        url: this.router.url
      }]);
    });
    this.notification.config({
      nzPlacement: 'topRight'
    });
  }


  ngOnInit() {
    this.getStoreList();
    this.getChannels();
    this.activatedRoute.params.forEach((paramsInfo: Params) => {
      if (paramsInfo['item']) {
        this.newlist = JSON.parse(paramsInfo['item']);
        console.log(this.newlist);

      }
    });
    // this.newactivity.activity_name = this.newlist.activity_name;
    if (this.newlist && this.newlist.activity_id) {
      this.disabledvalue = true;  // 禁止修改门店
      this.issave = false;
      if (this.newlist.channels && this.newlist.channels.length > 0) {
        this.selectedMultipleChannel = [];
        for (let i = 0; i < this.newlist.channels.length; i++) {
          this.selectedMultipleChannel.push(this.newlist.channels[i].code);
        }
      }
      if (this.newlist.stores && this.newlist.stores.length > 0) {
        const strorearr = [];
        this.getStoreList().then(data => {
          if (data.length - 1 === this.newlist.stores.length) {
            this.checkedAllStores(['all']);
          } else {
            for (let i = 0; i < this.newlist.stores.length; i++) {
              this.selectedMultipleStore.push(this.newlist.stores[i].region_code);
            }
          }
        });
      }
      this.activeDate = [this.newlist.online_time, this.newlist.offline_time];
      console.log(this.activeDate);
      this.savestatus = true;
      if (this.newlist.status !== '2') {
        this.isdisabled = false;
        console.log(1);
      } else {
        this.isdisabled = true;
        console.log(2);
      }
      this.getscopeactivitycategorys(this.classparams);
      this.getnocategory();
    } else {
      // this._startDate = new Date(Date.now());
      // this._endDate = new Date(Date.now());
      // this.newactivity.online_time = GMTToStr(this._startDate) + ' 00:00:00';
      // this.newactivity.offline_time = GMTToStr(this._endDate) + ' 23:59:59';
    }
  }

  // uploadexcel(file2): void {
  //   file2.value = '';
  //   if (this.uploader.queue[0]) {
  //     let filename = this.uploader.queue[0].file.name;

  //     let Num = '';
  //     for (let i = 0; i < 6; i++) {
  //       Num += Math.floor(Math.random() * 10);
  //     }

  //     if (this.policy) {
  //       let keyvalue = this.policy.dir + 'files/' + Num + filename;
  //       this.uploader.options.additionalParameter = {
  //         name: Num + filename,
  //         key: keyvalue,
  //         policy: this.policy.policy,
  //         OSSAccessKeyId: this.policy.accessid,
  //         success_action_status: 200,
  //         signature: this.policy.signature
  //       };
  //       this.uploader.queue[0].onSuccess = (response, status, headers) => {
  //         // 上传文件成功
  //         if (status == 200) {
  //           // 上传文件后获取服务器返回的数据
  //           let sucopt = {
  //             activity_id: this.newlist.activity_id,
  //             filename: filename,
  //             // channel: '',
  //             // storesobj: '',
  //             key: keyvalue,
  //             local_url: 'images-m-glory.oss-cn-hangzhou-internal.aliyuncs.com/' + keyvalue,
  //             remote_url: 'http://images-m-glory.oss-cn-hangzhou.aliyuncs.com/' + keyvalue
  //           };

  //           this.importWhite(sucopt);
  //           file2.value = '';
  //           this.uploader.queue = [];
  //         } else {
  //           alert('上传失败!');
  //           file2.value = '';
  //           this.uploader.queue = [];
  //           // 上传文件后获取服务器返回的数据错误
  //         }
  //       };
  //       this.uploader.queue[0].withCredentials = false;
  //       this.uploader.queue[0].upload();
  //       file2.value = '';
  //     } else {
  //       this.getPolicyService.getpolicy()
  //         .then(res => {
  //           if (res) {
  //             setTimeout(function () { this.policy = false; }, 250000);
  //           }
  //           this.policy = res;
  //           let keyvalue = this.policy.dir + 'files/' + Num + filename;
  //           this.uploader.options.additionalParameter = {
  //             name: Num + filename,
  //             key: keyvalue,
  //             policy: this.policy.policy,
  //             OSSAccessKeyId: this.policy.accessid,
  //             success_action_status: 200,
  //             signature: this.policy.signature
  //           };
  //           this.uploader.queue[0].onSuccess = (response, status, headers) => {
  //             // 上传文件成功
  //             if (status == 200) {
  //               // 上传文件后获取服务器返回的数据
  //               let sucopt = {
  //                 activity_id: this.newlist.activity_id,
  //                 filename: filename,
  //                 key: keyvalue,
  //                 local_url: 'images-m-glory.oss-cn-hangzhou-internal.aliyuncs.com/' + keyvalue,
  //                 remote_url: 'http://images-m-glory.oss-cn-hangzhou.aliyuncs.com/' + keyvalue
  //               };
  //               this.importWhite(sucopt);
  //               file2.value = '';
  //               this.uploader.queue = [];
  //             } else {
  //               alert('上传失败!');
  //               file2.value = '';
  //               this.uploader.queue = [];
  //               // 上传文件后获取服务器返回的数据错误
  //             }
  //           };
  //           this.uploader.queue[0].withCredentials = false;
  //           this.uploader.queue[0].upload();
  //           file2.value = '';
  //         });
  //     }
  //   } else {
  //     alert('请检查后重试！');
  //   }
  // }


  // 获取门店信息
  getStoreList() {
    return new Promise<Array<any>>((resolve, reject) => {
      this.http.getStorelist.request({})
        .subscribe((data) => {
          this.storelist = data;
          this.storelist.unshift({
            "code": "all",
            "codename": "全部门店"
          });
          resolve(this.storelist);
        });
    });
  }

  // 门店全选
  checkedAllStores(event) {
    if (!event.every(item => item !== 'all')) {
      console.log("选择全部门店");
      this.storelist.filter(item => item['disabled'] = item['code'] === 'all' ? false : true);
      setTimeout(() => {
        this.selectedMultipleStore = ['all'];
      }, 0);
    } else {
      this.storelist.forEach(item => item['disabled'] = false);
      console.log("选择全部门店其他情况");
    }
  }


  // 获取渠道信息
  getChannels() {
    this.http.getownchannel.request({})
      .subscribe((data) => {
        this.channels = data;
      });
  }

  disabledDate = (current: Date): boolean => {
    let curDate = this.getDayTime(); // 当天零点
    let checktime = (new Date(current).getTime());
    if (checktime < curDate) {
      return true;
    }
  }
  // 获取当天零点时间
  getDayTime() {
    let date = new Date();
    let times = date.getTime();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
    let dayTime = times - hour * 3600 * 1000 - minute * 60 * 1000 - second * 1000;
    return dayTime;
  }

  // 新建修改活动保存
  saveavtivity() {
    this.newactivity.stores = [];
    this.newactivity.channels = [];
    console.log(this.newactivity);
    console.log(this.activeDate);
    console.log(this.selectedMultipleChannel);
    console.log(this.selectedMultipleStore);
    if (this.selectedMultipleChannel.length > 0 && this.newactivity.activity_name &&
      this.activeDate.length > 0 && this.selectedMultipleStore.length > 0) {
      this.channels.forEach(item => {
        this.selectedMultipleChannel.forEach(item2 => {
          if (item2 === item['channel_code']) {
            this.newactivity.channels.push({
              "code": item['channel_code'],
              "name": item['channel_name']
            });
          }
        });
      });

      if (this.selectedMultipleStore.length === 1 && this.selectedMultipleStore[0] === 'all') {
        this.newactivity.stores = this.storelist.filter(item => {
          if (item['code'] !== 'all') {
            let obj = {
              "region_code": item['code'],
              "region_name": item['codename']
            };
            return obj;
          }
        });
      } else {
        this.storelist.forEach(item => {
          this.selectedMultipleStore.forEach(item2 => {
            if (item2 === item['code']) {
              this.newactivity.stores.push({
                "region_code": item['code'],
                "region_name": item['codename']
              });
            }
          });
        });
      }

      let starTime = new Date(this.activeDate[0]);
      let endTime = new Date(this.activeDate[1]);
      this.newactivity.online_time = (starTime.getMonth() + 1) < 10 ? '0' + (starTime.getMonth() + 1) : starTime.getMonth() + 1;
      this.newactivity.offline_time = (endTime.getMonth() + 1) < 10 ? '0' + (endTime.getMonth() + 1) : endTime.getMonth() + 1;
      this.http.addscopeactivitys.request(this.newactivity)
        .subscribe(res => {
          if (res['data']) {
            this.newlist = res['data'];
            this.newlisttwo['offline_time'] = this.newactivity.offline_time;
            this.newlisttwo['online_time'] = this.newactivity.online_time;
          }

          this.notification.create('success', '温馨提示', res['msg']);
          if (res['code'] === '0') {
            // this.issave = true;
            this.savestatus = true;
          }
        })
      console.log(this.newactivity);

    } else {
      this.notification.create('error', '温馨提示', '红色 * 号为必填项');
    }
  }

  // 管理分类按钮
  pm_mangagealss() {
    let optid: any;
    if (this.newlist && this.newlist.activity_id) {
      optid = this.newlist;
    } else {
      optid = this.newlisttwo;
    }
    console.log(optid);
    this.router.navigate(['/pages/setactivity/manageclass', { item: JSON.stringify(optid) }]);
  }

  uploaded(event) {
    console.log(event);
  }

  getnocategory() {
    this.getactivityitems('', '0', false);
  }

  // 导入状态提示
  closeimportip() {
    this.importtip = false;
  }

  getlever2(levercode) {
    const params: any = {
      activity_id: this.classparams.activity_id,
      parent: levercode,
      status: '1'
    };
    this.http.getscopeactivitycategorys.request(params)
      .subscribe(res => {
        this.leverlists = res['rows'];
      })
  }

  getscopeactivitycategorys(params) {
    this.http.getscopeactivitycategorys.request(params)
      .subscribe(res => {
        this.categoryslists = res['rows'];
      })
  }

  storechildparams($event) {
    const childoption = $event;
    this.addgoodstocategory.page_no = childoption.page_no;
    this.cow1 = (childoption.page_no - 1) * childoption.page_size;
    this.getactivityitems(this.codeparam, this.levparam, true);
  }
  savecategory() {
    this.addgoodstocategory.search.activity_id = this.classparams.activity_id;
    this.addgoodstocategory.search.items = this.selecteditemarr;
    this.http.setselectcategory.request(this.addgoodstocategory.search)
      .subscribe(res => {
        this.notification.create('success', '温馨提示', res['msg']);
        if (res['code'] === 0) {
          this.selecteditemarr = [];
          this.addgoodstocategory.search.parentcode = '';
          this.addgoodstocategory.search.code = '';
          for (let i = 0; i < this.activityitems.length; i++) {
            this.activityitems[i].sfxz = false;
          }
          this.getscopeactivitycategorys(this.classparams);
          this.getnocategory();
        }

      });
  }
  getactivityitems(code, lev, check) {
    this.levparam = lev;
    this.check = check;
    this.codeparam = code;
    this.selectlev = lev;
    if (!check) { this.addgoodstocategory.page_no = 1; } else { this.addgoodstocategory.page_no = this.addgoodstocategory.page_no; }
    const opt = {
      search: {
        activity_id: this.classparams.activity_id,
        code: code
      },
      page_no: this.addgoodstocategory.page_no,
      page_size: this.addgoodstocategory.page_size
    };
    this.cow1 = (this.addgoodstocategory.page_no - 1) * this.addgoodstocategory.page_size;
    this.http.getactivityitems.request(opt)
      .subscribe(res => {
        this.activityitems = res['rows'];
        this.pageSize.count = res['count'];
        this.changestorecount = res['count'];
        for (let i = 0; i < this.activityitems.length; i++) {
          this.activityitems[i].sfxz = false;
        }
      });
  }

  showModal = () => {
    this.isVisible = true;
  }
  handleCancel = (e) => {
    this.isVisible = false;
  }
}
