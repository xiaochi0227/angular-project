import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BaseParams } from 'src/app/models';
import { HttpService } from 'src/app/http/http.service';
import { UploadResult } from 'src/app/sharecomponets/upload/upload.component';
import { PublicService } from 'src/app/services/public.service';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  templateUrl: './shoppingbag.html',
  styleUrls: ['./shoppingbag.less']
})

export class Shoppingbag implements OnInit {
  hidesearch = false;
  j = 0;
  totaldiv = false;
  baglist: any;
  // 请求参数

  params: BaseParams = {
    search: {
      region_code: '',
      storecode: '',
      barcode: '',
      bagcode: '',
      item_code: '',   // 商品编码
    },
    page_size: 50,
    page_no: 1,
    sort: 'begin_date',
    sortDirKey: 'desc'
  };
  storeList: any = [];
  userrights: any;
  userentid: any;
  usercode: any;
  selectedtab: any;
  new_results: any;
  templeteobj: any;// 提示templete
  constructor(private http: HttpService, private publicservice: PublicService, private notification: NzNotificationService) {
    let localuser = window.localStorage.getItem('userinfo');
    this.userrights = JSON.parse(localuser);

    this.userentid = this.userrights.ent_id;
    this.usercode = this.userrights.code;
    this.notification.config({
      nzPlacement: 'topRight'
    });
  }

  ngOnInit(): void {
    this.selectedtab = 0;
    this.queryBag(this.params);
    this.getStoreCode();

  }

  // 获取列表
  queryBag(params) {
    this.http.queryBag.request(params)
      .subscribe(bag => {
        if (bag['code'] === '010001000') {
          this.baglist = bag['data']['rows'];
          this.baglist = this.baglist.slice();
          console.log(this.baglist);
        }
      });
  }
  queryBagxs(params) {
    this.http.queryOnlineBag.request(params)
      .subscribe(bag => {
        if (bag['code'] === '010001000') {
          this.baglist = bag['data']['rows'];
          this.baglist = this.baglist.slice();
          console.log(this.baglist);
        }
      });
  }
  // 分页
  cow: number = 0;


  // 搜索查询
  searchInfo(i) {
    if (i === 1) {
      this.queryBagxs(this.params);
    } else {
      this.queryBag(this.params);
    }

  }
  search(i) {
    if (i === 1) {
      this.selectedtab = 1;
      this.searchInfo(1);
    } else {
      this.selectedtab = 0;
      this.searchInfo(0);
    }

  }
  // 查询条件
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
    this.params.search.bagcode = '';
    this.params.search.item_code = '';
    this.params.search.region_code = '';
    this.params.search.barcode = '';
    this.queryBag(this.params);
  }

  searchcode($event) {
    this.params.search.region_code = $event;

  }
  stores: any;
  getStoreCode() {
    // 获取第一个门店
    this.http.getStorelist.request()
      .subscribe(stores => {
        this.stores = stores['data'];
      });
  }

  editAllRegion() {
    this.totaldiv = true;
  }


  // 导出
  addexport() {
    let exportname: any, item_name: any, item_code: any, barcode: any, region_code: any;
    exportname = region_code;
    let parame = {
      'path': '/test-goods-bsp/bsp/shoppingBag/queryOfflineBag',
      'search': {},
      'desc': this.params.search.region_code + '购物袋',
      'sort': 'code',
      'sortDirKey': 'DESC',
      'export_columns': [
        { 'name': '门店编码', 'key': 'region_code' },
        { 'name': '门店名称', 'key': 'region_name' },
        { 'name': '购物袋编码', 'key': 'bag_type' },
        { 'name': '商品编码', 'key': 'item_code' },
        { 'name': '商品条码', 'key': 'barcode' },
        { 'name': '商品名称', 'key': 'item_name' },
        { 'name': '修改时间', 'key': 'bag_time' }

      ],
      'ent_id': this.userentid,
      'code': this.usercode
    };
    if (this.selectedtab === 1) {
      parame.path = '/test-goods-bsp/bsp/bag/queryOnlineBag';
      parame.desc = this.params.search.region_code + '线上购物袋';
    } else {
      parame.path = '/test-goods-bsp/bsp/shoppingBag/queryOfflineBag';
      parame.desc = this.params.search.region_code + '线下购物袋';
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

  uploaderopt: any;
  // 上传图片
  optobj: any = {
    url: '',
    method: 'POST',
    additionalParameter: {
      name: '',
      key: '',
      policy: '',
      OSSAccessKeyId: '',
      success_action_status: '',
      signature: ''
    }
  };



  //  导入
  results: any;
  importTag = (result: UploadResult): void => {

    let sucopt = {
      filename: result.fileName,
      key: result.key,
      local_url: result.localUrl,
      remote_url: result.remoteUrl,
      type: ''
    };
    if (this.selectedtab === 1) {
      sucopt.type = 'item_region';
    } else {
      sucopt.type = 'item_region_erp';
    }
    this.http.importTag.request(sucopt)
      .subscribe(data => {
        if (data) {
          this.results = data;
          this.createBasicNotification(this.templeteobj);
        }
      });
  }

  download = filename => this.publicservice.publicdownload(filename);


  // 导入提示
  createBasicNotification(template: TemplateRef<{}>): void {
    this.notification.template(template, { nzDuration: 0 });
  }

  gettemplate(templete) {
    this.templeteobj = templete;
  }

}
