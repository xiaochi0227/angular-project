import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { BaseParams } from 'src/app/models';
import { HttpService } from 'src/app/http/http.service';
import { UploadResult } from 'src/app/sharecomponets/upload/upload.component';
import { NzNotificationService, NzModalService } from 'ng-zorro-antd';
import { GMTToStr } from 'src/app/validates/validates';
@Component({
  templateUrl: './personalityclassdetail.html',
  styleUrls: ['./personalityclassdetail.less']
})
export class PersonalityclassdetailComponent implements OnInit {

  _startDate = null; // 时间选择框
  _endDate = null;

  // tab标签页
  searchOptions; // 自有渠道列表
  selectedMultipleOption: any = []; // 选中的渠道列表
  storegroup: any = []; // 门店分组列表
  policy: any;
  newactivity: any = { // 新建活动保存
    activity_name: '',	// 活动名称
    channels: [], // 上线渠道
    stores: [], // 选择的门店
  };
  importtip = false;
  goodslist: any;
  newlist: any;
  newlisttwo: any;
  classparams: any = {
    activity_id: '',
    parent: '0',
    status: '1'
  };
  pageSize =
    {
      totalPage: 0,
      count: 0
    };
  categoryslists: any;
  activityitems: any;
  savestatus = false;
  allchecked = false; // 分类商品全选复选框
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
  newactivityid: any;
  selecteditemarr: any = [];
  isVisible = false;
  editgoods: any;
  disabledvalue: any;
  pm_paramsInfo: any;
  userentid: any;
  modalwidth: number; // 弹出框宽度
  templeteobj: any; // 提示templete
  modaltitle: string; // 弹出框title
  modalstatus: boolean; // 弹出框状态
  modalconfirloading: boolean; // 弹出框提交loading
  confirmisshow: boolean; // 弹出框是否显示确认按钮
  constructor(private router: Router, private http: HttpService, private notification: NzNotificationService
    , private activatedRoute: ActivatedRoute, private modalService: NzModalService) {
    this.notification.config({
      nzPlacement: 'topRight'
    });
    }


  ngOnInit() {
    this.getStorelist(); // 获取分组列表
    this.getowerchannel(); // 获取自有渠道列表
    this.activatedRoute.params.forEach((paramsInfo: Params) => {
      this.pm_paramsInfo = paramsInfo;
      if (paramsInfo['item']) {
        this.newlist = JSON.parse(paramsInfo['item']);
      }

    });
    this.disabledvalue = false;
    if (this.newlist && this.newlist.activity_id) {
      this.disabledvalue = true;
      if (this.newlist.channels && this.newlist.channels.length > 0) {
        this.selectedMultipleOption = [];
        for (let i = 0; i < this.newlist.channels.length; i++) {
          this.selectedMultipleOption.push(this.newlist.channels[i].code);
        }
      }
      if (this.newlist.stores && this.newlist.stores.length > 0) {
        const strorearr = [];
        for (let i = 0; i < this.newlist.stores.length; i++) {
          strorearr.push(this.newlist.stores[i].region_code);
        }
        this.userstores = strorearr.join(',');
      }
      this.newactivity.activity_name = this.newlist.activity_name;
      this.classparams.activity_id = this.newlist.activity_id;
      this.savestatus = true;
      this.getactivitycategorys(this.classparams);
      this.getnocategory();
    }
    const localuser = window.localStorage.getItem('userinfo');
    const userentid = JSON.parse(localuser).ent_id;
    this.userentid = userentid;
  }
  leverlists: any;
  getlever2(levercode, i) {
    console.log(this.categoryslists);
    if (i === '2') {
      this.editgoods.code = '';
    }

    const params: any = {
      activity_id: this.classparams.activity_id,
      parent: levercode,
      status: '1'
    };
    this.http.getactivitycategorys.request(params)
      .subscribe(res => {
        this.leverlists = res['rows'];
      });
  }
  savecategory() {
    this.addgoodstocategory.search.activity_id = this.classparams.activity_id;
    this.addgoodstocategory.search.items = this.selecteditemarr;
    this.http.selectcategory.request(this.addgoodstocategory.search)
      .subscribe(res => {
        if (res['data']['msg']) {
          this.notification.create('success', '温馨提示', res['data']['msg']);
        } else {
          this.selecteditemarr = [];
          this.addgoodstocategory.search.parentcode = '';
          this.addgoodstocategory.search.code = '';
          for (let i = 0; i < this.activityitems.length; i++) {
            this.activityitems[i].sfxz = false;
          }
          this.allchecked = false;
          this.getactivitycategorys(this.classparams);
          this.getnocategory();
        }
      });
  }
  selectitem() {
    this.selecteditemarr = [];
    for (let i = 0; i < this.activityitems.length; i++) {
      if (this.activityitems[i].sfxz) {
        this.selecteditemarr.push(this.activityitems[i]);
      }
    }
  }
  allcheckedfun(allcheck) {
    if (allcheck) {
      this.allchecked = true;
      for (let i = 0; i < this.activityitems.length; i++) {
        this.activityitems[i].sfxz = true;
      }
    } else {
      this.allchecked = false;
      for (let i = 0; i < this.activityitems.length; i++) {
        this.activityitems[i].sfxz = false;
      }
    }
    this.selectitem();
  }
  // 批量导入商品分类
  // loadingimgurl: string = loadingimage;
  // tslint:disable-next-line:member-ordering
  loadingimg: boolean = false;
  results: any;
  // 商品白名单导入

