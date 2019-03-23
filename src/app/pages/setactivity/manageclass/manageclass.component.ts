import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/http/http.service';
import { testUpload } from 'src/app/utils/test.upload';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'app-manageclass',
  templateUrl: './manageclass.component.html',
  styleUrls: ['./manageclass.component.less']
})
export class ManageclassComponent implements OnInit {
  isVisible = false;
  isConfirmLoading = false;
  isVisibletwo = false;
  isConfirmLoadingtwo = false;
  modaltitle: any;
  flag = false;
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
  importtip: Boolean = false;
  loadingimg: Boolean = false;
  results: any;
  nomodify: Boolean = false;
  new_results: any;
  constructor(private router: Router,
    private http: HttpService,
    private activatedRoute: ActivatedRoute, private notification: NzNotificationService) {
    this.activatedRoute.params.forEach((paramsInfo) => {
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
    console.log(666);
    this.modaltitle = '新建一级分类';
    this.showModal();
    this.nomodify = false;
    this.flag = false;
  }

  pm_newtwo() {
    this.modaltitle = '新建二级分类';
    this.flag = true;
    this.nomodify = false;
    if (!this.newsecondlist) {
      this.notification.create('error', '温馨提示', '请先选择一级分类');
      return;
    } else {
      this.showModal();
    }
  }

  showModal = () => {
    this.isVisible = true;
    console.log(666);
  }

  pm_modifyone(params) {
    console.log(params);
    this.modaltitle = '修改一级分类';
    this.nomodify = true;
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
      this.showModal();
    }
  }

  pm_modifytwo(params) {
    this.modaltitle = '修改二级分类';
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
      this.showModal();
      this.nomodify = true;
    }
  }


  handleOk = (e) => {
    if (this.modaltitle === '新建一级分类') {
      this.newfirstclass.activity_id = this.newlist.activity_id;
      this.newfirstclass.type = 'add';
      if (this.newfirstclass.code && this.newfirstclass.name && this.newfirstclass.status) {
        this.http.newfirstclass.request(this.newfirstclass)
          .subscribe(res => {
            if (res['code'] === '0') {
              this.notification.create('success', '温馨提示', '一级分类创建成功');
              this.getfllist();
              this.newfirstclass.code = '';
              this.newfirstclass.name = '';
              this.newfirstclass.status = '';
              this.isVisible = false;
            } else {
              this.notification.create('error', '温馨提示', res['msg']);
            }
          });
      } else {
        this.notification.create('error', '温馨提示', '红色星号为必填项');
      }
    } else if (this.modaltitle === '修改一级分类') {
      if (this.newfirstclass.code && this.newfirstclass.name && this.newfirstclass.status) {
        if (this.newfirstclass.status === '2') {
          const opt: any = {
            activity_id: this.newfirstclass.activity_id,		// 活动ID
            parent: this.newfirstclass.code,                // 没有默认传 0查询一级分类
            status: ''
          };
          this.getscopeactivitycategorys(opt)
            .then(res => {
              if (res['rows'].length > 0) {
                this.notification.create('error', '温馨提示', '该一级分类存在二级分类,不能停用');
              } else {
                this.newfirstclassFun().then(data => {
                  if (data['code'] === '0') {
                    this.getfllist();
                  }
                })
              }
            });
        } else {
          this.newfirstclassFun().then(data => {
            if (data['code'] === '0') {
              this.notification.create('success', '温馨提示', data['msg']);
              this.getfllist();
            }
          });
        }
        this.isConfirmLoading = true;
        setTimeout(() => {
          this.isVisible = false;
          this.isConfirmLoading = false;
          this.flag = false;

        }, 1000);
      }
    } else if (this.modaltitle === '新建二级分类') {
      console.log('这是新建二级分类');
      this.newsecondclass.activity_id = this.newlist.activity_id;

      if (this.newsecondclass.code.length && this.newsecondclass.name.length && this.newsecondclass.status) {
        console.log(this.newsecondclass);
        this.newfirstclassFun().then(data => {
          if (data['code'] === '0') {
            this.notification.create('success', '温馨提示', '二级分类创建成功');
            this.getlevelagain2();
            this.isVisible = false;
          }
        });

      } else {
        this.notification.create('error', '温馨提示', '红色星号未必填项');
      }
    } else if (this.modaltitle === '修改二级分类') {
      console.log('这是修改二级分类');
      // this.newsecondclass.activity_id = params.activity_id;

      if (this.newsecondclass.code.length && this.newsecondclass.name.length) {
        console.log(this.newsecondclass);
        this.newfirstclassFun().then(data => {
          if (data['code'] === '0') {
            this.notification.create('success', '温馨提示', '二级分类创建成功');
            this.getlevelagain2();
            this.isVisible = false;
          }
        });


      } else {
        this.notification.create('error', '温馨提示', '红色星号未必填项');
      }
    }
  }


  handleCancel = () => {
    this.isVisible = false;
    this.flag = false;
    this.newsecondclass.code = '';
    this.newsecondclass.name = '';
    this.newsecondclass.status = '';
    this.newfirstclass.code = '';
    this.newfirstclass.name = '';
    this.newfirstclass.status = '';
  };
  // 获取一级活动分类列表
  getfllist() {
    this.fllistsearch.activity_id = this.newlist.activity_id;
    this.http.getfllist.request(this.fllistsearch)
      .subscribe(res => {
        this.fllist = res['rows'];
      });
  }

