import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { BaseParams } from 'src/app/models';
import { HttpService } from 'src/app/http/http.service';
import { SortablejsOptions } from 'angular-sortablejs';
import { UploadResult } from 'src/app/sharecomponets/upload/upload.component';
import { NzNotificationService } from 'ng-zorro-antd';


@Component({
  templateUrl: './manageclass.component.html',
  styleUrls: ['./manageclass.component.less']
})
export class ManageclassComponent implements OnInit {
  isVisible = false;
  isConfirmLoading = false;
  isVisibletwo = false;
  isConfirmLoadingtwo = false;
  flag = false;
  small = 4;
  options: any;

  newfirstclass: any = {
    activity_id: '',    // 活动ID
    parent: '',       // 一级活动分类编码  没有填“0”
    parentName: '',    // 一级活动分类名称  没有为空
    code: '',        // 活动分类编码
    name: '',       // 活动分类名称
    type: '',     //  类型区分  add:新增  edit:修改
    status: ''
  };
  getclasslist: any = {
    activity_id: '',		 // 活动ID
    parent: '',             // 没有默认传 0查询一级分类
    status: ''          // true  和false
  };
  fllistsearch: any = {
    activity_id: '',		// 活动ID
    parent: '0', // 没有默认传 0查询一级分类
    status: ''  // 0 1
  };
  newsecondclass: any = {
    activity_id: '',             // 活动ID
    parent: '',                // 一级活动分类编码  没有填“0”
    parentName: '',	                // 一级活动分类名称  没有为空
    code: '',                    // 活动分类编码
    name: '',                   // 活动分类名称
    type: 'add'                     // 类型区分  add:新增  edit:修改
  };
  fllist: any;  // 活动分类列表
  goodslist: any; // 商品列表
  newlist: any;
  newsecondlist: any;
  selected: any;
  newactivity: any = {
    code: '',
    name: '',
    status: ''
  };
  policy: any;
  importtip: boolean = false;
  loadingimg: boolean = false;
  results: any;
  nomodify: boolean = false;
  modalwidth: number; // 弹出框宽度
  templeteobj: any; // 提示templete
  modaltitle: string; // 弹出框title
  modalstatus: boolean; // 弹出框状态
  modalconfirloading: boolean; // 弹出框提交loading
  confirmisshow: boolean; // 弹出框是否显示确认按钮

  selectedbts: any[] = [];
  clickarr: any[] = [];
  j: number = 0;
  emptytip: any[] = [];
  showlevel2: any = [];
  constructor(private router: Router, private http: HttpService,
    private activatedRoute: ActivatedRoute, private notification: NzNotificationService) {
    this.activatedRoute.params.forEach((paramsInfo: Params) => {
      console.log(paramsInfo);
      if (paramsInfo) {
        this.newlist = JSON.parse(paramsInfo['item']);
      }
    });
    this.options = {
      onUpdate: (event: any) => {
      }
    };
    this.notification.config({
      nzPlacement: 'topRight'
    });
  }

