import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BaseParams } from 'src/app/utils/base.list.params';
import { HttpService } from 'src/app/http/http.service';
import { Authbts, Whetherdisplay, GMTToStr } from 'src/app/validates/validates';
import { UploadResult } from 'src/app/sharecomponets/upload/upload.component';
import { A11yModule } from '@angular/cdk/a11y';
import { NzNotificationService, NzModalRef, NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'app-region-goods',
  templateUrl: './regiongoods.component.html',
  styleUrls: ['../prowhitelist/prowhitelist.less', './regiongoods.component.less']
})
export class RegiongoodsComponent implements OnInit {
  parem: BaseParams = {
    search: {},
    page_size: 50,
    page_no: 1,
    sort: 'timestamp',
    sortDirKey: 'DESC'
  };
  public firstCategories;

  public queryList = new Array();
  private returnObj = new Array();
  public itemRegions = new Array();
  pm_zsdgg: any[] = [];
  pm_dggarr: any[] = [];
  pm_k = 0;
  zk = true;
  public pageSize =
    {
      totalPage: 0,
      count: 0
    };

  public searchStart = false; // 进行是否查询判断
  public plszjyqd = true; // 批量设置经营渠道
  public xzmbbt = true;  // 下载模板
  public dcdcsvwj = true; // 导出到CSV文件
  public smbt = true;
  public tsbt = true;
  public sjbt = true;
  public xjbt = true;
  public new_results: any;
  public checkAllGoods = false;   // 全选所有商品
  public checkCurrentList = false;   // 全选所有商品

  public checkNum = 0;   // 全选所有商品
  public saveUploadResult = {
    fileName: "",
    key: "",
    localUrl: "",
    remoteUrl: "",

  }; // 文件上传成功后的回调
  mdspkcdr = true;
  mdspztdr = true;
  mdjyqddr = true;
  mdplumdr = true;
  cxspdr = true;
  jhbt = true;
  spxqbt = true;
  szjyqdbt = true;
  ckmdrzbt = true;
  ckkcrzbt = true;
  ckqdjhrzbt = true;
  zmkcbt = true;
  kcjgxgbt = true;
  jkcbt = true;
  tkcbt = true;
  jjgbt = true;
  tjgbt = true;
  userentid: any;
  usercode: any;
  userrights: any;
  alone_vip_price: any;
  btns: any;
  usetype: any;

  // public channelslogsmodel = false;
  public priceinv = [];// 库存价格修改数据
  public inventorychangelogs: any; //  库存日志记录
  public channelslogs: any; // 渠道日志记录
  public headpro: any; // 稽核的时候用的item
  public auditinglists: any; //  稽核的时候用的列表
  public errortip: any; //  稽核错误时候用的列表
  public results: any;
  public importtip: any;


  public storelist: any; // 门店列表
  public initStorelist: any;
  public channels: any;
  public initchannels: any;
  public importstoresopt: any = { // 选择的门店信息
    type: 2,
    stores: []
  };
  // 导入时候存放的门店列表
  public regionchannel: any; // 门店渠道列表
  public initregionchannel: any;

  public itemregionlogs: any; // 商品日志

  @ViewChild("template") template: TemplateRef<{}>;



