import { Component, Input, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseParams } from 'src/app/utils/base.list.params';
import { Authbts, Whetherdisplay } from 'src/app/validates/validates';
import { HttpService } from 'src/app/http/http.service';
import { UploadResult } from 'src/app/sharecomponets/upload/upload.component';
import { PageComponent } from 'src/app/theme/page/page.component';
import { deldgg, loadingimage } from 'src/app/images';
import { containsTree } from '@angular/router/src/url_tree';
import { PublicService } from 'src/app/services/public.service';
import { NzNotificationService, NzModalService } from 'ng-zorro-antd';

@Component({
  templateUrl: './basicGoods.html',
  styleUrls: ['./basicGoods.less']
})
export class BasicGoodsComponent implements OnInit {
  @ViewChild(PageComponent)
  private childpage: PageComponent;
  commodities: any;
  code: any;
  @Input()
  imgs: any = [];
  temArray: Array<String> = [];
  img: any;
  index = 0;
  count: any;
  params: BaseParams = {
    search: {
      code: '',
      name: '',
      barcode: '',
      status: '1',
      source_type_keyword: '',
      online_sup_code: '',
      online_cat_code: '',
      spec: '',
      unit: '',
      gross_weight: '',
      fl: '',
      img: '',
      testwh: '',
      base_uom_name: '',
      norm: '',
      is_spec: '' // 多规格筛选
    },
    page_size: 50,
    page_no: 1,
    sort: 'timestamp',
    sortDirKey: 'DESC'
  };
  pageSize =
    {
      totalPage: 0,
      count: 0
    };
  hidesearch = false;
  uploadTypeModal = "main";

  uploadFile: any;
  hasBaseDropZoneOver = false;

  j = 0;
  paramn = 1;
  cover = 2;
  deldggUrl = deldgg;
  userinfo: any;
  sortoptions: any;
  firstCategories: any;
  mfirstCategories: any;
  showbtns: any;
  goodsbid: any;
  // 定义按钮是否显示变量
  btns: any = [];
  smbt = true;
  tsbt = true;
  spzddr = true;
  szxsfl = true;
  spzdsmzt = true;
  dwzhxsdr = true;
  bmspdr = true;
  plscsp = true;
  pldrtp = true;
  xzmb = true;
  dccsv = true;
  dcsgxjjlb = true;
  xgbtn = true;
  kcjgxg = true;
  szmdsp = true;
  spzdrz = true;
  sole = true;
  dccydgg = true;
  localbtns: any;
  userrights: any;
  userentid: any;
  usercode: any;
  // 餐饮多规格参数
  pm_iscydgg = false;
  inputValue: string;
  loadingimgurl: string = loadingimage;
  loadingimg = false;
  results: any;
  modalwidth: number; // 弹出框宽度
  templeteobj: any; // 提示templete
  modaltitle: string; // 弹出框title
  modalstatus: boolean; // 弹出框状态
  modalconfirloading: boolean; // 弹出框提交loading
  confirmisshow: boolean; // 弹出框是否显示确认按钮
  constructor(private router: Router, private route: ActivatedRoute,
    private http: HttpService, private publicservice: PublicService, private notification: NzNotificationService, private modalService: NzModalService) {
    const localuser = window.localStorage.getItem('userinfo');
    this.userinfo = JSON.parse(localuser);
    this.sortoptions = {
      onUpdate: (event: any) => {
      }
    };
    this.notification.config({
      nzPlacement: 'topRight'
    });
  }
  ngOnInit(): void {
    const localuser = window.localStorage.getItem('userinfo');
    this.userrights = JSON.parse(localuser);

    this.userentid = this.userrights.ent_id;
    this.usercode = this.userrights.code;

    this.btns = Authbts('商品管理', '商品资料');
    this.smbt = Whetherdisplay(this.btns, '售卖');
    this.tsbt = Whetherdisplay(this.btns, '停售');
    this.spzddr = Whetherdisplay(this.btns, '商品主档(新增/修改)导入');
    this.szxsfl = Whetherdisplay(this.btns, '设置商品线上分类');
    this.spzdsmzt = Whetherdisplay(this.btns, '商品主档售卖状态');
    this.dwzhxsdr = Whetherdisplay(this.btns, '单位转换系数导入');
    this.bmspdr = Whetherdisplay(this.btns, '必卖商品导入');
    this.plscsp = Whetherdisplay(this.btns, '批量上传图片');
    this.pldrtp = Whetherdisplay(this.btns, '批量导入图片(excel)');
    this.xzmb = Whetherdisplay(this.btns, '下载模板');
    this.dccsv = Whetherdisplay(this.btns, '导出到CSV文件');
    this.xgbtn = Whetherdisplay(this.btns, '修改');
    this.kcjgxg = Whetherdisplay(this.btns, '库存价格修改');
    this.szmdsp = Whetherdisplay(this.btns, '设置门店商品');
    this.spzdrz = Whetherdisplay(this.btns, '商品主档日志');
    this.dcsgxjjlb = Whetherdisplay(this.btns, '手工下架记录表导出');
    this.dccydgg = Whetherdisplay(this.btns, '新建餐饮多规格商品');

    this.http.getFirstOnlineCategories.request({ parent: 0 })
      .subscribe(categories => {
        // this.firstCategories = categories;
        // this.mfirstCategories = categories;
        this.firstCategories = categories['data'].rows;
        this.mfirstCategories = categories['data'].rows;
      });
    this.getItemList(this.params);
    // 获取缓存图片类型
    this.getimgcheck();
    // 查询商品参数
    this.getsole();
    this.pm_findcategory(); // 查询伪一级分类
    this.pm_finditems(); // 查询可添加 多规格商品
  }
  togglesearch(event) {
    this.j++;
    if (this.j % 2 !== 0) {
      this.hidesearch = true;
      event.target.value = '收起↑';
    } else {
      this.hidesearch = false;
      event.target.value = '展开更多↓';
    }
  }
  handleUpload(data: any): void {

    if (data && data.response) {
      data = JSON.parse(data.response);
      this.uploadFile = data;
    }
  }
  trackByIndex(index, item) {
    return index;
  }

  subCategories: any;
  msubCategories: any;
  getSubOnlineCategories(code: String) {
    this.subCategories = [];
    this.params.search.online_cat_code = '';
    this.http.getSubOnlineCategories.request({ parent: code })
      .subscribe(categories => {
        // this.subCategories = JSON.parse(JSON.stringify(categories));
        this.subCategories = categories['data'].rows;

        if (this.subCategories && this.subCategories.length > 0) {
          this.params.search.online_cat_code = this.subCategories[0].code;
        } else {
          this.params.search.online_cat_code = '';
        }
        // 特殊分类，无子节点
      });
  }
  mgetSubOnlineCategories(code: String, name: String) {
    this.msubCategories = [];
    this.goods.online_cat_code = '';
    this.http.getSubOnlineCategories.request(code)
      .subscribe(categories => {
        // this.msubCategories = JSON.parse(JSON.stringify(categories));
        this.subCategories = categories['data'].rows;

        if (this.msubCategories && this.msubCategories.length > 0) {
          this.goods.online_cat_code = this.msubCategories[0].code;
          this.goods.online_cat_name = this.msubCategories[0].name;
        } else {
          this.goods.online_cat_code = '';
          this.goods.online_cat_name = '';
        }
      });
    this.goods.online_sup_name = name;

  }

  // 获取二级分类名称
  changeOnlineCategory(name: String) {
    this.goods.online_cat_name = JSON.parse(JSON.stringify(name));
  }

  // 输入条件查询方法
  search(paramsoption) {
    paramsoption.page_no = 1;
    this.getItemList(paramsoption);
  }