  ngOnInit() {
    this.getfllist(); // 获取一级分类下的活动分类
  }
  pm_newone() {
    this.modaltitle = '新建一级分类';
    this.modalwidth = 600;
    this.modalstatus = true;
    this.confirmisshow = true;

    this.nomodify = false;
    this.flag = false;
  }
  pm_newtwo(item) {
    this.modaltitle = '新建二级分类';
    this.modalwidth = 600;
    this.confirmisshow = true;
    this.flag = true;
    this.nomodify = false;
    this.modalstatus = true;
    this.newsecondclass.parent = item.code;
    this.newsecondclass.parentName = item.name;
  }
  showModal = () => {
    this.isVisible = true;
    console.log(666);
  }
  pm_modifyone(params) {
    this.modaltitle = '修改一级分类';
    this.modalwidth = 600;
    this.confirmisshow = true;
    this.flag = false;
    console.log('修改');
    if (params.activity_id) {
      this.newfirstclass.activity_id = params.activity_id;
      this.newfirstclass.code = params.code;
      this.newfirstclass.name = params.name;
      this.newfirstclass.parent = '0'; // 一级活动分类编码  没有填“0”
      this.newfirstclass.parentName = '';		// 一级活动分类名称  没有为空
      this.newfirstclass.status = params.status;
      this.newfirstclass.type = 'edit';
      this.modalstatus = true;
      this.nomodify = true;
    }
  }
  pm_modifytwo(params) {
    this.modaltitle = '修改二级分类';
    this.modalwidth = 600;
    this.confirmisshow = true;
    this.flag = true;
    console.log('修改');
    if (params.activity_id) {
      // this.newsecondclass = params;
      this.newsecondclass.code = params.code;
      this.newsecondclass.name = params.name;
      this.newsecondclass.activity_id = params.activity_id;
      this.newsecondclass.parent = params.parent;
      this.newsecondclass.parentName = params.parentName;
      this.newsecondclass.status = params.status;
      this.newsecondclass.type = 'edit';
      this.modalstatus = true;
      this.nomodify = true;
    }
  }
  closemodal() { // 关闭弹出框时重置modalstatus默认值
    this.modalstatus = false;
    this.flag = false;
    this.newsecondclass.code = '';
    this.newsecondclass.name = '';
    this.newsecondclass.status = '';
    this.newfirstclass.code = '';
    this.newfirstclass.name = '';
    this.newfirstclass.status = '';
  }
  handleokfun(key) {
    switch (key) {
      case '新建一级分类':
        this.newfirstclass.activity_id = this.newlist.activity_id;
        this.newfirstclass.type = 'add';
        if (this.newfirstclass.code && this.newfirstclass.name && this.newfirstclass.status) {
          this.http.addscopeactivitycategory.request(this.newfirstclass)
            .subscribe(res => {
              if (res['code'] === '0') {
                this.notification.create('success', '温馨提示', '一级分类创建成功');
                this.getfllist();
                this.newfirstclass.code = '';
                this.newfirstclass.name = '';
                this.newfirstclass.status = '';
                this.closemodal();
              } else {
                this.notification.create('error', '温馨提示', res['msg']);
              }
            });
        } else {
          this.notification.create('error', '温馨提示', '红色星号为必填项');
        }
        break;
      case '修改一级分类':
        if (this.newfirstclass.code && this.newfirstclass.name && this.newfirstclass.status) {
          if (this.newfirstclass.status === '2') {
            const opt: any = {
              activity_id: this.newfirstclass.activity_id,		// 活动ID
              parent: this.newfirstclass.code,                // 没有默认传 0查询一级分类
              status: ''
            };
            this.http.getscopeactivitycategorys.request(opt)
              .subscribe(active => {
                if (active['rows'].length > 0) {
                  this.notification.create('error', '温馨提示', '该一级分类存在二级分类,不能停用');
                } else {
                  this.http.addscopeactivitycategory.request(this.newfirstclass)
                    .subscribe(res => {
                      if (res['code'] === '0') {
                        this.newfirstclass.code = '';
                        this.newfirstclass.name = '';
                        this.newfirstclass.status = '';
                        this.getfllist();
                      } else {
                        this.notification.create('error', '温馨提示', res['msg']);
                      }
                    });
                }
              });
          } else {
            this.http.addscopeactivitycategory.request(this.newfirstclass)
              .subscribe(res => {
                if (res['code'] === '0') {
                  this.newfirstclass.code = '';
                  this.newfirstclass.name = '';
                  this.newfirstclass.status = '';
                  this.notification.create('success', '温馨提示', res['msg']);
                  this.getfllist();
                } else {
                  this.notification.create('error', '温馨提示', res['msg']);
                }
              });
          }
        } else {
          this.notification.create('error', '温馨提示', '红色 * 号必填');
        }
        this.isConfirmLoading = true;
        setTimeout(() => {
          this.isVisible = false;
          this.isConfirmLoading = false;
          this.flag = false;

        }, 1000);
        break;
      case '新建二级分类':
        this.nomodify = false;
        this.newsecondclass.activity_id = this.newlist.activity_id;
        this.newsecondclass.type = 'add';
        if (this.newsecondclass.code.length && this.newsecondclass.name.length && this.newsecondclass.status) {
          console.log(this.newsecondclass);
          this.http.addactivitycategory.request(this.newsecondclass)
            .subscribe(res => {
              if (res['code'] === '0') {
                this.notification.create('success', '温馨提示', '二级分类创建成功');
                this.getlevelagain2();
                this.newsecondclass.code = '';
                this.newsecondclass.name = '';
                this.newsecondclass.status = '';
                this.closemodal();
                console.log(res);
                this.flag = true;
              } else {
                this.notification.create('error', '温馨提示', res['msg']);
              }
            });
        } else {
          this.notification.create('error', '温馨提示', '红色星号未必填项');
        }
        break;
      case '修改二级分类':
        if (this.newsecondclass.code.length && this.newsecondclass.name.length) {
          console.log(this.newsecondclass);
          this.http.addactivitycategory.request(this.newsecondclass)
            .subscribe(res => {
              if (res['code'] === '0') {
                this.notification.create('success', '温馨提示', '二级分类修改成功');
                this.getlevelagain2();
                this.newsecondclass.code = '';
                this.newsecondclass.name = '';
                this.newsecondclass.status = '';
                this.closemodal();
                this.flag = true;
                console.log(res);
              } else {
                this.notification.create('error', '温馨提示', res['msg']);
              }
            });
        } else {
          this.notification.create('error', '温馨提示', '红色星号未必填项');
        }
        break;
    }
  }

