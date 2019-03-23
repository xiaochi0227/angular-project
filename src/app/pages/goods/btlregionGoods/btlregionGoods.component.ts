import { Component, Input, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { log } from 'util';
import { BaseParams } from 'src/app/models';
import { HttpService } from 'src/app/http/http.service';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  templateUrl: './btlregionGoods.html',
  styleUrls: ['./btlregionGoods.less']
})
export class BtlRegionGoods implements OnInit {
  itemRegion: BaseParams = {
    search: {
      region_code: '',
      region_name: '',
      item_code: '',
      item_name: '',
      barcode: '',
      status: '1',
      channel_keyword: '',
      online_channel: '',
      receive_price: '',
      receive_stock: '',
      sale_status: '',
      online_sup_code: '',
      online_cat_code: '',
      start_money: '',
      end_money: '',
      img: false,
      onlinechannel: '',
      manual_onoffline: false

    },
    page_size: 50,
    page_no: 1,
    sort: 'timestamp',
    sortDirKey: 'DESC'
  };
  firstCategories: any;
  subCategories: any;
  itemRegionCount: any =
    {
      totalPage: 0,
      count: 0
    };
  stores: any;

  store_code: any;
  itemRegions: any;
  cow: number;
  channelss: any[];
  changecount: any = 0;
  itemRegionarr: any[] = [];
  userrights: any;
  userentid: any;
  usercode: any;
  modalwidth: number; // 弹出框宽度
  templeteobj: any; // 提示templete
  modaltitle: string; // 弹出框title
  modalstatus: boolean; // 弹出框状态
  modalconfirloading: boolean; // 弹出框提交loading
  confirmisshow: boolean; // 弹出框是否显示确认按钮
  constructor(private router: Router, private http: HttpService, private notification: NzNotificationService) {
    let localuser = window.localStorage.getItem('userinfo');
    this.userrights = JSON.parse(localuser);
    this.userentid = this.userrights.ent_id;
    this.usercode = this.userrights.code;
    this.notification.config({
      nzPlacement: 'topRight'
    });
  }

  // 接收翻页操作传过来的值，然后请求服务得到新数据
  childparams($event) {
    let childoption = $event;
    this.itemRegion.page_no = childoption.page_no;
    this.cow = (childoption.page_no - 1) * childoption.page_size;
    this.getItemRegions(childoption);
  }

  ngOnInit(): void {
    // 获取线上一级分类
    this.http.getFirstOnlineCategories.request({ parent: 0 })
      .subscribe(categories => {
        this.firstCategories = categories['data'];
      });
    // 获取第一个门店
    this.http.getStorelist.request()
      .subscribe(stores => {
        this.stores = stores['data'];
        if (stores[0]) {
          this.itemRegion.search.region_code = stores[0].code;
        }
        this.getItemRegions(this.itemRegion);

      });
    this.getchannelss();
  }

  // 获取渠道
  getchannelss(): void {
    this.http.getischannels.request({})
      .subscribe(channels => {
        this.channelss = channels['data']['rows'];
      });
  }

  // 输入条件查询方法
  search(paramsoption) {
    paramsoption.page_no = 1;
    this.getItemRegions(paramsoption);
  }

  // 获取列表
  getItemRegions(param) {
    this.cow = (param.page_no - 1) * param.page_size;
    this.http.getitemregionerp.request(param)
      .subscribe(itemRegions => {
        this.itemRegions = itemRegions['data']['rows']; // 获取到的列表数据
        this.itemRegionarr = this.itemRegions;
        this.itemRegionCount.count = itemRegions['data']['count']; // 获取到的总记录数
        this.changecount = itemRegions['data']['count'];
        for (let i = 0; i < this.itemRegionarr.length; i++) {
          this.itemRegionarr[i].sfxz = false;
        }
      });
  }