  // 上传导入文件到oss
  // tslint:disable-next-line:member-ordering


  getactivitycategorys(params) {
    this.http.getactivitycategorys.request(params)
      .subscribe(res => {
        this.categoryslists = res['rows'];
      });
  }
  selectlev: any;
  changestorecount: any;
  codeparam: any;
  levparam: any;
  check: any;
  getactivityitems(code, lev, check) {
    this.levparam = lev;
    this.codeparam = code;
    this.selectlev = lev;
    this.check = check;
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
        if (res['code'] === '010001000') {
          this.activityitems = res['data']['rows'];
          this.pageSize.count = res['data']['count'];
          this.changestorecount = res['data']['count'];
          for (let i = 0; i < this.activityitems.length; i++) {
            this.activityitems[i].sfxz = false;
          }
        }
      });
  }
  getnocategory() {
    this.getactivityitems('', '0', false);
  }

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
    this.http.activityitemcatinput.request(sucopt)
      .subscribe(data => {
        if (data) {
          this.results = data;
          this.createBasicNotification(this.templeteobj);
          this.getactivitycategorys(this.classparams);
          this.getnocategory();
        }
      });
  }

  // 新建活动  管理分类
  pm_management() {

  }

  // 点击展示分类商品
  pm_classgood() {

  }
  // 管理分类按钮
  pm_mangagealss() {
    let optid: any;
    if (this.newlist && this.newlist.activity_id) {
      optid = this.newlist;
    } else {
      optid = this.newlisttwo;
    }
    this.router.navigate(['/pages/goods/manageclass', { item: JSON.stringify(optid) }]);
  }

  // 查询企业下所有门店分组
  getstoregroup() {
    this.http.findStoreGroup.request()
      .subscribe(res => {
        this.storegroup = res['data'];
      });
  }
  // 新建修改活动保存
  saveavtivity() {
    if (this.searchOptions && this.selectedMultipleOption) {
      this.newactivity.channels = [];
      for (let i = 0; i < this.searchOptions.length; i++) {
        for (let j = 0; j < this.selectedMultipleOption.length; j++) {
          if (this.searchOptions[i].channel_code === this.selectedMultipleOption[j]) {
            const opt = {
              code: this.searchOptions[i].channel_code,
              name: this.searchOptions[i].channel_name
            };
            this.newactivity.channels.push(opt);
          }
        }
      }
    }
    if (this.userstores && this.stores) {
      this.newactivity.stores = [];
      for (let i = 0; i < this.stores.length; i++) {
        for (let j = 0; j < this.userstores.length; j++) {
          if (this.stores[i].region_code === this.userstores[j]) {
            const opt = {
              region_code: this.stores[i].region_code,
              region_name: this.stores[i].region_name
            };
            this.newactivity.stores.push(opt);
          }
        }
      }
    }
    if (this.newactivity.activity_name.length > 0 && this.newactivity.channels.length > 0 && this.newactivity.stores.length > 0) {
      if (this.newactivity.activity_name.length > 10) {
        this.notification.create('warning', '温馨提示', '活动名称字符应少于10个');
      } else {
        if (this.newlist && this.newlist.activity_id) {
          this.newactivity.status = this.newlist.status;
          this.newactivity.activity_id = this.newlist.activity_id;
          this.http.editscopeactivitys.request(this.newactivity)
            .subscribe(res => {
              this.notification.create('success', '温馨提示', res['msg']);
            });
        } else {
          this.http.editspecialscopeactivitys.request(this.newactivity)
            .subscribe(res => {
              this.newlisttwo = res['data'];
              this.notification.create('success', '温馨提示', res['msg']);
              if (res['code'] === '0') {
                this.savestatus = true;
              }
            });
        }
      }
    } else {
      this.notification.create('error', '温馨提示', '红色 * 号为必填项');
    }
  }


  level2: any;
  showlevel2: any = [];
  selectedbts: any[] = [];
  clickarr: any[] = [];
  j: number = 0;
  emptytip: any[] = [];
  getlevel2(levelcode, event, i) {
    if (this.selectedbts[i]) {  // 判断点击的按钮是哪种状态，然后切换状态
      this.clickarr[i] = this.j;
      if (this.clickarr[i] % 2 !== 0) {   // 判断一个按钮点了几次，通过取余判断，查看就改为收起
        this.clickarr[i] = 0;
        const params: any = {
          activity_id: this.classparams.activity_id,
          parent: levelcode,
          status: '1'
        };
        this.http.getactivitycategorys.request(params)
          .subscribe(res => {
            this.level2 = res['rows'];
            this.showlevel2[i] = this.level2;
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
        activity_id: this.classparams.activity_id,
        parent: levelcode,
        status: '1'
      };
      this.http.getactivitycategorys.request(params)
        .subscribe(categories => {
          this.level2 = categories['rows'];
          this.showlevel2[i] = this.level2;
          if (this.showlevel2[i].length > 0) {
            this.emptytip[i] = false;
          } else {
            this.emptytip[i] = true;
          }
        });
      this.selectedbts[i] = true;
      event.target.value = '-';
      this.j = 0;
    }
  }
  // 自有渠道展示
  getowerchannel() {
    this.http.getownchannel.request()
      .subscribe(res => {
        this.searchOptions = res['data'].list;
      });
  }

  // 自有渠道多选框

  // setTimeout(  () => {
  //   this.searchOptions = [
  //     { value: 'jack', label: '杰克' },
  //     { value: 'lucy', label: '露西' },
  //     { value: 'tom', label: '汤姆' }
  //   ]
  // }, 300);
  // setTimeout(() => {
  //   this.selectedMultipleOption = [];
  // }, 1000);

  // 获取活动商品列表
  getgoodslist() {
    const opt = {
      activity_id: '',		// 活动ID
      code: '' // 分类编码 ，没有传null 或者“”
    };
    this.http.getactivityitems.request(opt)
      .subscribe(res => {
        this.goodslist = res['data']['row'];
      });
  }
  goBack(): void {
    this.router.navigate(['pages/goods/personalityclass']);
  }
  // 导入状态提示
  closeimportip() {
    this.importtip = false;
  }
  delgoods(commodity) {
    this.modalService.confirm({
      nzTitle: '温馨提示',
      nzContent: '你确定要删除该商品吗？',
      nzOnOk: () => {
        let opt = {
        activity_id: this.classparams.activity_id,
        item_code: commodity.item_code,
        barcode: commodity.barcode,
        type: 'del'
      };
      this.http.removeactivityitem.request(opt)
        .subscribe(res => {
          this.notification.create('success', '温馨提示', res['msg']);
          this.getnocategory();
        });
      }
    });
  }
  removegoods(commodity) {
    this.modalService.confirm({
      nzTitle: '温馨提示',
      nzContent: '你确认要移出该商品吗？移出后可在待分类商品中查看',
      nzOnOk: () => {
        let opt = {
          activity_id: this.classparams.activity_id,
          item_code: commodity.item_code,
          barcode: commodity.barcode,
          type: 'edit'
        };
        this.http.removeactivityitem.request(opt)
          .subscribe(res => {
            this.notification.create('success', '温馨提示', res['msg']);
            this.getactivityitems(this.codeparam, this.levparam, true);
          });
      }
    });
  }
  editgoodsfun(commodity) {
    this.editgoods = JSON.parse(JSON.stringify(commodity));
    // this.editgoods.parent = this.selectlev.parent;
    if (this.selectlev !== 0) {
      this.editgoods.parent = this.selectlev.parent;
    } else {
      this.editgoods.parent = commodity.code;
    }
    // this.getlever2(this.editgoods.parent);
    const params: any = {
      activity_id: this.classparams.activity_id,
      parent: this.editgoods.parent,
      status: '1'
    };
    this.http.getactivitycategorys.request(params)
      .subscribe(res => {
        this.leverlists = res['rows'];
      });
    this.modalstatus = true;  // 打开弹出框
    this.modalwidth = 520;    // 设置弹出框宽度
    this.modaltitle = '修改商品'; // 设置弹出框title
    this.confirmisshow = true;
  }
  cow1: number = 0;
  storechildparams($event) {
    const childoption = $event;
    this.addgoodstocategory.page_no = childoption.page_no;
    this.cow1 = (childoption.page_no - 1) * childoption.page_size;
    this.getactivityitems(this.codeparam, this.levparam, true);

  }
  handleokfun(key) {
    switch (key) {
      case '修改商品':
        this.handleOk();
        break;
    }
  }
  closemodal() { // 关闭弹出框时重置modalstatus默认值
    this.modalstatus = false;
  }
  handleOk = () => {
    const opt = {
      activity_id: this.editgoods.activity_id,
      item_code: this.editgoods.item_code,
      barcode: this.editgoods.barcode,
      code: '', // 有二级分类编码就传二级 无二级传一级code
      name: ''
    };
    if (this.leverlists.length === 0) {
      opt.code = this.editgoods.parent;
      opt.name = this.editgoods.parentNmae;
    } else {
      opt.code = this.editgoods.code;
      opt.name = this.editgoods.name;
    }
    if (opt.code) {
      if (this.editgoods.code === '' && this.leverlists.length > 0) {
        this.notification.create('error', '温馨提示', '请选择一个二级分类');
      } else {
        this.http.editactivityitem.request(opt)
          .subscribe(res => {
            this.notification.create('success', '温馨提示', res['msg']);
            if (res['code'] == 0) {
              this.isVisible = false;
              this.getactivityitems(this.codeparam, this.selectlev, this.check);
            }
          });
      }
    } else {
      this.notification.create('error', '温馨提示', '请选择活动分类');
    }
    // if (this.editgoods.code) {
    //   this.personalityclassdetailService.editgoodsfun(this.editgoods)
    //   .then(res => {
    //     alert(res.msg);
    //     if (res.code == 0){
    //       this.isVisible = false;
    //     }
    //   });
    // }else {
    //   alert('请选择活动分类');
    // }
  }
  showModal = () => {
    this.isVisible = true;
  }
  handleCancel = (e) => {
    this.isVisible = false;
  }
  startchange(event) {
    this._startDate = event;
    this.newactivity.online_time = GMTToStr(event) + ' 00:00:00';
  }
  endchange(event) {
    this._endDate = event;
    this.newactivity.offline_time = GMTToStr(event) + ' 23:59:59';
  }

  // 获取门店列表

  stores: any;
  allstores: any;
  // 获取门店列表
  getStorelist() {
    this.http.getownregion.request()
      .subscribe(res => {
        this.stores = res['data'].stores;
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
  userstores: any = '';
  usarr: any = [];
  // 选择的门店集合
  searchcodeagain($event) {
    this.newactivity.stores = [];
    this.usarr = [];
    for (let i = 0; i < $event.length; i++) {
      const xzstore = {
        region_code: '',
        region_name: ''
      };
      xzstore.region_code = $event[i].region_code;
      xzstore.region_name = $event[i].region_name;
      this.newactivity.stores.push(xzstore);
      this.usarr.push($event[i].region_code);
    }
    this.userstores = this.usarr.join(',');
  }

  // 导出分类
  addexport_class() {
    let exportname = '';
    let parame = {
      'path': '/bsp/bspmddata/special/getcategory',
      'ent_id': this.userentid,
      'search': {
        'activity_id': this.newlist.activity_id
      },
      'desc': exportname + '门店个性分类',
      'export_columns': [
        { 'name': '编码', 'key': 'code' },
        { 'name': '名称', 'key': 'name' },
        { 'name': '父级编码', 'key': 'parent' },
        { 'name': '父级名称', 'key': 'parentName' },
        { 'name': '状态', 'key': 'status' },
      ]
    };
    // parame.search = this.itemRegion.search;
    this.http.addexport.request(parame)
      .subscribe(row => {

        if (row) {
          this.notification.create('success', '温馨提示', row['msg']);
        } else {
          this.notification.create('error', '温馨提示', '添加失败,请重试！');
        }

      });
  }
  addexport_goods() {
    let exportname = '';
    let parame = {
      'path': '/bsp/bspmddata/special/getitems',
      'ent_id': this.userentid,
      'search': {
        'activity_id': this.newlist.activity_id
      },
      'desc': exportname + '门店个性分类商品',
      'export_columns': [
        { 'name': '商品编码', 'key': 'item_code' },
        { 'name': '商品条码', 'key': 'barcode' },
        { 'name': '商品名称', 'key': 'item_name' },
        { 'name': '分类编码', 'key': 'code' },
        { 'name': '分类名称', 'key': 'name' },
      ]
    };
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