  cow: number;
  // 接收翻页操作传过来的值，然后请求服务得到新数据
  childparams($event) {
    let childoption = $event;
    this.params.page_no = childoption.page_no;
    this.cow = (childoption.page_no - 1) * childoption.page_size;
    this.getItemList(childoption);
  }
  // 获取列表
  changecount: any = 0;
  getItemList(param): void {
    this.cow = (param.page_no - 1) * param.page_size;
    this.http.getItemBases.request(param)
      .subscribe(commodities => {
        // this.commodities = commodities['rows'];
        // this.pageSize.count = commodities['count'];
        // this.changecount = commodities['count'];
        this.commodities = commodities['data'].rows;
        this.pageSize.count = commodities['data'].count;
        this.changecount = commodities['data'].count;
      });
    this.currentgoods.sfxz = false;
    this.selecteditems = [];
    this.selectcurrentcount = false;
  }
  itemlogs: any;
  itemlogsm_desc: any;

  // 查询商品参数 （编码唯一或编码条码唯一）
  getsole() {
    this.http.getsole.request({})
      .subscribe(row => {
        if (row['data'].sole === '1') {
          this.sole = true;
        } else if (row['data'].sole === '2') {
          this.sole = false;
        }
      });
  }

  uploaderopt: any;

  uploadImg = (result: UploadResult): void => {
    const sucopt = {
      bid: this.goodsbid,
      key: result.key,
      local_url: result.localUrl,
      remote_url: result.remoteUrl
    };
    this.http.addItemFiles.request(sucopt)
      .subscribe(res => {
        this.http.getItemFiles.request({ bid: res['bid'] })
          .subscribe(imgs => {
            this.imgs = imgs['data'];
          });
      });
  }

  uploadDetailImg = (result: UploadResult): void => {
    const sucopt = {
      bid: this.goodsbid,
      key: result.key,
      local_url: result.localUrl,
      remote_url: result.remoteUrl
    };
    this.http.addDetailItemFiles.request(sucopt)
      .subscribe(res => {
        this.http.getDetailItemFiles.request({ bid: res['bid'] })
          .subscribe(imgs => {
            this.goods.picture_detail = imgs;
          });
      });
  }

  // 拉取图片
  imgexamine: boolean = false;
  lqimginfo: any = {
    url: ''
  };
  getImages(items) {
    const imgList: any = {
      barcode: [],
      item_code: []
    };
    imgList.item_code.push(items.code);
    imgList.barcode.push(items.barcode);
    const params = JSON.stringify(imgList);
    this.http.getImgesInfo.request(params)
      .subscribe(res => {
        if (res['code'] === '0') {
          this.lqimginfo = res['msg'];
          this.notification.create('success', '温馨提示', '拉取成功');
          // this.imgexamine = true;
        } else {
          this.lqimginfo.url = '';
          this.notification.create('error', '温馨提示', '没有拉取到图片');
        }
      });
  }

  closeimgexamine() {
    this.imgexamine = false;
  }

  // 图片审核-通过
  adopt() {
    this.lqimginfo.check_status = 1;
    this.http.checkImages.request(this.lqimginfo)
      .subscribe(res => {
        // if (res['code'] === 0) {
        //   alert('已通过审核');
        //   this.imgexamine = false;
        //   this.getItemList(this.params);
        // }
        this.notification.create('success', '温馨提示', res['data'].msg);
        this.imgexamine = false;
        this.getItemList(this.params);

      });
  }
  // 图片审核-不通过
  noadopt() {
    this.lqimginfo.check_status = 0;
    this.http.checkImages.request(this.lqimginfo)
      .subscribe(res => {
        // if (res['code'] !== 0) {
        //   alert('未通过审核');
        //   this.imgexamine = false;
        //   this.getItemList(this.params);
        // }
        this.notification.create('success', '温馨提示', res['data'].mag);
        this.imgexamine = false;
        this.getItemList(this.params);
      });
  }

  // 删除图片
  deleteImg(img: any): void {
    this.modalService.confirm({
      nzTitle: '温馨提示',
      nzContent: '你确定删除吗?',
      nzOnOk: () => {
        if (this.imgs.length === 1) {
          this.notification.create('error', '温馨提示', '商品图片需要至少保留一张');
        } else {
          this.http.deleteImg.request(img)
            .subscribe(data => {
              this.http.getItemFiles.request({ bid: img.item_id })
                .subscribe(imgs => {
                  this.imgs = imgs['data'];
                });
            });
        }
      }
    });
  }

  // 删除详情图片
  deleteDetailImg(img: any): void {
    this.modalService.confirm({
      nzTitle: '温馨提示',
      nzContent: '你确定删除吗?',
      nzOnOk: () => {
        if (this.goods.picture_detail.length === 1) {
          this.notification.create('error', '温馨提示', '商品详情图片需要至少保留一张');
        } else {
          this.http.deleteDetailImg.request(img)
            .subscribe(data => {
              this.http.getDetailItemFiles.request({ bid: img.item_id })
                .subscribe(imgs => {
                  this.goods.picture_detail = imgs;
                });
            });
        }
      }
    });
  }


  // 切换主图
  showImg(img: any) {
    this.http.showImg.request(img)
      .subscribe(tip => {
        this.notification.create('success', '温馨提示', tip['data'].msg);
        this.http.getItemFiles.request({ bid: img.item_id })
          .subscribe(imgs => {
            this.imgs = imgs['data'];
          });
      });

  }
  goods: any = {
    'online_sup_name': '',
    'online_cat_code': '',
    'is_fresh': false
  };
  price: any;
  getdwzh(goods) {
    this.price = goods.dwzhxs * goods.erp_price;
  }
  gotoeditgoods(bid) {// 打开商品详细对话框
    this.modalwidth = 800;
    this.modaltitle = '商品资料';
    this.modalstatus = true;
    this.confirmisshow = true;
    bid = String(bid);
    this.goodsbid = bid;
    this.http.getGoods.request({
      bid: bid
    })
      .subscribe(goods => {
        this.goods = goods['data'];
        if (this.goods.psyq) {
          this.checkOptionspsyqs = [
            { label: '液体', value: '2', sfxz: false },
            { label: '处方药', value: '3', sfxz: false },
          ];
          this.psyqstorage = this.goods.psyq.storage_type;
          for (let i = 0; i < this.checkOptionspsyqs.length; i++) {
            for (let j = 0; j < this.goods.psyq.type.length; j++) {
              if (this.checkOptionspsyqs[i].value === this.goods.psyq.type[j]) {
                this.checkOptionspsyqs[i].sfxz = true;
              }
            }
          }
        } else {
          this.checkOptionspsyqs = [
            // { label: '易碎', value: '1', sfxz: false },
            { label: '液体', value: '2', sfxz: false },
            { label: '处方药', value: '3', sfxz: false },
          ];
          this.psyqstorage = '';
          this.selectedco = [];
        }

        if (!this.goods.is_fresh) {
          this.goods['is_fresh'] = false;
        }
        if (!this.goods.is_food) {
          this.goods['is_food'] = false;
        }
        // 获取二级分类
        const online_sup_code = goods['online_sup_code'];
        this.http.getSubOnlineCategories.request({ parent: online_sup_code })
          .subscribe(categories => {
            this.msubCategories = categories['data'].rows;
          });
        this.http.getDetailItemFiles.request({ bid: bid })
          .subscribe(imgs => {
            this.goods.picture_detail = imgs;
          });
      });
    this.http.getItemFiles.request({ bid: bid })
      .subscribe(imgs => {
        this.imgs = imgs['data'];
      });
  }

