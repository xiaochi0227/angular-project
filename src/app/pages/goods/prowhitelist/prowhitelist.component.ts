import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Authbts, Whetherdisplay, GMTToStr } from 'src/app/validates/validates';
import { HttpService } from 'src/app/http/http.service';
import { DatePipe } from '@angular/common';
import { BaseParams } from 'src/app/utils/base.list.params';
import { UploadResult } from 'src/app/sharecomponets/upload/upload.component';
import { PublicService } from 'src/app/services/public.service';
import { NzNotificationService, NzModalService } from 'ng-zorro-antd';
@Component({
  templateUrl: './prowhitelist.html',
  styleUrls: ['./prowhitelist.less']
})
export class ProwhitelistComponent implements OnInit {
  params: BaseParams = {
    search: {
      code: '',
      name: '',
      barcode: '',
      status: '',
      source_type_keyword: '',
      is_base: '',
      is_price: '',
      is_stock: ''
    },
    page_size: 50,
    page_no: 1,
    sort: 'timestamp',
    sortDirKey: 'DESC'
  };
  btns: any;
  xzmbbt = true;
  dcdcsvwj = true;
  spbmddr = true;
  pageSize =
    {
      totalPage: 0,
      count: 0
    };

  cow: number;
  whitelists: any;
  changecount: any;
  bmd: any;
  results: any;
  _test: any;
  set test(a) {
    this.test = a;
  }
  get test(): any {
    return this._test;
  }

  constructor(private route: ActivatedRoute, private http: HttpService, private publicservice: PublicService, private notification: NzNotificationService, private modalService: NzModalService) {
    this.notification.config({
      nzPlacement: 'topRight'
    });
  }

  ngOnInit() {
    this.btns = Authbts('商品管理', '商品白名单');
    // console.log(this.btns);
    this.xzmbbt = Whetherdisplay(this.btns, '下载模板');
    this.dcdcsvwj = Whetherdisplay(this.btns, '导出到CSV文件');
    this.spbmddr = Whetherdisplay(this.btns, '商品白名单导入');
    this.getwhiteList(this.params);

  }
  // 输入条件查询方法
  search(paramsoption) {
    paramsoption.page_no = 1;
    this.getwhiteList(paramsoption);
  }



  // 接收翻页操作传过来的值，然后请求服务得到新数据
  childparams($event) {
    const childoption = $event;
    this.params.page_no = childoption.page_no;
    this.cow = (childoption.page_no - 1) * childoption.page_size;
    this.getwhiteList(childoption);

  }

  // 商品白名单列表
  getwhiteList(params): void {
    this.cow = (params.page_no - 1) * params.page_size;
    this.http.getwhiteList.request(params)
      .subscribe(whitelists => {
        this.whitelists = whitelists['data']['rows'];
        this.pageSize.count = whitelists['data']['count'];
        this.changecount = whitelists['data']['count'];
      });
  }

  // 商品白名单导入
  onlineInput(file: HTMLInputElement): void {
    this.importtip = true;
    const form = new FormData();
    form.append('file', file.files[0], file.files[0].name);
    this.http.onlineinput.request(form)
      .subscribe(data => {
        if (data) {
          this.results = data;
        }
      });
  }

  // 移除白名单
  delWhite(barcode: string, code: string, status: string) {
    console.log(status);
    if (status === '1') {
      console.log(111);
      this.modalService.confirm({
        nzTitle: '温馨提示',
        nzContent: '您确认要将该商品移除白名单吗？移除后该商品在商品资料中将变为停售',
        nzOnOk: () => {
          this.bmd = {
            barcode: barcode,
            code: code,
            status: status
          };
          this.http.delWhite.request(this.bmd)
            .subscribe(tip => {
              this.notification.create('success', '温馨提示', tip['data']['msg']);
              this.getwhiteList(this.params);
            });
        }
      });
    } else {
      this.modalService.confirm({
        nzTitle: '温馨提示',
        nzContent: '您确认要将该商品恢复到白名单吗？恢复后该商品在商品资料中将变为售卖',
        nzOnOk: () => {
          this.bmd = {
            barcode: barcode,
            code: code,
            status: status
          };
          this.http.delWhite.request(this.bmd)
            .subscribe(tip => {
              this.notification.create('success', '温馨提示', tip['data']['msg']);
              this.getwhiteList(this.params);
            });
        }
      });
    }

  }

  // 下载模板
  download = filename => this.publicservice.publicdownload(filename);

  // 重置
  Reset() {
    console.log(this.test);
    this.params.search = {
      code: '',
      name: '',
      barcode: '',
      status: '',
      is_base: '',
      is_price: '',
      is_stock: ''
    };

  }



  //
  addexport() {
    let exportname: any, name: any, code: any, barcode: any, status: any;
    if (this.params.search.name) { name = this.params.search.name + '-'; } else { name = ''; }
    if (this.params.search.code) { code = this.params.search.code + '-'; } else { code = ''; }
    if (this.params.search.barcode) { barcode = this.params.search.barcode + '-'; } else { barcode = ''; }
    if (this.params.search.status === '1') { status = '启用' + '-'; } else if (this.params.search.status === '-1') { status = '停用' + '-'; } else { status = '' }
    exportname = name + code + barcode + status;

    let parame = {
      'path': '/test-goods-bsp/bsp/itemBase/whiteList',
      'search': {
        'code': '',
        'name': '',
        'barcode': '',
        'status': ''
      },
      'desc': exportname + '商品白名单',
      'sort': 'code',
      'sortDirKey': 'DESC',
      'export_columns': [
        { 'name': '商品编码', 'key': 'code' },
        { 'name': '商品条码', 'key': 'barcode' },
        { 'name': '商品名称', 'key': 'name' },
        // { 'name': 'ERP来源', 'key': 'source_type_keyword' },
        { 'name': '是否有主档', 'key': 'is_base' },
        { 'name': '是否有价格', 'key': 'is_price' },
        { 'name': '是否有库存', 'key': 'is_stock' },
        { 'name': '同步时间', 'key': 'timestamp' }

      ]

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
  importtip: boolean = false;
  closeimportip() {
    this.importtip = false;
  }

  // 白名单导入
  uploaded(result: UploadResult) {
    console.log(result);
    this.test = result;
    const sucopt = {
      filename: result.fileName,
      channel: '',
      storesobj: '',
      key: result.key,
      local_url: 'images-m-glory.oss-cn-hangzhou-internal.aliyuncs.com/' + result.key,
      remote_url: 'http://images-m-glory.oss-cn-hangzhou.aliyuncs.com/' + result.key
    };

    this.http.onlineinput.request(sucopt)
      .subscribe(data => {
        console.log(data);
        if (data) {
          this.importtip = true;
          this.results = data;
        }

      });
  }
}