  constructor(private modalService: NzModalService, private http: HttpService, private notification: NzNotificationService) {
    this.notification.config({
      nzPlacement: 'topRight'
    });
  }
  ngOnInit() {
    let localuser = window.localStorage.getItem('userinfo');

    if (localuser) {
      this.userrights = JSON.parse(localuser);
      this.usetype = this.userrights['usertype'];
    }

    this.btns = Authbts('商品管理', '门店商品');
    this.plszjyqd = Whetherdisplay(this.btns, '批量设置经营渠道');
    this.mdspkcdr = Whetherdisplay(this.btns, '门店商品价格库存导入');
    this.mdspztdr = Whetherdisplay(this.btns, '门店商品状态导入');
    this.mdjyqddr = Whetherdisplay(this.btns, '门店经营渠道导入');
    this.mdplumdr = Whetherdisplay(this.btns, '门店PLU码导入');
    this.cxspdr = Whetherdisplay(this.btns, '促销商品导入');
    this.xzmbbt = Whetherdisplay(this.btns, '下载模板');
    this.dcdcsvwj = Whetherdisplay(this.btns, '导出到CSV文件');
    this.jhbt = Whetherdisplay(this.btns, '稽核');
    this.spxqbt = Whetherdisplay(this.btns, '商品详情');
    this.szjyqdbt = Whetherdisplay(this.btns, '设置经营渠道');
    this.ckmdrzbt = Whetherdisplay(this.btns, '查看门店日志');
    this.ckkcrzbt = Whetherdisplay(this.btns, '查看库存日志');
    this.zmkcbt = Whetherdisplay(this.btns, '置满库存');
    this.kcjgxgbt = Whetherdisplay(this.btns, '库存价格修改');
    this.smbt = Whetherdisplay(this.btns, '售卖');
    this.tsbt = Whetherdisplay(this.btns, '停售');
    this.sjbt = Whetherdisplay(this.btns, '上架');
    this.xjbt = Whetherdisplay(this.btns, '下架');
    this.jkcbt = Whetherdisplay(this.btns, '接库存');
    this.tkcbt = Whetherdisplay(this.btns, '停库存');
    this.jjgbt = Whetherdisplay(this.btns, '接价格');
    this.tjgbt = Whetherdisplay(this.btns, '停价格');





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
        label: "商品名称",
        name: "item_name",
        value: '',
      },
      {
        show: true,
        type: "input",
        label: "商品条码",
        name: "barcode",
        value: ''
      },
      {
        show: true,
        type: "select",
        label: "门店",
        name: "region_code",
        search: true,
        list: this.getSelection('region_code')
      },
      {
        show: false,
        type: "input",
        label: "商品编码",
        name: "item_code",
        value: ''
      },
      {
        show: false,
        type: "select",
        label: "售卖状态",
        name: "status",
        code: "1",
        list: [
          {
            name: "售卖",
            code: "1"
          },
          {
            name: "停售",
            code: "-1"
          },
        ],
      },
      {
        show: false,
        type: "select",
        label: "上下架",
        name: "sale_status",
        list: [
          {
            name: "上架",
            code: "1"
          },
          {
            name: "下架",
            code: "2"
          },
        ],
      },
      {
        show: false,
        type: "select",
        label: "线下库存",
        name: "receive_stock",
        list: [
          {
            name: "接收",
            code: "1"
          },
          {
            name: "不接收",
            code: "-1"
          },
        ],
      },
      {
        show: false,
        type: "select",
        label: "线下价格",
        name: "receive_price",
        list: [
          {
            name: "接收",
            code: "1"
          },
          {
            name: "不接收",
            code: "-1"
          },
        ],
      },