  //  获取主档操作日志
  geItemLog(param): void {
    this.modalwidth = 1000;
    this.modaltitle = '商品主档日志';
    this.modalstatus = true;
    this.confirmisshow = false;
    this.itemlogsm_desc = param.m_desc;
    this.http.geItemLog.request(param)
      .subscribe(itemlog => {
        // if (itemlog['code'] === false) {
        //   alert(itemlog['msg']);
        // } else {
        //   this.itemlogs = itemlog;
        // }
        if (itemlog['code'] === '010001000') {
          this.itemlogs = itemlog['data'];
        } else {
          this.notification.create('error', '温馨提示', itemlog['msg']);
        }
      });
  }

  liststores: any;
  smqx: boolean = false;
  sjsm: boolean = false;
  txskcqxsm: boolean = false;
  jsxxkc: boolean = false;
  jsxxjg: boolean = false;
  m_desc: any;
  deletegoods(code, barcode, status, m_desc) {
    this.modalwidth = 860;
    this.modaltitle = '设置门店商品';
    this.modalstatus = true;
    this.confirmisshow = true;
    this.m_desc = m_desc;
    if (status === '售卖') {

      this.liststores = [];
      this.smqx = false;
      this.sjsm = false;
      this.jsxxjg = false;
      this.jsxxkc = false;

      let data = {
        code: code,
        barcode: barcode
      };
      this.http.editjgck.request(data)
        .subscribe(liststores => {
          if (liststores['code'] === false) {
            this.notification.create('error', '温馨提示', liststores['msg']);
          } else {
            this.liststores = liststores['data'];
            const statusarr: any[] = [];
            const salestatusarr: any[] = [];
            // const pushstockarr: any[] = [];
            const receivestockarr: any[] = [];
            const receivepricearr: any[] = [];
            for (let i = 0; i < this.liststores.length; i++) {
              if (this.liststores[i].status === '-1') {
                statusarr.push(this.liststores[i].status);
              }
              if (this.liststores[i].sale_status === 2) {
                salestatusarr.push(this.liststores[i].sale_status);
              }
              if (this.liststores[i].receive_stock === '-1') {
                receivestockarr.push(this.liststores[i].receive_stock);
              }
              if (this.liststores[i].receive_price === '-1') {
                receivepricearr.push(this.liststores[i].receive_price);
              }
            }
            if (statusarr.length > 0) {
              this.smqx = false;
            } else {
              this.smqx = true;
            }
            if (salestatusarr.length > 0) {
              this.sjsm = false;
            } else {
              this.sjsm = true;
            }
            if (receivestockarr.length > 0) {
              this.jsxxkc = false;
            } else {
              this.jsxxkc = true;
            }
            if (receivepricearr.length > 0) {
              this.jsxxjg = false;
            } else {
              this.jsxxjg = true;
            }
          }
        });
    } else {
      this.notification.create('error', '温馨提示', '商品主档停售，不可修改门店商品状态');
    }
  }

  tip: any;
  // 配送要求复选框
  checkOptionspsyqs: any[] = [
    // { label: '易碎', value: '1', sfxz: false },
    { label: '液体', value: '2', sfxz: false },
    { label: '处方药', value: '3', sfxz: false },
  ];
  psyqstorage: '';
  selectedco: any = [];
  selectco(co) {
    if (co.sfxz) {
      co.sfxz = false;
    } else {
      co.sfxz = true;
    }
    this.selectedco = [];
    for (let i = 0; i < this.checkOptionspsyqs.length; i++) {
      if (this.checkOptionspsyqs[i].sfxz) {
        this.selectedco.push(this.checkOptionspsyqs[i].value);
      }
    }
  }