  addexport() {
    let exportname: any, item_name: any, item_code: any, barcode: any, region_code: any, status: any, online_sup_code: any, online_cat_cod: any, online_channel: any, sale_status: any;
    if (this.itemRegion.search.item_name) { item_name = this.itemRegion.search.item_name + '-'; } else { item_name = ''; }
    if (this.itemRegion.search.item_code) { item_code = this.itemRegion.search.item_code + '-'; } else { item_code = ''; }
    if (this.itemRegion.search.barcode) { barcode = this.itemRegion.search.barcode + '-'; } else { barcode = ''; }
    if (this.itemRegion.search.status === '1') { status = '售卖' + '-'; } else if (this.itemRegion.search.status === '-1') { status = '停售' + '-'; }
    if (this.itemRegion.search.sale_status === '1') { sale_status = '上架' + '-'; } else if (this.itemRegion.search.sale_status === '2') { sale_status = '下架' + '-'; } else { sale_status = ''; }
    if (this.itemRegion.search.region_code) { region_code = this.itemRegion.search.region_code + '-'; } else { region_code = ''; }
    if (this.itemRegion.search.online_sup_code) { online_sup_code = this.itemRegion.search.online_sup_code + '-'; } else { online_sup_code = ''; }
    if (this.itemRegion.search.online_cat_cod) { online_cat_cod = this.itemRegion.search.online_cat_cod + '-'; } else { online_cat_cod = ''; }
    if (this.itemRegion.search.online_channel) { online_channel = this.itemRegion.search.online_channel + '-'; } else { online_channel = ''; }
    exportname = region_code + status + sale_status + online_sup_code + online_cat_cod + online_channel;
    let parame = {
      'path': '/bsp/itemRegionErp/getitemregionerp',
      'search': {
        'region_code': '',
      },
      'desc': exportname + '线下门店商品',
      'sort': 'code',
      'sortDirKey': 'DESC',
      'export_columns': [
        { 'name': '门店编码', 'key': 'region_code' },
        { 'name': '门店名称', 'key': 'region_name' },
        { 'name': '商品编码', 'key': 'item_code' },
        { 'name': '商品条码', 'key': 'barcode' },
        { 'name': '商品名称', 'key': 'item_name' },
        { 'name': '线下规格', 'key': 'spec' },
        { 'name': '原价', 'key': 'erp_price' },
        { 'name': '现价', 'key': 'erp_reference_price' },
        { 'name': '会员价', 'key': 'vip_price' },
        { 'name': '线下类别', 'key': 'source_cat_name' },
        { 'name': '售卖状态', 'key': 'status1' },
        // { 'name': '百度外卖', 'key': 'bdwm_out_key' },
        // { 'name': '美团外卖', 'key': 'mtwm_out_key' },
        // { 'name': '京东到家', 'key': 'jddj_out_key' },
        // { 'name': '饿了么', 'key': 'elem_out_key' },
        { 'name': '轻松购', 'key': 'qsg_out_key' },
        { 'name': '饿百零售', 'key': 'ebls_out_key' },
        { 'name': 'PLU码', 'key': 'plu_code' }

      ],
      'ent_id': this.userentid,
      'code': this.usercode

    }
    parame.search = this.itemRegion.search;
    this.http.addexport.request(parame)
      .subscribe(row => {

        if (row) {
          this.notification.create('success', '温馨提示', row['msg']);
        } else {
          this.notification.create('error', '温馨提示', '添加失败,请重试！');
        }

      });
  }

  goods: any;
  prodetails(proobj) {
    this.goods = proobj;
    this.modalwidth = 800;
    this.modaltitle = '商品详情';
    this.modalstatus = true;
    this.confirmisshow = false;
  }
  closemodal() { // 关闭弹出框时重置modalstatus默认值
    this.modalstatus = false;
  }

  itemregionlogs: any;
  getitemregionlogs(item) {
    this.modalwidth = 800;
    this.modaltitle = '门店商品日志';
    this.modalstatus = true;
    this.confirmisshow = false;
    this.http.getitemregionlogs.request(item)
      .subscribe(itemregionlogs => {
        // console.log(itemregionlogs);

        if (itemregionlogs['msg']) {
          this.notification.create('success', '温馨提示', itemregionlogs['msg']);
        } else {
          this.itemregionlogs = itemregionlogs;
        }
      });
  }

  // 渠道日志
  channelloginfos: any;
  items: any;
  focusIndex: any;
  islog: boolean = false;
  getchannellogsinfos(item) {
    this.modalwidth = 800;
    this.modaltitle = '渠道日志';
    this.modalstatus = true;
    this.confirmisshow = false;
    this.focusIndex = item.onlinechannel[0];
    this.items = item;
    let channel_keyword = '';
    console.log(this.channelss);

    for (let i = 0; i < this.channelss.length; i++) {
      if (item.onlinechannel[0] === this.channelss[i].name) {
        channel_keyword = this.channelss[i]['channel_keyword'];
      }
    }

    let params = {
      'barcode': item.barcode,
      'item_code': item.item_code,
      'region_code': item.region_code,
      'channel_keyword': channel_keyword.toLowerCase(),
      'ent_id': item.ent_id
    };
    this.http.getItemRegionLog.request(params)
      .subscribe(res => {
        if (res['msg']) {
          this.islog = true;
        } else {
          this.islog = false;
          this.channelloginfos = res['data'] || [];
        }
      });
  }

  hidesearch: boolean = false;
  j: number = 0;
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
  Reset() {

  }
  handleokfun(e) {

  }
}