  // 获取一级活动分类列表
  getfllist() {
    this.fllistsearch.activity_id = this.newlist.activity_id;
    this.http.getscopeactivitycategorys.request(this.fllistsearch)
      .subscribe(res => {
        this.fllist = res['rows'];
      });
  }
  getlevelagain2() {
    const opt: any = {
      activity_id: this.newlist.activity_id,		// 活动ID
      parent: this.selected.code, // 没有默认传 0查询一级分类
      status: ''    //  true  和false
    };
    this.http.getscopeactivitycategorys.request(opt)
      .subscribe(res => {
        console.log(res);
        this.newsecondlist = res['rows'];
      });
  }
  // 获取二级活动分类列表
  getlevel2(item, event, i) {
    this.selected = item;
    if (this.selectedbts[i]) {  // 判断点击的按钮是哪种状态，然后切换状态
      this.clickarr[i] = this.j;
      if (this.clickarr[i] % 2 !== 0) {   // 判断一个按钮点了几次，通过取余判断，查看就改为收起
        this.clickarr[i] = 0;
        const params: any = {
          activity_id: item.activity_id,
          parent: item.code,
          status: ''
        };
        this.http.getactivitycategorys.request(params)
          .subscribe(res => {
            console.log(res);
            this.newsecondlist = res['rows'];
            this.showlevel2[i] = this.newsecondlist;
          });
        this.selectedbts[i] = true;
        event.target.value = '-';
      } else {                                     // 收起就改为查看状态
        this.clickarr[i] = 1;
        this.selectedbts[i] = false;
        event.target.value = '+';
      }
    } else {
      const params: any = {
        activity_id: item.activity_id,
        parent: item.code,
        status: ''
      };
      this.http.getactivitycategorys.request(params)
        .subscribe(res => {
          console.log(res);
          this.newsecondlist = res['rows'];
          this.showlevel2[i] = this.newsecondlist;
        });
      this.selectedbts[i] = true;
      event.target.value = '-';
      this.j = 0;
    }
  }

  pm_back() {
    this.router.navigate(['pages/goods/personalityclassdetail', { item: JSON.stringify(this.newlist) }]);
  }

  // 批量导入分类
  // tslint:disable-next-line:member-ordering
  // 导入提示
  createBasicNotification(template: TemplateRef<{}>): void {
    this.notification.template(template, { nzDuration: 0 });
  }
  uploadexcel = (result: UploadResult): void => {
    const sucopt = {
      activity_id: this.newlist.activity_id,
      filename: result.fileName,
      channel: '',
      storesobj: '',
      key: result.key,
      local_url: result.localUrl,
      remote_url: result.remoteUrl
    };
    this.http.activitycategorysinput.request(sucopt)
      .subscribe(data => {
        if (data) {
          this.results = data;
          this.createBasicNotification(this.templeteobj);
          this.getfllist();
        }
      });
  }

  // 导入状态提示
  closeimportip() {
    this.importtip = false;
  }
  // 保存顺序按钮
  savesortorder() {
    const optone = {
      activity_id: this.newlist.activity_id,
      categories: this.fllist,
    };
    // this.fllist = opt.categories;
    this.http.sortcategory.request(optone)
      .subscribe(tip => {
        // alert(tip.msg);
        // this.parent = '0';
        this.getfllist();
      });
    const opttwo = {
      activity_id: this.newlist.activity_id,
      categories: this.newsecondlist,
    };
    // this.fllist = opt.categories;
    this.http.sortcategory.request(opttwo)
      .subscribe(tip => {
        this.notification.create('success', '温馨提示', tip['msg']);
        // this.parent = '0';
        this.getlevelagain2();
      });
  }

}