  // 单位转换系数修改
  editDwzhxs(goods: any): void {
    const data = {
      code: goods.code,
      barcode: goods.barcode,
      dwzhxs: goods.dwzhxs
    };
    this.http.editDwzhxs.request(data)
      .subscribe(tip => {
        this.notification.create('success', '温馨提示', tip['data'].msg);
      });
  }
  Reset() {
    this.params.search.code = '';
    this.params.search.name = '';
    this.params.search.barcode = '';
    this.params.search.status = '';
    this.params.search.source_cat_name = '';
    this.params.search.online_sup_code = '';
    this.params.search.online_cat_code = '';
    this.params.search.source_type_keyword = '';
    this.params.search.spec = '';
    this.params.search.unit = '';
    this.params.search.gross_weight = '';
    this.params.search.fl = '';
    this.params.search.img = '';
    this.params.search.testwh = '';
    this.params.search.norm = '';
    this.params.search.base_uom_name = '';
  }
  Trim(str, is_global) { // 去空格
    let result;
    result = str.replace(/(^\s+)|(\s+$)/g, '');
    if (is_global.toLowerCase() == 'g') {
      result = result.replace(/\s/g, '');
    }
    return result;

  }
  addexport() {
    let exportname: any, code: any, name: any, barcode: any, status: any, source_type_keyword: any, online_sup_code: any, online_cat_cod: any
    if (this.params.search.code) { code = this.params.search.code + '-'; } else { code = ''; }
    if (this.params.search.name) { name = this.params.search.name + '-'; } else { name = ''; }
    if (this.params.search.barcode) { barcode = this.params.search.barcode + '-'; } else { barcode = ''; }
    if (this.params.search.status === '1') { status = '售卖' + '-'; } else if (this.params.search.status === '-1') { status = '停售' + '-'; } else { status = '' }
    if (this.params.search.source_type_keyword) { source_type_keyword = this.params.search.source_type_keyword + '-'; } else { source_type_keyword = ''; }
    if (this.params.search.online_sup_code) { online_sup_code = this.params.search.online_sup_code + '-'; } else { online_sup_code = ''; }
    if (this.params.search.online_cat_cod) { online_cat_cod = this.params.search.online_cat_cod + '-'; } else { online_cat_cod = ''; }
    exportname = code + name + barcode + status + source_type_keyword + online_sup_code + online_cat_cod;
    exportname = this.Trim(exportname, 'g');
    let parame = {
      'path': '/test-export-bsp/item/getitembases',
      'search': {
        'code': '',
        'name': '',
        'barcode': ''
      },
      'desc': exportname + '商品资料',
      'sort': 'code',
      'sortDirKey': 'DESC',
      'export_columns': [
        { 'name': '来源', 'key': 'source_type_keyword' },
        { 'name': '商品编码', 'key': 'code' },
        { 'name': '商品条码', 'key': 'barcode' },
        { 'name': '线下名称', 'key': 'name' },
        { 'name': '线上名称', 'key': 'm_desc' },
        { 'name': '线下规格', 'key': 'spec' },
        { 'name': '线上规格', 'key': 'm_spec' },
        { 'name': '线下单位', 'key': 'base_uom_name' },
        { 'name': '线上单位', 'key': 'm_base_uom_name' },
        { 'name': '线下重量', 'key': 'm_gross_weight' },
        { 'name': '线上重量', 'key': 'gross_weight' },
        { 'name': '一级分类', 'key': 'online_sup_name' },
        { 'name': '二级分类', 'key': 'online_cat_name' },
        { 'name': '售卖状态', 'key': 'status' },
        { 'name': '单位转换系数', 'key': 'dwzhxs' },
        { 'name': '餐盒费', 'key': 'lunch_box_fee' },
        { 'name': '商品名称', 'key': 'item_name' },
        { 'name': '单位', 'key': 'uom_name' },
        { 'name': '是否牵牛花维护', 'key': 'testwh' },
        { 'name': '是否生鲜商品', 'key': 'is_fresh' },		// is_fresh
        { 'name': '是否必卖', 'key': 'must_sale' },		// must_sale
        { 'name': '是否有图片', 'key': 'master_img_url' },	// is_img
        { 'name': '线下同步时间', 'key': 'timestamp' }

        // BUG：导出信息缺少：售卖状态、单位转换系数、线下同步时间


      ],
      'ent_id': this.userentid,
      'code': this.usercode

    }
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

  addexportsgxj() {
    const parame = {
      'path': '/test-export-bsp/item/getManualOfflines',
      'search': {},
      'desc': '手工下架记录表',
      'sort': 'code',
      'sortDirKey': 'DESC',
      'export_columns': [
        { 'name': '企业编码', 'key': 'ent_id' },
        { 'name': '门店编码', 'key': 'region_code' },
        { 'name': '门店名称', 'key': 'region_name' },
        { 'name': '商品编码', 'key': 'item_code' },
        { 'name': '商品条码', 'key': 'barcode' },
        { 'name': '商品名称', 'key': 'item_name' },
        { 'name': '分类名称', 'key': 'online_cat_name' },
        { 'name': '手工下架时间', 'key': 'manual_data' },
        { 'name': '手工下架操作人', 'key': 'oper_user' },
        { 'name': '可用库存', 'key': 'available_qty' },
      ],
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
  selectedall(event) {
    const isChecked = event.currentTarget.checked;
    if (isChecked) {
      for (let i = 0; i < this.liststores.length; i++) {
        this.liststores[i].sfxz = true;
      }
    } else {
      for (let i = 0; i < this.liststores.length; i++) {
        this.liststores[i].sfxz = false;
      }
    }

  }

  clean: boolean;
  batchmodalbox(type) {
    this.modalstatus = true;  // 打开弹出框
    this.modalwidth = 800;    // 设置弹出框宽度
    this.modaltitle = '批量上传图片'; // 设置弹出框title
    if (type == 1) {
      this.modaltitle = '批量上传图片'; // 设置弹出框title
      this.uploadTypeModal = "main";
    } else {
      this.modaltitle = '批量上传详情图片'; // 设置弹出框title
      this.uploadTypeModal = "detail";
    }
    this.confirmisshow = false;
  }
  closemodal() { // 关闭弹出框时重置modalstatus默认值
    this.modalstatus = false;
  }
  allimgupload() {

  }
  handleokfun(key) {
    switch (key) {
      case '批量上传图片':

        break;
      case '商品资料':
        this.updatedggGoods(this.goods, this.imgs);
        break;
      case '设置门店商品':
        this.deletestore(this.liststores);
        break;
    }
  }
  deletestore(liststores) {
    this.http.delsign.request(liststores)
      .subscribe(tip => {
        this.results = tip['data'];
        this.importtip = true;
      });
  }
  errormsg: any[] = [];
  uploadcg: boolean = false;
  imgList: any = [];

  batchimportcsvInput(file: HTMLInputElement): void {
    this.loadingimg = true;
    // this.importtip = true;
    const form = new FormData();
    form.append('file', file.files[0], file.files[0].name);
    this.publicservice.batchimportcsv(form, this.clean);
  }

  setclear() {
    this.modalService.confirm({
      nzTitle: '温馨提示',
      nzContent: '是否覆盖原有的商品图片？',
      nzOnOk: () => {
        this.clean = true;
      },
      nzOnCancel: () => {
        this.clean = false;
      }
    });
  }

  // 售卖
  sfqycheckbox(event, i) {
    let isChecked = event.currentTarget.checked;
    if (isChecked) {
      this.liststores[i].status = '1';
    } else {
      this.liststores[i].status = '-1';
      this.smqx = false;
    }
  }
  // 上下架
  sfsxjcheckbox(event, i) {
    const isChecked = event.currentTarget.checked;
    if (isChecked) {
      this.liststores[i].sale_status = 1;
    } else {
      this.liststores[i].sale_status = 2;
      this.sjsm = false;
    }
  }
  // 是否接收线下价格
  sfjsjgcheckbox(event, i) {
    const isChecked = event.currentTarget.checked;
    if (isChecked) {
      this.liststores[i].receive_price = '1';
    } else {
      this.liststores[i].receive_price = '-1';
      this.jsxxjg = false;
    }
  }
  // 是否接收线下库存
  sfjskccheckbox(event, i) {
    const isChecked = event.currentTarget.checked;
    if (isChecked) {
      this.liststores[i].receive_stock = '1';
    } else {
      this.liststores[i].receive_stock = '-1';
      this.txskcqxsm = false;
    }
  }
  // 批量操作状态
  qxsm(event) {
    const isChecked = event.currentTarget.checked;
    if (isChecked) {
      for (let i = 0; i < this.liststores.length; i++) {
        this.liststores[i].status = '1';
      }
    } else {
      for (let i = 0; i < this.liststores.length; i++) {
        this.liststores[i].status = '-1';
      }
    }
  }

  qxsj(event) {
    const isChecked = event.currentTarget.checked;
    if (isChecked) {
      for (let i = 0; i < this.liststores.length; i++) {
        this.liststores[i].sale_status = '1';
      }
    } else {
      for (let i = 0; i < this.liststores.length; i++) {
        this.liststores[i].sale_status = '2';
      }
    }
  }

  qxtxskc(event) {
    const isChecked = event.currentTarget.checked;
    if (isChecked) {
      for (let i = 0; i < this.liststores.length; i++) {
        this.liststores[i].receive_price = 1;
      }
    } else {
      for (let i = 0; i < this.liststores.length; i++) {
        this.liststores[i].receive_price = -1;
      }
    }
  }

  qxjsxxkc(event) {
    const isChecked = event.currentTarget.checked;
    if (isChecked) {
      for (let i = 0; i < this.liststores.length; i++) {
        this.liststores[i].receive_stock = '1';
      }
    } else {
      for (let i = 0; i < this.liststores.length; i++) {
        this.liststores[i].receive_stock = '-1';
      }
    }
  }
  // 导入提示
  createBasicNotification(template: TemplateRef<{}>): void {
    this.notification.template(template, { nzDuration: 0 });
  }

  gettemplate(templete) {
    this.templeteobj = templete;
  }
  // 商品主档新增/修改
  datainput = (result: UploadResult): void => {

    if (result) {
      const sucopt = {
        filename: result.fileName,
        channel: '',
        storesobj: '',
        key: result.key,
        local_url: result.localUrl,
        remote_url: result.remoteUrl
      };
      this.http.itemBaseImport.request(sucopt)
        .subscribe(data => {
          if (data) {
            this.results = data;
            this.createBasicNotification(this.templeteobj);
          }
        });
    }
  }

  // 设置商品线上分类
  xsspfl = (result: UploadResult): void => {
    if (result) {
      const sucopt = {
        filename: result.fileName,
        channel: '',
        storesobj: '',
        key: result.key,
        local_url: result.localUrl,
        remote_url: result.remoteUrl
      };
      this.http.xsspflinput.request(sucopt)
        .subscribe(data => {
          if (data) {
            this.results = data;
            this.createBasicNotification(this.templeteobj);
          }
        });
    }
  }

  // 商品主档售卖状态导入
  itemBaseStatus = (result: UploadResult): void => {
    const sucopt = {
      filename: result.fileName,
      channel: '',
      storesobj: '',
      key: result.key,
      local_url: result.localUrl,
      remote_url: result.remoteUrl
    };
    this.http.itemStatusImport.request(sucopt)
      .subscribe(data => {
        if (data) {
          this.results = data;
          this.createBasicNotification(this.templeteobj);
        }
      });
  }
  // 单位转换系数导入
  dwzhxsimports = (result: UploadResult): void => {
    const sucopt = {
      filename: result.fileName,
      channel: '',
      storesobj: '',
      key: result.key,
      local_url: result.localUrl,
      remote_url: result.remoteUrl
    };
    this.http.dwzhxsImport.request(sucopt)
      .subscribe(data => {
        if (data) {
          this.results = data;
          this.createBasicNotification(this.templeteobj);
        }
      });
  }

  // 必卖商品导入
  bmspimports = (result: UploadResult): void => {
    const sucopt = {
      filename: result.fileName,
      channel: '',
      storesobj: '',
      key: result.key,
      local_url: result.localUrl,
      remote_url: result.remoteUrl
    };
    this.http.importMustSaleItem.request(sucopt)
      .subscribe(data => {
        if (data) {
          this.results = data;
          this.createBasicNotification(this.templeteobj);
        }
      });
  }
  // 商品线下分类导入
  spxxfl = (result: UploadResult): void => {
    const sucopt = {
      filename: result.fileName,
      channel: '',
      storesobj: '',
      key: result.key,
      local_url: result.localUrl,
      remote_url: result.remoteUrl
    };
    this.http.offlineCategoryImport.request(sucopt)
      .subscribe(data => {
        if (data) {
          this.results = data;
          this.createBasicNotification(this.templeteobj);
        }
      });
  }
  // 生鲜商品导入
  freshtolead = (result: UploadResult): void => {
    const sucopt = {
      filename: result.fileName,
      channel: '',
      storesobj: '',
      key: result.key,
      local_url: result.localUrl,
      remote_url: result.remoteUrl
    };
    this.http.importFreshItem.request(sucopt)
      .subscribe(data => {
        if (data) {
          this.results = data;
          this.createBasicNotification(this.templeteobj);
        }
      });
  }

  // 根据编码修改条码导入
  barcodeupdate = (result: UploadResult): void => {
    const sucopt = {
      filename: result.fileName,
      channel: '',
      storesobj: '',
      key: result.key,
      local_url: result.localUrl,
      remote_url: result.remoteUrl
    };
    this.http.updateBarcodeByItemcode.request(sucopt)
      .subscribe(data => {
        if (data) {
          this.results = data;
          this.createBasicNotification(this.templeteobj);
        }
      });
  }
  // 商品副标题导入
  subtitleimports = (result: UploadResult): void => {
    const sucopt = {
      filename: result.fileName,
      key: result.key,
      local_url: result.localUrl,
      remote_url: result.remoteUrl
    };
    this.http.importSubTitel.request(sucopt)
      .subscribe(data => {
        if (data) {
          this.results = data;
          this.createBasicNotification(this.templeteobj);
        }
      });
  }
  // 配送要求导入
  psyqimports = (result: UploadResult): void => {
    const sucopt = {
      filename: result.fileName,
      key: result.key,
      local_url: result.localUrl,
      remote_url: result.remoteUrl
    };
    this.http.importPsyq.request(sucopt)
      .subscribe(data => {
        if (data) {
          this.results = data;
          this.createBasicNotification(this.templeteobj);
        }
      });
  }
  // 餐饮商品导入
  isfoodimports = (result: UploadResult): void => {
    const sucopt = {
      filename: result.remoteUrl,
      channel: '',
      storesobj: '',
      key: result.key,
      local_url: result.localUrl,
      remote_url: result.remoteUrl
    };
    this.http.importFoodItem.request(sucopt)
      .subscribe(data => {
        if (data) {
          this.results = data;
          this.createBasicNotification(this.templeteobj);
        }
      });
  }
  // 税码导入
  taxcodeimports = (result: UploadResult): void => {
    const sucopt = {
      filename: result.fileName,
      channel: '',
      storesobj: '',
      key: result.key,
      local_url: result.localUrl,
      remote_url: result.remoteUrl
    };
    this.http.importTaxItem.request(sucopt)
      .subscribe(data => {
        if (data) {
          this.results = data;
          this.createBasicNotification(this.templeteobj);
        }
      });
  }

  download = filename => this.publicservice.publicdownload(filename);

  selectcurrentcount: boolean = false;
  currentgoods: any = { sfxz: false }
  setcheckbox(item) {// 点击列表上的复选框触发的方法
    this.selectcurrentcount = true;
    this.currentgoods.sfxz = false;
    if (item.sfxz) {
      item.sfxz = false;
      this.selectRow(item);
    } else {
      item.sfxz = true;
      this.selectRow(item);
    }

  }
  selecteditems: any[] = [];// 批量作废-列表页面选中的商品存入此数组中
  selectRow(item: any) {
    const selected = item.sfxz;
    if (selected) {
      let isbh = false;
      for (let i = 0; i < this.selecteditems.length; i++) {
        const id = item.barcode;
        const tempid = this.selecteditems[i].barcode;
        if (id === tempid) {
          isbh = true;
          break;
        }
      }
      if (!isbh) {
        this.selecteditems.push(item);
      }
    } else {
      for (let i = 0; i < this.selecteditems.length; i++) {
        const id = item.barcode;
        const tempid = this.selecteditems[i].barcode;
        if (id === tempid) {
          this.selecteditems.splice(i, 1);
          break;
        }
      }
    }
    if (this.selecteditems.length == this.params.page_size) {
      this.currentgoods.sfxz = true;
    }
  }
  setcurrentgoods(event) {// 批量作废-选择当前页商品复选框触发的方法
    const isChecked = event.currentTarget.checked;
    this.selectcurrentcount = true;
    if (isChecked) {
      this.currentgoods.sfxz = true;
      for (let i = 0; i < this.commodities.length; i++) {
        this.commodities[i].sfxz = true;
        this.selecteditems.push(this.commodities[i]);
      }
    } else {
      this.selectcurrentcount = false;
      this.currentgoods.sfxz = false;
      for (let i = 0; i < this.commodities.length; i++) {
        this.commodities[i].sfxz = false;
      }
      this.selecteditems = [];
    }
  }

  // 批量操作商品主档状态
  batchvoid(param, select) {
    if (this.selecteditems.length >= 1) {
      if (select == 1) {
        this.modalService.confirm({
          nzTitle: '温馨提示',
          nzContent: '您确认要售卖商品吗？操作后门店即可售卖商品，若商品在白名单中移除过将被恢复',
          nzOnOk: () => {
            this.loadingimg = true;
            this.http.batchinvalid.request(param, select)
              .subscribe(tip => {
                if (tip['code'] === 'success') {
                  this.getItemList(this.params);
                  this.loadingimg = false;
                  this.notification.create('success', '温馨提示', tip['data'].msg);
                }
              });
          }
        });
      } else {
        this.modalService.confirm({
          nzTitle: '温馨提示',
          nzContent: '您确认要停售商品吗？停售后所有门店将不可售卖商品，若商品已加到白名单中将被移除',
          nzOnOk: () => {
            this.loadingimg = true;
            this.http.batchinvalid.request(param, select)
              .subscribe(tip => {
                if (tip['code'] == 'success') {
                  this.getItemList(this.params);
                  this.loadingimg = false;
                  this.notification.create('success', '温馨提示', tip['data'].msg);
                }
              });
          }
        });
      }

    } else {
      this.notification.create('error', '温馨提示', '请勾选需要操作的商品!');
    }


  }

  // 批量拉取图片
  getImgAlls() {
    const imgList: any = {
      barcode: [],
      item_code: []
    };
    const imgcode: any = [];
    const imgbarcode: any = [];
    let ts = false;
    for (let i = 0; i < this.commodities.length; i++) {
      if (this.commodities[i].sfxz) {
        if (!this.commodities[i].master_img_url) {
          imgList.item_code.push(this.commodities[i].code);
          imgList.barcode.push(this.commodities[i].barcode);
        }
        ts = true;
      }

    }
    if (!ts) {
      this.notification.create('error', '温馨提示', '请选择');
      return false;
    }
    const params = JSON.stringify(imgList);
    this.http.getWptxImage.request(params)
      .subscribe(res => {
        if (res['code'] === '010001000') {
          this.lqimginfo = res['msg'];
          this.notification.create('success', '温馨提示', '拉取成功');
        } else {
          this.lqimginfo.url = '';
          this.notification.create('error', '温馨提示', '没有拉取到图片');
        }
      });
  }

  // 单个更改商品状态
  editstatus(commodity) {
    if (commodity.status === '售卖') {
      this.modalService.confirm({
        nzTitle: '温馨提示',
        nzContent: '您确认要停售该商品吗？停售后所有门店将不可售卖该商品，若该商品已加到白名单中将被移除',
        nzOnOk: () => {
          const date: any = { 'code': '', 'barcode': '', 'status': '' };
          date.code = commodity.code;
          date.barcode = commodity.barcode;
          date.status = commodity.status;
          this.http.itembasechange.request(date)
            .subscribe(tip => {
              this.results = tip['data'];
              this.importtip = true;
              this.getItemList(this.params);
            });
        }
      });
    } else {
      this.modalService.confirm({
        nzTitle: '温馨提示',
        nzContent: '您确认要售卖该商品吗？操作后门店即可售卖该商品，若该商品在白名单中移除过将被恢复',
        nzOnOk: () => {
          let date: any = { 'code': '', 'barcode': '', 'status': '' };
          date.code = commodity.code;
          date.barcode = commodity.barcode;
          date.status = commodity.status;
          this.http.itembasechange.request(date)
            .subscribe(tip => {
              this.results = tip['data'];
              this.importtip = true;
              this.getItemList(this.params);
            });
        }
      });
    }
  }

  importtip: boolean = false;
  closeimportip() {
    this.importtip = false;
  }

  // 判断图片名称类型
  imgtype(n) {
    this.paramn = n;
    // 保存到缓存
    localStorage.setItem('paramn', this.paramn.toString());
  }

  // 判断图片名称类型
  covers(n) {
    this.cover = n;
    // 保存到缓存
    localStorage.setItem('cover', this.cover.toString());
  }


  // 判断是否存在
  imgstate: any;
  getimgcheck() {
    this.http.isGetWptxImage.request({})
      .subscribe(row => {
        if (row) {
          this.imgstate = row['data'].result;
        } else {
          this.imgstate = 0;
        }
      });
  }



  checktext(event) {
    if (event.keyCode === 13) {
      this.notification.create('error', '温馨提示', '不能输入enter键,请重新输入');
      event.target.value = '';
    }
  }
  pm_modeltitle: any;
  imgsinfo: any;
  // 多规格商品模态框
  newspecifications() {
    this.pm_iscydgg = true;
    this.pm_modeltitle = '新建';
    this.pm_finditems();
  }
  // 上传图片
  uploadImgtwo(goods: any): void {

  }

  searchitem = {
    search: {
      name: '',
      code: '',
      barcode: ''
    },
    page_no: 1,
    page_size: 20,
  }
  pm_pageSize = {
    totalPage: 0,
    count: 0
  }
  pm_items: any;
  pm_count: any = 0;

  _current = 1;
  additemgoods = []; // 选中的多规格商品
  categorys: any;
  // tslint:disable-next-line:member-ordering
  dggitem = {
    name: '',   // 商品名称
    category_code: '',  // 分类编码
    category_name: '',  // 分类名称
    m_xsms: '',         // 商品描述
    imgs: [],  // 图片 按照界面上的顺序排列好
    specItems: []
  };
  dggitemtwo = {
    name: '',   // 商品名称
    category_code: '',  // 分类编码
    category_name: '',  // 分类名称
    m_xsms: '',
    bid: '',      // 商品描述
    imgs: [],  // 图片 按照界面上的顺序排列好
    specItems: []
  };
  pm_spcename: any;
  pm_zsdgg: any[] = [];
  pm_dggarr: any[] = []

  pm_k: number = 0;
  zk: boolean = true;
  clickcount = 0;
  pm_modify: boolean = false;
  pm_modifylist: any;

  temporary: any;
  btn_forbid: boolean = false;
  // 查询可添加商品
  pm_finditems() {
    // this.searchitem.page_no = this._current;
    // this.pm_cow = (this.searchitem.page_no - 1) * this.searchitem.page_size;
    this.http.findItems.request(this.searchitem)
      .subscribe(res => {
        this.pm_items = res['rows'];
        this.pm_count = res['count'];
        this.pm_pageSize.count = res['count'];
        for (let m = 0; m < this.pm_items.length; m++) {
          const key = this.spec_name;
          this.pm_items[m][key] = '';
        }
      });
  }
  // 重置按钮
  pm_reset() {
    this.searchitem.search.name = '';
    this.searchitem.search.code = '';
    this.searchitem.search.barcode = '';
  }
  spec_name: string = 'spec_name';
  add_bid: any;
  // 添加到多规格
  additem(param, j) {
    // this.add_bid = param.bid;
    // if (this.additemgoods.length > 5) {
    //   alert('最多添加六个子商品');
    // } else if (this.additemgoods.length == 0) {
    //   this.additemgoods.push(param);
    //   this.pm_items.splice(j, 1); // 从列表里面去掉!
    // } else {
    //   this.additemgoods.forEach(item => {
    //     if(this.add_bid == item.bid && param.code == item.code && param.barcode == item.barcode) {
    //       confirm('请勿添加重复商品');
    //       return false;
    //     } else {
    //       this.additemgoods.push(param);
    //       this.pm_items.splice(j, 1); // 从列表里面去掉!

    //     }
    //   });
    // for(let i = 0; i <= this.additemgoods.length; i++) {

    // }
    // for (let m = 0; m < this.additemgoods.length; m++) {
    //   const key = this.spec_name;
    //   this.additemgoods[m][key] = '';
    // }
    // if (this.additemgoods.length > 0) {
    //   if (this.additemgoods.length > 5) {
    //     alert('最多添加六个子商品');
    //   } else {
    //     this.additemgoods.forEach(item => {
    //       if (item.bid === param.bid) {

    //         alert('请勿重复添加商品');
    //         // break;
    //       }else {
    //       this.additemgoods.push(param);
    //       }
    //       //   this.pm_items.splice(j, 1);
    //       // else {
    //       //   this.additemgoods.push(param);
    //       //   this.pm_items.splice(j, 1);
    //       //   return false;
    //       // }
    //     });
    //   }
    // } else {
    //   this.additemgoods.push(param);
    //   this.pm_items.splice(j, 1);
    // }

    // if (this.additemgoods.length > 5) {
    //   alert('最多添加六个子商品');
    // } else {
    //   // delete param.lunch_box_fee;
    //   // delete param.m_desc;
    //   // delete param.name;
    //   // const key = this.spec_name;
    //   // param[key] = '';
    //   this.additemgoods.push(param); // 添加到多规格
    //   this.pm_items.splice(j, 1); // 从列表里面去掉!
    //   // if (this.additemgoods.spec_name) {
    //   //   this.additemgoods.spec_name = '';
    //   // }
    //   for (let m = 0; m < this.additemgoods.length; m++) {
    //     // delete this.pm_modifylist[m].lunch_box_fee;
    //     // delete this.pm_modifylist[m].m_desc;
    //     if (param.bid == this.additemgoods[this.additemgoods.length - 1].bid ) {
    //       alert('请勿重复添加商品');
    //     }
    //   }
    if (this.additemgoods.length > 5) {
      this.notification.create('error', '温馨提示', '最多添加六个子商品');
    } else {
      if (this.additemgoods.length >= 1) {
        if (param.bid == this.additemgoods[this.additemgoods.length - 1].bid) {
          this.notification.create('error', '温馨提示', '请勿重复添加商品');
        } else {
          this.additemgoods.push(param); // 添加到多规格
          this.pm_items.splice(j, 1);
        }
      } else {
        this.additemgoods.push(param); // 添加到多规格
        this.pm_items.splice(j, 1);
      }
    }

  }

  // 新建保存多规格
  pm_savespceitem() {
    this.dggitem.specItems = this.additemgoods;

    for (let j = 0; j < this.additemgoods.length; j++) {
      delete this.additemgoods[j].lunch_box_fee;
      delete this.additemgoods[j].m_desc;
      delete this.additemgoods[j].name;
    }
    for (let j = 0; j < this.dggitem.specItems.length; j++) {
      delete this.dggitem.specItems[j].undefined;
    }
    if (this.imgsinfo == '') {
      this.dggitem.imgs = [];
    } else {
      this.dggitem.imgs.push(this.imgsinfo);
    }
    if (this.dggitem.name && this.dggitem.category_code && this.dggitem.category_name && this.dggitem.imgs.length > 0) {
      for (let i = 0; i < this.dggitem.specItems.length; i++) {
        if (this.dggitem.specItems[i].spec_name.length > 10) {
          this.notification.create('error', '温馨提示', '子商品规格名称不超过10位字符');
          return false;
        }
        if (!this.dggitem.specItems[i].spec_name) {
          this.notification.create('error', '温馨提示', '多规格子商品名称不能为空!');
          return false;
        }
      }
      if (this.dggitem.m_xsms.length > 50) {
        this.notification.create('error', '温馨提示', '商品描述不能超过50个字符');
        return false;
      }
      if (this.dggitem.specItems.length === 0) {
        this.notification.create('error', '温馨提示', '请添加商品');
      } else if (this.dggitem.name.length > 10) {
        this.notification.create('error', '温馨提示', '商品名称不能大于10个字符');
      } else {
        this.btn_forbid = true;
        this.http.saveSpceItem.request(this.dggitem)
          .subscribe(res => {
            if (res['code'] == '0') {
              this.getItemList(this.params);
              this.notification.create('success', '温馨提示', '多规格商品创建成功，属于本多规格的子商品将从门店删除同时将不会在商品资料中显示，如想对其修改，请通过多规格商品修改按钮来对其修改');
              this.pm_iscydgg = false;
              this.btn_forbid = false;
              this.dggitem.name = '';
              this.dggitem.category_code = '';
              this.dggitem.category_name = '';
              this.dggitem.imgs = [];
              this.dggitem.m_xsms = '';
              this.dggitem.specItems = [];
              this.imgsinfo = '';
              this.additemgoods = [];
              this.searchitem.search.name = '';
              this.searchitem.search.code = '';
              this.searchitem.search.barcode = '';
            } else {
              this.btn_forbid = false;
              this.notification.create('error', '温馨提示', res['msg']);
            }
          });
      }
    } else {
      this.notification.create('error', '温馨提示', '红色星号* 为必填项');
    }
  }
  // 新建多规格关闭
  pm_close() {
    this.pm_iscydgg = false;
    this.searchitem.search.name = '';
    this.searchitem.search.code = '';
    this.searchitem.search.barcode = '';
    this.imgsinfo = '';

    this.dggitem.name = '';
    this.dggitem.category_code = '';
    this.dggitem.category_name = '';
    this.dggitem.imgs = [];
    this.dggitem.m_xsms = '';
    this.dggitem.specItems = [];
    this.imgsinfo = '';
    this.additemgoods = [];
    this.searchitem.search.name = '';
    this.searchitem.search.code = '';
    this.searchitem.search.barcode = '';
    this.getItemList(this.params);

  }
  // 去掉新建多规格
  delitem(item, i) {
    this.additemgoods.splice(i, 1); // 从多规格删除
    this.pm_items.push(item); // 添加到 列表

  }
  // 查询伪一级分类
  pm_findcategory() {
    this.http.findCategory.request()
      .subscribe(res => {
        this.categorys = res;
      });
  }

  pm_childparams($event) {
    const childoption = $event;
    this.searchitem.page_no = childoption.page_no;

    this.pm_finditems();
  }
  getcatename(code, name) {
    this.dggitem.category_code = code;
    this.dggitemtwo.category_code = code;
    this.dggitem.category_name = name;
    this.dggitemtwo.category_name = name;
  }
  getcatenametwo(code, name) {
    this.dggitemtwo.category_code = code;
    this.dggitemtwo.category_name = name;
  }
  // 查看多规格按钮
  pm_toggledetail(commodity, $event, i) {
    if (this.pm_zsdgg[i]) {
      this.pm_dggarr[i] = this.pm_k;
      if (this.pm_dggarr[i] % 2 !== 0) {
        this.pm_dggarr[i] = 0;
        this.pm_zsdgg[i] = true;
        this.zk = false;
        // event.target.value = '收起';
      } else {
        this.pm_dggarr[i] = 1;
        this.pm_zsdgg[i] = false;
        this.zk = true;
        // event.target.value = '查看';
      }
    } else {
      this.pm_zsdgg[i] = true;
      this.zk = false;
      // event.target.value = '收起';
      this.pm_k = 0;
    }
  }
  // 修改关闭按钮
  pm_closetwo() {
    this.pm_modify = false;
    this.pm_modifylist = this.temporary;
    this.getItemList(this.params);
    this.searchitem.search.name = '';
    this.searchitem.search.code = '';
    this.searchitem.search.barcode = '';
    this.pm_dggimgs = [];
  }
  pm_catecode: any;
  pm_catename: any;
  pm_temp: any;
  pm_dggimgs: any[] = [];
  pm_dggimg: any = [];
  // 修改多规格
  pm_modifydgg(param) {
    this.pm_modify = true;
    this.pm_finditems();
    this.http.getitemfiles.request({ bid: param.bid })
      .subscribe(res => {
        this.pm_dggimg = res;
        for (let i = 0; i <= this.pm_dggimg.length; i++) {
          if (this.pm_dggimg[i] && this.pm_dggimg[i].url) {
            this.pm_dggimgs.push(this.pm_dggimg[i]);
          }
        }
      });
    for (let i = 0; i < param.spec_items.length; i++) {
      delete param.spec_items[i].base_uom_name;
      delete param.spec_items[i].brand_name;
      delete param.spec_items[i].ent_id;
      delete param.spec_items[i].gross_weight;
      // delete param.spec_items[i].name;
      delete param.spec_items[i].online_cat_code;
      delete param.spec_items[i].online_cat_name;
      delete param.spec_items[i].online_sup_code;
      delete param.spec_items[i].online_sup_name;
      delete param.spec_items[i].pk_number;
      delete param.spec_items[i].set_combo;
      delete param.spec_items[i].source_cat_name;
      delete param.spec_items[i].source_type_keyword;
      delete param.spec_items[i].spec;
      delete param.spec_items[i].status;
      delete param.spec_items[i].timestamp;
      delete param.spec_items[i]._id;
      delete param.spec_items[i].master_img_url;
    }
    this.pm_temp = param;
    this.temporary = param;
    this.pm_modifylist = param.spec_items;
    this.pm_catecode = param.online_cat_code;
    this.pm_catename = param.online_cat_name;
  }
  // 点击 去掉某个多规格子商品
  delectitem(item, i) {
    this.pm_modifylist.splice(i, 1);
    this.dggitemtwo.specItems = this.pm_modifylist;
    this.pm_items.push(item); // 添加到 列表
  }
  // 添加到多规格
  modify_additem(param, j) {
    if (this.pm_modifylist.length > 5) {
      this.notification.create('error', '温馨提示', '最多添加六个子商品');
    } else {
      // delete param.lunch_box_fee;
      // delete param.m_desc;
      // // delete param.name;
      // const key = this.spec_name;
      // param[key] = '';
      // this.pm_modifylist.push(param); // 添加到多规格
      // if (this.pm_modifylist.spec_name) {
      //   this.pm_modifylist.spec_name = '';
      // }
      // for (let m = 0; m < this.pm_modifylist.length; m++) {
      //   delete this.pm_modifylist[m].lunch_box_fee;
      //   delete this.pm_modifylist[m].m_desc;
      // }
      // this.pm_items.splice(j, 1); // 从列表里面去掉!
      // this.sort = this.pm_modifylist.length;

      if (this.pm_modifylist.length >= 1) {
        if (param.bid == this.pm_modifylist[this.pm_modifylist.length - 1].bid) {
          this.notification.create('error', '温馨提示', '请勿重复添加商品');
        } else {
          this.pm_modifylist.push(param); // 添加到多规格
          this.pm_items.splice(j, 1);
        }
      } else {
        this.pm_modifylist.push(param); // 添加到多规格
        this.pm_items.splice(j, 1);
      }
    }
  }
  temp_arr: any;
  // 修改保存按钮
  pm_savespceitemtwo() {
    if (this.temporary.online_cat_code == this.pm_catecode) {
      this.dggitemtwo.category_code = this.pm_catecode;
      this.dggitemtwo.category_name = this.pm_catename;
    }
    this.dggitemtwo.name = this.temporary.m_desc;
    this.dggitemtwo.bid = this.temporary.bid;
    this.dggitemtwo.m_xsms = this.temporary.m_xsms;
    this.dggitemtwo.specItems = this.pm_modifylist;
    for (let j = 0; j <= this.pm_dggimg.length; j++) {
      if (this.pm_dggimg[j] && this.pm_dggimg[j].url) {
        this.pm_dggimg[j].remote_url = this.pm_dggimg[j].url;
        delete this.pm_dggimg[j].url;
      }
    }
    // this.dggitemtwo.imgs.push(this.imgsinfo);
    // let [ first ] = this.pm_dggimgs;
    // this.dggitemtwo.imgs.push(first);
    if (!this.imgsinfo) {
      this.dggitemtwo.imgs = this.pm_dggimg;
    } else {
      this.dggitemtwo.imgs = this.pm_dggimg;
      this.dggitemtwo.imgs.push(this.imgsinfo);
    }

    for (let i = 0; i < this.dggitemtwo.specItems.length; i++) {
      delete this.dggitemtwo.specItems[i].undefined;
      delete this.dggitemtwo.specItems[i].name;
    }
    this.temp_arr = this.dggitemtwo.specItems;
    this.dggitemtwo.specItems = [];
    this.temp_arr.forEach(item => {
      const opt = {
        code: item.code,
        barcode: item.barcode,
        bid: item.bid,
        spec_name: item.spec_name
      }
      this.dggitemtwo.specItems.push(opt);
    });
    if (this.dggitemtwo.name && this.dggitemtwo.category_code && this.dggitemtwo.category_name) {
      for (let i = 0; i < this.dggitemtwo.specItems.length; i++) {
        if (!this.dggitemtwo.specItems[i].spec_name) {
          this.notification.create('error', '温馨提示', '多规格子商品名称不能为空!');
          return false;
        }
      }
      if (this.dggitemtwo.specItems.length === 0) {
        this.notification.create('error', '温馨提示', '请添加商品');
      } else if (this.dggitemtwo.name.length > 10) {
        this.notification.create('error', '温馨提示', '商品名称不能大于10个字符');
      } else {
        this.http.saveSpceItem.request(this.dggitemtwo)
          .subscribe(res => {
            if (res['code'] == 0) {
              this.getItemList(this.params);
              this.notification.create('success', '温馨提示', '多规格商品修改成功');
              this.imgsinfo = '';
              this.dggitemtwo.imgs = [];
              this.searchitem.search.name = '';
              this.searchitem.search.code = '';
              this.searchitem.search.barcode = '';
              this.pm_dggimg = [];
              this.pm_dggimgs = [];

              this.pm_modify = false;
            } else {
              this.notification.create('error', '温馨提示', res['msg']);
            }
          });
      }
    } else {
      this.notification.create('error', '温馨提示', '红色星号* 为必填项');
    }

  }
  // 删除多规格
  pm_deldgg(param) {
    this.modalService.confirm({
      nzTitle: '温馨提示',
      nzContent: '是否确定删除多规格商品',
      nzOnOk: () => {
        const opt = {
          code: param.code,
          barcode: param.barcode,
          bid: param.bid
        };
        this.http.delSpecItem.request(opt)
          .subscribe(res => {
            this.notification.create('success', '温馨提示', res['msg']);
            if (res['code'] === 0) {
              this.getItemList(this.params);
            }
          });
      }
    });
  }
  isVisible = false;
  isConfirmLoading = false;
  dgg_goods: any = {
    barcode: '',
    base_uom_name: '',
    bid: '',
    brand_name: '',
    code: '',
  };
  gotoeditdgggoods(bid) {// 打开商品详细对话框
    this.isVisible = true;
    bid = String(bid);
    this.http.getGoods.request({ bid: bid })
      .subscribe(dgg_goods => {
        this.dgg_goods = dgg_goods;
        // if (dgg_goods.m_desc) {
        //   this.dgg_goods = dgg_goods;
        // } else {
        //   dgg_goods.m_desc = '';
        //   this.dgg_goods = dgg_goods;
        // }
        if (this.dgg_goods.psyq) {
          this.checkOptionspsyqs = [
            // { label: '易碎', value: '1', sfxz: false },
            { label: '液体', value: '2', sfxz: false },
            { label: '处方药', value: '3', sfxz: false },
          ];
          this.psyqstorage = this.dgg_goods.psyq.storage_type;
          for (let i = 0; i < this.checkOptionspsyqs.length; i++) {
            for (let j = 0; j < this.dgg_goods.psyq.type.length; j++) {
              if (this.checkOptionspsyqs[i].value === this.dgg_goods.psyq.type[j]) {
                this.checkOptionspsyqs[i].sfxz = true;
              }
            }
          }
        } else {
          this.checkOptionspsyqs = [
            // { label: '易碎', value: '1', sfxz: false },
            { label: '液体', value: '2', sfxz: false },
            { label: '处方药', value: '3', sfxz: false },
          ];
          this.psyqstorage = '';
          this.selectedco = [];
        }

        if (!this.dgg_goods.is_fresh) {
          this.dgg_goods['is_fresh'] = false;
        }
        if (!this.dgg_goods.is_food) {
          this.dgg_goods['is_food'] = false;
        }
        // this.price = goods.dwzhxs * goods.erp_price;
        // 获取二级分类
        const online_sup_code = dgg_goods['online_sup_code'];
        this.http.getSubOnlineCategories.request(online_sup_code)
          .subscribe(categories => {
            this.msubCategories = categories;
          });
      });
    this.http.getItemFiles.request({ bid: bid })
      .subscribe(imgs => {
        this.imgs = imgs;
      });
  }
  handleOk = (e) => {
    this.isConfirmLoading = true;
    setTimeout(() => {
      this.isVisible = false;
      this.isConfirmLoading = false;
    }, 3000);
  }
  handleCancel = (e) => {
    this.isVisible = false;
  }
  updatedggGoods(goods: any, imgs: any): void {// 修改商品资料保存
    // this.isVisible = false;
    goods.imgs = imgs;
    const psyq = {
      storage_type: this.psyqstorage,
      type: this.selectedco
    };
    goods.psyq = psyq;
    if (this.goods.picture_detail && this.goods.picture_detail.length) {
      goods.picture_detail = this.goods.picture_detail;
    }
    if (goods.online_cat_code === '' && this.msubCategories && this.msubCategories.length > 0) {
      this.notification.create('error', '温馨提示', '请选择线上品类的二级分类！');
    } else {
      this.http.updateGoods.request(goods)
        .subscribe(tip => {
          this.tip = tip;
          this.modalstatus = false;
          this.notification.create('success', '温馨提示', this.tip.msg);
          this.getItemList(this.params);
          setTimeout(() => {
            this.isVisible = false;
            this.isConfirmLoading = false;
          }, 2000);
        });
    }

  }
}