  // 新增分类
  newfirstclassFun() {
    return new Promise<Object>((resolve, reject) => {
      this.http.addscopeactivitycategory.request(this.newfirstclass)
        .subscribe(res => {
          if (res['code'] === '0') {
            this.newfirstclass.code = '';
            this.newfirstclass.name = '';
            this.newfirstclass.status = '';
          } else {
            this.notification.create('error', '温馨提示', res['msg']);
          }
          resolve(res);
        });
    });
  }

  getlevelagain2() {
    const opt: any = {
      activity_id: this.newlist.activity_id,		// 活动ID
      parent: this.selected.code, // 没有默认传 0查询一级分类
      status: ''    //
    };
    this.getscopeactivitycategorys(opt);
  }

  // 获取活动列表
  getscopeactivitycategorys(opt) {
    return new Promise<Object>((resolve, reject) => {
      this.http.getscopeactivitycategorys.request(opt)
        .subscribe(res => {
          this.newsecondlist = res['rows'];
          resolve(res);
        });
    });

  }


  // 获取二级活动分类列表
  getlevel2(item) {
    this.selected = item;
    this.newsecondclass.parent = item.code;
    this.newsecondclass.parentName = item.name;
    console.log(item);
    const params: any = {
      activity_id: item.activity_id,
      parent: item.code,
      status: ''
    };
    this.getscopeactivitycategorys(params);
  }
  // 一级分类筛选
  isopen() {

  }

  pm_back() {
    this.router.navigate(['pages/setactivity/newactivity', { item: JSON.stringify(this.newlist) }]);
  }

  // 批量导入分类
  // tslint:disable-next-line:member-ordering
  uploader: testUpload = new testUpload({
    url: 'http://images-m-glory.oss-cn-hangzhou.aliyuncs.com',
    method: 'POST'
  });
  uploadexcel(file2): void {
    file2.value = '';
    if (this.uploader.queue[0]) {
      let filename = this.uploader.queue[0].file.name;

      let Num = '';
      for (let i = 0; i < 6; i++) {
        Num += Math.floor(Math.random() * 10);
      }

      if (this.policy) {
        let keyvalue = this.policy.dir + 'files/' + Num + filename;
        this.uploader.options.additionalParameter = {
          name: Num + filename,
          key: keyvalue,
          policy: this.policy.policy,
          OSSAccessKeyId: this.policy.accessid,
          success_action_status: 200,
          signature: this.policy.signature
        };
        this.uploader.queue[0].onSuccess = (response, status, headers) => {
          // 上传文件成功
          if (status === 200) {
            // 上传文件后获取服务器返回的数据
            let sucopt = {
              activity_id: this.newlist.activity_id,
              filename: filename,
              // channel: '',
              // storesobj: '',
              key: keyvalue,
              local_url: 'images-m-glory.oss-cn-hangzhou-internal.aliyuncs.com/' + keyvalue,
              remote_url: 'http://images-m-glory.oss-cn-hangzhou.aliyuncs.com/' + keyvalue
            };

            this.importWhite(sucopt);

          } else {
            this.notification.create('error', '温馨提示', '上传失败!');
            // file3.value = '';

            this.uploader.queue = [];
            // 上传文件后获取服务器返回的数据错误
          }
        };
        this.uploader.queue[0].withCredentials = false;
        this.uploader.queue[0].upload();
        file2.value = '';
      } else {
        this.http.getpolicy.request()
          .subscribe(res => {
            if (res) {
              setTimeout(function () { this.policy = false; }, 250000);
            }
            this.policy = res;
            let keyvalue = this.policy.dir + 'files/' + Num + filename;
            this.uploader.options.additionalParameter = {
              name: Num + filename,
              key: keyvalue,
              policy: this.policy.policy,
              OSSAccessKeyId: this.policy.accessid,
              success_action_status: 200,
              signature: this.policy.signature
            };
            this.uploader.queue[0].onSuccess = (response, status, headers) => {
              // 上传文件成功
              if (status === 200) {
                // 上传文件后获取服务器返回的数据
                let sucopt = {
                  activity_id: this.newlist.activity_id,
                  filename: filename,
                  key: keyvalue,
                  local_url: 'images-m-glory.oss-cn-hangzhou-internal.aliyuncs.com/' + keyvalue,
                  remote_url: 'http://images-m-glory.oss-cn-hangzhou.aliyuncs.com/' + keyvalue
                };
                this.importWhite(sucopt);

              } else {
                this.notification.create('error', '温馨提示', '上传失败!');
                file2.value = '';
                this.uploader.queue = [];
                // 上传文件后获取服务器返回的数据错误
              }
            };
            this.uploader.queue[0].withCredentials = false;
            this.uploader.queue[0].upload();
            file2.value = '';
          });
      }
    } else {
      this.notification.create('error', '温馨提示', '请检查后重试！');
    }
  }
  importWhite(params) {
    this.http.onlineInput.request(params)
      .subscribe(data => {
        if (data) {
          this.loadingimg = false;
          this.importtip = true;
          this.new_results = data;
          this.getfllist();
        }
      })
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
    this.http.savesortorder.request(optone)
      .subscribe(data => {
        this.getfllist();
      });
    const opttwo = {
      activity_id: this.newlist.activity_id,
      categories: this.newsecondlist,
    };
    this.http.savesortorder.request(opttwo)
      .subscribe(data => {
        this.notification.create('success', '温馨提示', data['msg']);
        // this.parent = '0';
        this.getlevelagain2();
      });


  }
}