      {
        show: false,
        type: "double-select",
        label: "线上品类",
        name1: "online_sup_code",
        name2: "online_cat_code",
        list1: this.getSelection('online_sup_code'),
        list2: []
      },
      {
        show: false,
        type: "select-check",
        label: "经营渠道",
        label2: "未配置",
        name1: "channel_keyword",
        name2: "un_channel_keyword",
        list1: this.getSelection('channel_keyword'),
        code2: false
      },
      {
        show: false,
        type: "select-check",
        label: "已上线渠道",
        label2: "未上线",
        name1: "online_channel",
        name2: "un_online_channel",
        list1: this.getSelection('online_channel'),
        code2: false
      },
      {
        show: false,
        type: "double-input",
        label: "价格范围",
        name1: "start_money",
        name2: "end_money",
        value1: "",
        value2: ""
      },
      {
        show: false,
        type: "select",
        label: "活动渠道",
        name: "onlinechannel",
        list: this.getSelection('onlinechannel')
      },
      {
        show: false,
        type: "date-picker",
        label: "选择时间",
        name1: "start_time",
        name2: "end_time",
        value1: "",
        value2: ""
      },
      {
        show: false,
        type: "checkbox",
        label: "手工下架",
        name: "manual_onoffline",
        code: false
      },
      {
        show: false,
        type: "checkbox",
        label: "手工停售",
        name: "status_time",
        code: false
      },
      {
        show: false,
        type: "checkbox",
        label: "多规格商品",
        name: "is_spec",
        code: false
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
                  if (index === 0) {
                    item.code = item1.code;
                  }
                  let obj = {
                    code: item1.code,
                    name: item1.codename
                  };
                  return obj;
                });
              }
            });
            this.searchStart = true;

          });
        break;
      case 'online_sup_code':
        this.http.getFirstOnlineCategories.request({ "parent": 0 })
          .subscribe((data) => {
            console.log(data);
            this.queryList.forEach((item) => {
              if (item.name1 === name) {
                // item.list = data;
                item.list1 = JSON.parse(JSON.stringify(data)).map((item1) => {
                  let obj = {
                    code: item1.code,
                    name: item1.name
                  };
                  return obj;
                });
              }
            });
          });
        break;
      case 'online_cat_code':
        this.http.getFirstOnlineCategories.request({ "parent": parentCode })
          .subscribe((data) => {
            console.log(data);
            this.queryList.forEach((item) => {
              if (item.name2 === name) {
                // item.list = data;
                item.list2 = JSON.parse(JSON.stringify(data)).map((item1) => {
                  let obj = {
                    code: item1.code,
                    name: item1.name
                  };
                  return obj;
                });
              }

            });
          });
        break;
      case 'channel_keyword':
        this.http.getChannels.request({})
          .subscribe((data) => {
            this.channels = data['rows'];
            this.initchannels = JSON.parse(JSON.stringify(data['rows']));

            this.queryList.forEach((item) => {
              if (item.name1 === 'channel_keyword') {
                item.list1 = data['rows'].map((item1) => {

                  let obj = {
                    code1: item1.channel_keyword,
                    name: item1.name
                  };
                  return obj;
                });
              }
            });
          });
        break;
      case 'online_channel':
        this.http.getChannels.request({})
          .subscribe((data) => {
            this.queryList.forEach((item) => {
              if (item.name1 === 'online_channel') {
                item.list1 = data['rows'].map((item1) => {
                  let obj = {
                    code1: item1.channel_keyword,
                    name: item1.name
                  };
                  return obj;
                });
              }
            });
          });
        break;
      case 'onlinechannel':
        this.http.getChannels.request({})
          .subscribe((data) => {

            this.queryList.forEach((item) => {
              if (item.name === 'onlinechannel') {
                item.list = data['rows'].map((item1) => {
                  let obj = {
                    code: item1.channel_keyword,
                    name: item1.name
                  };
                  return obj;
                });
              }
            });
          });
        break;

    }

  }

  // 获取所有查询条件
  search($event) {
    console.log($event);
    if (this.searchStart) {
      this.parem.search = $event;
      this.getItemRegions();
    }
  }

  // 获取列表
  getItemRegions() {
    console.log(this.parem);
    this.http.getitemregions.request(this.parem)
      .subscribe((data) => {
        if (data['code'] == '010001000') {
          data = data['data'];
          this.itemRegions = data['rows'];
          this.pageSize.count = data['count'];
        } else {
          this.notification.create('error', '温馨提示', data['msg'])
        }
      });
  }

  // 接收翻页操作传过来的值，然后请求服务得到新数据
  childparams($event) {
    const childoption = $event;
    this.parem.page_no = childoption.page_no;
    this.getItemRegions();

  }

  // 点击列表上的复选框触发的方法
  setcheckbox(event) {
    if (event) {
      this.checkNum += 1;
    } else {
      this.checkNum -= 1;
    }
  }

  // 选择所有门店
  setimportallstore(event) {
    event.nzIndeterminate = false;
    if (event.nzChecked) {
      this.storelist.forEach(item => item.sfxz = true);
    } else {
      this.storelist.forEach(item => item.sfxz = false);
    }
  }

  // 地下点击获取
  checkList(event) {
    if (this.storelist.every(item => item.sfxz === true)) {
      event.nzIndeterminate = false;
      event.nzChecked = true;
    } else if (this.storelist.every(item => item.sfxz === false)) {
      event.nzIndeterminate = false;
      event.nzChecked = false;
    } else {
      event.nzIndeterminate = true;
    }
  }

  showRegionpricedrModel(showModal) {
    this.storelist = JSON.parse(JSON.stringify(this.initStorelist));
    this.modalService.create({
      nzTitle: '门店商品价格库存导入',
      nzWidth: '650px',
      nzContent: showModal,
      nzOnOk: () => { this.saveRegionprice(); }
    });
  }
  // 保存门店商品价格导入
  saveRegionprice() {
    this.importstoresopt.stores = [];
    this.storelist.forEach((item) => {
      if (item.sfxz === true) {
        let obj = {
          code: item.code,
          sfxz: true
        };
        this.importstoresopt.stores.push(obj);
      }
    });
    if (this.importstoresopt.stores.length === this.storelist.length) {
      this.importstoresopt.type = 1;
    } else {
      this.importstoresopt.type = 2;
    }
    let sucopt = {
      filename: this.saveUploadResult['fileName'],
      storesobj: this.importstoresopt,
      key: this.saveUploadResult['key'],
      local_url: this.saveUploadResult['localUrl'],
      remote_url: this.saveUploadResult['remoteUrl']
    };
    this.http.regionPriceStock.request(sucopt)
      .subscribe(res => {
        if (res['code'] === '010001000') {
          res = res['data'];
          let opt = res['details'].concat(res['regionResult']);
          res['details'] = opt;
          delete res['regionResult'];
          this.new_results = sucopt;
          this.createBasicNotification(this.template);
          this.modalService.closeAll();
        } else {
          this.notification.create('error', '温馨提示', res['msg']);
        }
      });
  }
  //  保存门店商品价格导入
  showRegionStatedrModel(showModal) {
    this.storelist = JSON.parse(JSON.stringify(this.initStorelist));
    this.modalService.create({
      nzTitle: '门店商品状态导入',
      nzWidth: '650px',
      nzContent: showModal,
      nzOnOk: () => { this.saveRegionState(); }
    });
  }

  saveRegionState() {
    this.importstoresopt.stores = [];
    this.storelist.forEach((item) => {
      if (item.sfxz === true) {
        let obj = {
          code: item.code,
          sfxz: true
        };
        this.importstoresopt.stores.push(obj);
      }
    });
    if (this.importstoresopt.stores.length === this.storelist.length) {
      this.importstoresopt.type = 1;
    } else {
      this.importstoresopt.type = 2;
    }
    console.log(this.importstoresopt);
    let sucopt = {
      filename: this.saveUploadResult['fileName'],
      storesobj: this.importstoresopt,
      key: this.saveUploadResult['key'],
      local_url: this.saveUploadResult['localUrl'],
      remote_url: this.saveUploadResult['remoteUrl']
    };
    this.http.goodStatus.request(sucopt)
      .subscribe(res => {
        if (res['code'] === '010001000') {
          res = res['data'];
          let opt = res['details'].concat(res['regionResult']);
          res['details'] = opt;
          delete res['regionResult'];
          this.new_results = res;
          this.createBasicNotification(this.template);
          this.modalService.closeAll();
        } else {
          this.notification.create('error', '温馨提示', res['msg'])
        }


      });
    console.log(sucopt);
  }

  // 保存门店经营渠道
  showStorechannelModel(showModal) {
    this.storelist = JSON.parse(JSON.stringify(this.initStorelist));
    this.modalService.create({
      nzTitle: '门店经营渠道导入',
      nzWidth: '850px',
      nzContent: showModal,
      nzOnOk: () => { this.saveRegionchannel(); }
    });
  }

  saveRegionchannel() {
    this.importstoresopt.stores = [];
    this.storelist.forEach((item) => {
      if (item.sfxz === true) {
        let obj = {
          code: item.code,
          sfxz: true
        };
        this.importstoresopt.stores.push(obj);
      }
    });
    if (this.importstoresopt.stores.length === this.storelist.length) {
      this.importstoresopt.type = 1;
    } else {
      this.importstoresopt.type = 2;
    }
    let saveObject = {
      channel: this.regionchannel,
      filename: this.saveUploadResult['fileName'],
      storesobj: this.importstoresopt,
      key: this.saveUploadResult['key'],
      local_url: this.saveUploadResult['localUrl'],
      remote_url: this.saveUploadResult['remoteUrl']
    };
    console.log(saveObject);
    this.http.onlineChannelInput.request(saveObject)
      .subscribe(res => {
        if (res['code'] === '010001000') {
          res = res['data'];
          let opt = res['details'].concat(res['regionResult']);
          res['details'] = opt;
          delete res['regionResult'];
          this.new_results = res;
          this.createBasicNotification(this.template);
          this.modalService.closeAll();
        } else {
          this.notification.create('error', '温馨提示', res['msg'])
        }

      });
  }
  // 保存会员价导入
  showMemberPriceModel(showModal) {
    this.storelist = JSON.parse(JSON.stringify(this.initStorelist));
    this.modalService.create({
      nzTitle: '会员价导入',
      nzWidth: '650px',
      nzContent: showModal,
      nzOnOk: () => { this.saveMemberPrice(); }
    });
  }

  saveMemberPrice() {
    this.importstoresopt.stores = [];
    this.storelist.forEach((item) => {
      if (item.sfxz === true) {
        let obj = {
          code: item.code,
          sfxz: true
        };
        this.importstoresopt.stores.push(obj);
      }
    });
    if (this.importstoresopt.stores.length === this.storelist.length) {
      this.importstoresopt.type = 1;
    } else {
      this.importstoresopt.type = 2;
    }
    console.log(this.importstoresopt);
    let sucopt = {
      filename: this.saveUploadResult['fileName'],
      storesobj: this.importstoresopt,
      key: this.saveUploadResult['key'],
      local_url: this.saveUploadResult['localUrl'],
      remote_url: this.saveUploadResult['remoteUrl']
    };
    console.log(sucopt);
    this.http.importVipPrice.request(sucopt)
      .subscribe(res => {
        if (res['code'] === '010001000') {
          res = res['data'];
          let opt = res['details'].concat(res['regionResult']);
          res['details'] = opt;
          delete res['regionResult'];
          this.new_results = res;
          this.createBasicNotification(this.template);
          this.modalService.closeAll();
        } else {
          this.notification.create('error', '温馨提示', res['msg'])
        }

      });

  }
  // 门店PLU码导入
  autoUploadedPlu(result) {
    console.log("门店PLU码导入");
    let sucopt = {
      fileName: result.fileName,
      // channel: '',
      // storesobj: '',
      key: result.key,
      localUrl: result.localUrl,
      remoteUrl: result.remoteUrl,
    };
    this.http.regionPluCode.request(sucopt)
      .subscribe(res => {
        if (res['code'] === '010001000') {
          res = res['data'];
          let opt = res['details'].concat(res['regionResult']);
          res['details'] = opt;
          delete res['regionResult'];
          this.new_results = res;
          this.createBasicNotification(this.template);
          this.modalService.closeAll();
        } else {
          this.notification.create('error', '温馨提示', res['msg'])
        }

      });
    console.log(this.saveUploadResult);
  }

  autoUploadedCx(result) {
    console.log("促销商品导入");
    let sucopt = {
      fileName: result.fileName,
      // channel: '',
      // storesobj: '',
      key: result.key,
      localUrl: result.localUrl,
      remoteUrl: result.remoteUrl,
    };
    this.http.itemBaseCxInput.request(sucopt)
      .subscribe(res => {
        if (res['code'] === '010001000') {
          res = res['data'];
          let opt = res['details'].concat(res['regionResult']);
          res['details'] = opt;
          delete res['regionResult'];
          this.new_results = res;
          this.createBasicNotification(this.template);
          this.modalService.closeAll();
        } else {
          this.notification.create('error', '温馨提示', res['msg'])
        }

      });
    console.log(this.saveUploadResult);
  }


  // 批量设置经营渠道
  setallchannel(channelsAllmodelContent) {
    this.http.getRegionchannel.request(this.parem.search.region_code)
      .subscribe((data) => {
        this.regionchannel = data['data']['rows'];
        console.log(data);
      });
    if (this.checkNum > 0) {
      let modal: NzModalRef = this.modalService.create({
        nzTitle: '批量设置经营渠道',
        nzContent: channelsAllmodelContent,
        nzFooter: [
          {
            label: "上线",
            onClick: () => { this.determine3(1); }
          },
          {
            label: "下线",
            onClick: () => { this.determine3(2); }
          },
        ]
      });
    } else {
      this.notification.create('error', '温馨提示', '请选择多条或全部商品进行批量设置渠道!');
    }

  }

  determine3(theway) {
    let alljyqds = this.regionchannel.filter(item => item.sfxz === true);
    console.log(alljyqds);
    if (alljyqds.length === 0) {
      this.notification.create('error', '温馨提示', '请选择要设置的渠道!');
    } else {
      this.modalService.confirm({
        nzTitle: '温馨提示',
        nzContent: '你确定操作吗？',
        nzOnOk: () => {
          this.batchChannel(alljyqds, theway);
        }
      });
    }
  }

  batchChannel(alljyqds, theway) {
    let postObj = {
      itemRegion: this.checkAllGoods ? this.parem : this.itemRegions,
      allselected: this.checkAllGoods ? 1 : 0,
      alljyqds: alljyqds,
      theway: theway,
    };
    this.http.batchAllChannel.request(postObj)
      .subscribe(res => {
        if (res['code'] === '010001000') {

          // this.channelsAllmodel = false;
          this.modalService.closeAll();
          this.checkAllGoods = false;
          this.checkCurrentList = false;
          this.checkNum = 0;
          this.getItemRegions();

        } else {
          this.notification.create('error', '温馨提示', res['msg']);
        }
      });
  }



  addexport() {
    let exportname: any, item_name: any, item_code: any, barcode: any, region_code: any, status: any, online_sup_code: any, online_cat_cod: any, online_channel: any, sale_status: any;
    if (this.parem.search.item_name) { item_name = this.parem.search.item_name + '-'; } else { item_name = ''; }
    if (this.parem.search.item_code) { item_code = this.parem.search.item_code + '-'; } else { item_code = ''; }
    if (this.parem.search.barcode) { barcode = this.parem.search.barcode + '-'; } else { barcode = ''; }
    if (this.parem.search.status === '1') { status = '售卖' + '-'; } else if (this.parem.search.status === '-1') { status = '停售' + '-'; } else { status = ''; }
    if (this.parem.search.sale_status === '1') { sale_status = '上架' + '-'; } else if (this.parem.search.sale_status === '2') { sale_status = '下架' + '-'; } else { sale_status = ''; }
    if (this.parem.search.region_code) { region_code = this.parem.search.region_code + '-'; } else { region_code = ''; }
    if (this.parem.search.online_sup_code) { online_sup_code = this.parem.search.online_sup_code + '-'; } else { online_sup_code = ''; }
    if (this.parem.search.online_cat_cod) { online_cat_cod = this.parem.search.online_cat_cod + '-'; } else { online_cat_cod = ''; }
    if (this.parem.search.online_channel) { online_channel = this.parem.search.online_channel + '-'; } else { online_channel = ''; }
    exportname = region_code + status + sale_status + online_sup_code + online_cat_cod + online_channel;
    let parame = {
      'path': '/test-export-bsp/itemregion/getitemregions',
      'search': {
        'region_code': '',
      },
      'desc': exportname + '门店商品',
      'sort': 'code',
      'sortDirKey': 'DESC',
      'export_columns': [
        { 'name': '门店编码', 'key': 'region_code' },
        { 'name': '门店名称', 'key': 'region_name' },
        { 'name': '商品编码', 'key': 'item_code' },
        { 'name': '商品条码', 'key': 'barcode' },
        { 'name': '商品名称', 'key': 'item_name' },
        { 'name': '线上规格', 'key': 'm_spec' },
        { 'name': '线下规格', 'key': 'spec' },
        { 'name': '市场价', 'key': 'reference_price' },
        { 'name': '销售价', 'key': 'sale_price' },
        { 'name': '线下价', 'key': 'erp_price' },
        { 'name': '可用库存', 'key': 'available_qty' },
        { 'name': '线下库存', 'key': 'erq_qty' },
        { 'name': '线上类别', 'key': 'online_cat_name' },
        { 'name': '售卖状态', 'key': 'status1' },
        { 'name': '上下架', 'key': 'sale_status1' },
        { 'name': '手工下架', 'key': 'manual_onoffline' },
        { 'name': '手工下架时间', 'key': 'manual_date' },
        { 'name': '手工下架操作人', 'key': 'oper_user' },
        { 'name': '是否接收线下价格', 'key': 'receive_price1' },
        { 'name': '是否接收线下库存', 'key': 'receive_stock1' },
        { 'name': '是否有图片', 'key': 'img_url' },
        { 'name': '百度外卖', 'key': 'bdwm_out_key' },
        { 'name': '美团外卖', 'key': 'mtwm_out_key' },
        { 'name': '京东到家', 'key': 'jddj_out_key' },
        { 'name': '饿了么', 'key': 'elem_out_key' },
        { 'name': 'PLU码', 'key': 'plu_code' }

      ],
      'ent_id': this.userentid,
      'code': this.usercode

    };
    parame.search = this.parem.search;
    this.http.addexport.request(parame)
      .subscribe(data => {
        if (data) {
          this.notification.create('success', '温馨提示', data['msg']);
        } else {
          this.notification.create('error', '温馨提示', '添加失败,请重试！');
        }
      });
  }

  editstatus1(item, type) {
    if (this.usetype !== '3') {
      this.modalService.confirm({
        nzTitle: '温馨提示',
        nzContent: '确定更改商品状态？',
        nzOnOk: () => {
          if (type === 1) {
            if (String(item.status) === '1') {
              item.status = '-1';
            } else {
              item.status = '1';
            }
            this.setstatus(item, 1);
          } else if (type === 2) {
            if (String(item.sale_status) === '1') {
              item.sale_status = '2';
            } else {
              item.sale_status = '1';
            }
            this.setstatus(item, 2);
          } else if (type === 3) {
            if (item.testwh === '1') {
              if (item.receive_stock === '1') {
                item.receive_stock = '-1';
              } else {
                this.notification.create('error', '温馨提示', '牵牛花维护商品，此状态无法更改！');
              }
            } else {
              if (item.receive_stock === '1') {
                item.receive_stock = '-1';
              } else {
                item.receive_stock = '1';
              }
              this.setstatus(item, 3);
            }
          } else if (type === 4) {
            if (item.testwh === '1') {
              if (item.receive_price === '1') {
                item.receive_price = '-1';
              } else {
                this.notification.create('error', '温馨提示', '牵牛花维护商品，此状态无法更改！');
              }
            } else {
              if (item.receive_price === '1') {
                item.receive_price = '-1';
              } else {
                item.receive_price = '1';
              }
              this.setstatus(item, 4);
            }

          }
        }
      });

    } else {
      if (type === 3) {
        if (item.testwh === '1') {
          this.notification.create('error', '温馨提示', '牵牛花维护商品，此状态无法更改！');
        } else {
          this.modalService.confirm({
            nzTitle: '温馨提示',
            nzContent: '确定更改商品状态？',
            nzOnOk: () => {
              if (item.receive_stock === '1') {
                item.receive_stock = '-1';
              } else {
                item.receive_stock = '1';
              }
              this.setstatus(item, 3);
            }
          });
        }
      } else if (type === 4) {
        if (item.testwh === '1') {
          this.notification.create('error', '温馨提示', '牵牛花维护商品，此状态无法更改！');
        } else {
          this.modalService.confirm({
            nzTitle: '温馨提示',
            nzContent: '确定更改商品状态？',
            nzOnOk: () => {
              if (item.receive_price === '1') {
                item.receive_price = '-1';
              } else {
                item.receive_price = '1';
              }
              this.setstatus(item, 4);
            }
          });
        }

      } else {
        if (item.must_sale) {
          this.notification.create('error', '温馨提示', '必卖商品门店管理员无权限更改此状态！');
        } else {
          if (type === 1) {
            this.modalService.confirm({
              nzTitle: '温馨提示',
              nzContent: '确定更改商品状态？',
              nzOnOk: () => {
                if (String(item.status) === '1') {
                  item.status = '-1';
                } else {
                  item.status = '1';
                }
                this.setstatus(item, 1);
              }
            });
          } else if (type === 2) {
            this.modalService.confirm({
              nzTitle: '温馨提示',
              nzContent: '确定更改商品状态？',
              nzOnOk: () => {
                if (String(item.sale_status) === '1') {
                  item.sale_status = '2';
                } else {
                  item.sale_status = '1';
                }
                this.setstatus(item, 2);
              }
            });
          }
        }
      }
    }
  }

  setstatus(item, i) {
    if (i === 1) {
      this.http.setstatus1.request(item)
        .subscribe(tip => {
          this.notification.create('success', '温馨提示', tip['msg']);
          this.getItemRegions();
        });
    } else if (i === 2) {
      this.http.setstatus2.request(item)
        .subscribe(tip => {
          this.notification.create('success', '温馨提示', tip['msg']);
          this.getItemRegions();
        });
    } else if (i === 3) {
      this.http.setstatus3.request(item)
        .subscribe(tip => {
          this.notification.create('success', '温馨提示', tip['msg']);
          this.getItemRegions();
        });
    } else {
      this.http.setstatus4.request(item)
        .subscribe(tip => {
          this.notification.create('success', '温馨提示', tip['msg']);
          this.getItemRegions();
        });
    }
  }

  // 选择全部商品
  checkAll() {
    this.checkCurrentList = false;
    if (this.checkAllGoods) {
      this.itemRegions.forEach(item => item.sfxz = true);
      this.checkNum = this.pageSize.count;
    } else {
      this.itemRegions.forEach(item => item.sfxz = false);
      this.checkNum = 0;
    }
  }


  // 选择全部商品
  checkCur() {
    this.checkAllGoods = false;
    if (this.checkCurrentList) {
      this.itemRegions.forEach(item => item.sfxz = true);
      this.checkNum = this.itemRegions.length;
    } else {
      this.itemRegions.forEach(item => item.sfxz = false);
      this.checkNum = 0;
    }
  }

  uploaded = (result: UploadResult) => {
    this.saveUploadResult = {
      fileName: result.fileName,
      key: result.key,
      localUrl: result.localUrl,
      remoteUrl: result.remoteUrl,
    };
    this.saveUploadResult = JSON.parse(JSON.stringify(result));
  }

  // 对当前项进行稽核
  getauditing(item, showModal) {
    this.headpro = item;
    let optitem = {
      ent_id: item.ent_id,
      region_code: item.region_code,
      item_code: item.item_code,
      barcode: item.barcode
    };
    this.auditinglists = [];
    this.errortip = false;
    this.http.findItemInfos.request(optitem)
      .subscribe(data => {
        if (data['result'] === 1) {
          this.errortip = data['data']['data'];
        } else {
          this.auditinglists = data['data'];
        }
      });
    this.modalService.create({
      nzTitle: '门店商品价格库存导入',
      nzContent: showModal,
      nzOkText: null,
    });
  }
  // 查看商品详情
  prodetails(item, showModal) {
    this.headpro = item;
    this.modalService.create({
      nzTitle: '商品详情',
      nzWidth: '600px',
      nzContent: showModal,
      nzOkText: null,
    });
  }
  // 设置经营渠道
  setchannel(item, showModal) {
    this.headpro = item;
    this.channels = JSON.parse(JSON.stringify(this.initchannels));
    this.modalService.create({
      nzTitle: '商品详情',
      nzContent: showModal,
      nzOnOk: () => { this.determine(); }
    });
  }


  // 设置单个设置渠道
  determine() {
    let paramsobj = { jyqdsarr: this.channels, itemobj: this.headpro };
    this.http.updateChannel.request(paramsobj)
      .subscribe(data => {
        this.notification.create('success', '温馨提示', data['msg']);
        if (data['code'] === '010001000') {
          this.modalService.closeAll();
          this.getItemRegions();
        }
      });
  }
  // 查看门店日志
  getitemregionlogs(item, showModal) {
    this.http.regionlogs.request(item)
      .subscribe(itemregionlogs => {
        if (itemregionlogs['code'] === '010001000') {
          this.itemregionlogs = itemregionlogs['data']['logs'];
          this.modalService.create({
            nzTitle: '查看门店日志',
            nzWidth: '75%',
            nzContent: showModal,
            nzOkText: null
          });
        } else {
          this.notification.create('error', '温馨提示', itemregionlogs['msg']);
        }
      });
  }
  //  库存变化日志
  inventorychangelog(item: any, showModal) {
    this.http.inventorychangelog.request(item)
      .subscribe(inventorychangelog => {
        if (inventorychangelog['code'] == '010001000') {
          this.inventorychangelogs = inventorychangelog['data']['logs'];
          // this.inventorychangelogsmodel = true;
          this.modalService.create({
            nzTitle: '库存变化日志',
            nzWidth: '75%',
            nzContent: showModal,
            nzOkText: null
          });
        } else {
          this.notification.create('error', '温馨提示', inventorychangelog['msg']);
        }
      });

  }

  getchannellogsinfos(item, showModal) {
    console.log(item);
    this.headpro = item;
    let channel_keyword = '';
    this.initchannels.forEach(item1 => {
      item.onlinechannel.forEach(item2 => {
        if (item1.name === item2) {
          item1.checked = true;
          channel_keyword = item1.channel_keyword;
        }
      });
    });
    console.log(this.initchannels);
    let params = {
      'barcode': item.barcode,
      'item_code': item.item_code,
      'region_code': item.region_code,
      'channel_keyword': channel_keyword,
      'ent_id': item.ent_id
    };
    console.log(params);
    this.http.getchannellogs.request(params)
      .subscribe(res => {
        if (res['code'] == '010001000') {
          this.channelslogs = res['data'];
        } else {
          this.notification.create('error', '温馨提示', res['msg'])
        }

      });
    this.modalService.create({
      nzTitle: '渠道日志',
      nzContent: showModal,
      nzOkText: null
    });
  }

  getchannellogs1(item) {
    let channel_key = item.channel_keyword;
    let params = {
      'barcode': this.headpro.barcode,
      'item_code': this.headpro.item_code,
      'region_code': this.headpro.region_code,
      'channel_keyword': channel_key,
      'ent_id': this.headpro.ent_id
    };
    this.http.getItemRegionLog.request(params)
      .subscribe((res) => {

        if (res['code'] == '010001000') {
          this.channelslogs = res['data'];
        } else {
          this.channelslogs = [];
        }

      });
  }





  // 门店商品置满库存
  fillStock(item: any) {
    this.http.fillstock.request(item)
      .subscribe(tip => {
        this.notification.create('success', '温馨提示', tip['msg']);
        this.getItemRegions();
      });
  }

  // 库存价格修改-点击按钮打开弹出框触发的方法
  editkcjg(item, showModal) {
    let data = {
      barcode: item.barcode,
      item_code: item.item_code,
      region_code: item.region_code
    };
    this.modalService.create({
      nzTitle: '库存价格修改',
      nzContent: showModal,
      nzWidth: '75%',
      nzOnOk: () => {
        return new Promise((resolve, reject) => {
          resolve(this.updatepriceinv(this.priceinv[0]))
        });
      }
    });
    this.http.getpriceinv.request(data)
      .subscribe(priceinv => {
        this.priceinv = [];
        this.priceinv.push(priceinv['data']);
      });
  }
  // 库存价格修改请求
  updatepriceinvAjax() {
    this.http.updateprice.request(this.priceinv[0])
      .subscribe(tip => {
        this.notification.create('success', '温馨提示', tip['msg']);
        this.getItemRegions();
      });
  }

  // 库存价格修改-点击按钮
  updatepriceinv(priceinv) {
    console.log(priceinv);
    if (priceinv.receive_stock === '1' && priceinv.receive_price === '-1') {
      if (isNaN(priceinv.sale_price)) {
        this.notification.create('error', '温馨提示', '请输入正确的价格');
        return false;
      } else if (priceinv.sale_price.valueOf() <= 0) {
        this.notification.create('error', '温馨提示', '请输入大于0的价格');
        return false;
      } else {
        this.updatepriceinvAjax();
      }

    } else if (priceinv.receive_stock === '-1' && priceinv.receive_price === '1') {
      if (isNaN(priceinv.available_qty)) {
        this.notification.create('error', '温馨提示', '请输入正确的库存');
        return false;
      } else if (parseFloat(priceinv.available_qty) < 0) {
        this.notification.create('error', '温馨提示', '库存不能小于0');
        return false;
      } else {
        this.updatepriceinvAjax();
      }
    } else {
      if (isNaN(priceinv.sale_price)) {
        this.notification.create('error', '温馨提示', '请输入正确的价格');
        return false;
      } else if (priceinv.sale_price.valueOf() <= 0) {
        this.notification.create('error', '温馨提示', '请输入大于0的价格');
        return false;
      } else if (isNaN(priceinv.available_qty)) {
        this.notification.create('error', '温馨提示', '请输入正确的库存');
        return false;
      } else if (parseFloat(priceinv.available_qty) < 0) {
        this.notification.create('error', '温馨提示', '库存不能小于0');
        return false;
      } else {
        this.updatepriceinvAjax();
      }
    }

  }
  // 商品同步
  syncprice(priceinv, i) {
    let opt = {
      region_code: priceinv.region_code,
      item_code: priceinv.item_code,
      barcode: priceinv.barcode
    };
    let opt1 = {
      region_code: priceinv.region_code,
      item_code: priceinv.item_code,
      barcode: priceinv.barcode,
      sale_price: priceinv.sale_price
    };
    if (i === 1) {
      this.http.syncOfflineItemPrice.request(opt)
        .subscribe(res => {
          this.notification.create('success', '温馨提示', res['msg']);
          if (res['code'] === '010001000') {
            priceinv.sale_price = res['data']['sale_price'];
          }
        });
    }
    if (i === 2) {
      this.http.syncOfflineItemStock.request(opt)
        .subscribe(res => {
          this.notification.create('success', '温馨提示', res['msg']);
          if (res['code'] === '010001000') {
            priceinv.available_qty = res['data']['available_qty'];
          }
        });
    }
    if (i === 3) {
      this.http.syncOfflineItemPrice.request(opt)
        .subscribe(res => {
          this.notification.create('success', '温馨提示', res['msg']);
        });
    }
    if (i === 4) {
      this.http.syncOnlineItemStock.request(opt)
        .subscribe(res => {
          this.notification.create('success', '温馨提示', res['msg']);
        });
    }
  }

  // 导入提示
  createBasicNotification(template: TemplateRef<{}>): void {
    this.notification.template(template, { nzDuration: 0 });
  }

}
