import { Component, Input, OnInit } from '@angular/core';
import { BaseParams } from 'src/app/utils/base.list.params';
import { Whetherdisplay, Authbts } from 'src/app/validates/validates';
import { HttpService } from 'src/app/http/http.service';
import { PublicService } from 'src/app/services/public.service';
import { NzNotificationService } from 'ng-zorro-antd';


@Component({
  templateUrl: './problacklist.html',
  styleUrls: ['./problacklist.less']
})
export class ProBlackListComponent implements OnInit {
  @Input()
  params: BaseParams = {
    search: {
      code: '',
      channel_keyword: '',
      name: '',
      barcode: '',
      status: '',
      online_sup_code: '',
      online_cat_code: ''
    },
    page_size: 50,
    page_no: 1,
    sort: 'timestamp',
    sortDirKey: 'DESC'
  };
  channels: any[];
  pageSize =
    {
      totalPage: 0,
      count: 0
    };

  cow: number;
  blacklists: any;
  bmd: any;
  loadingimg = false;
  results: any;

  btns: any;
  xzmbbt = true;
  dcdcsvwj = true;
  qdhmddr = true;
  ychhqdhmd = true;
  firstCategories: any;
  subCategories: any;
  constructor(private http: HttpService, private publicservice: PublicService, private notification: NzNotificationService) {
    this.notification.config({
      nzPlacement: 'topRight'
    });
  }

  ngOnInit(): void {
    this.btns = Authbts('商品管理', '渠道黑名单');
    // console.log(this.btns);
    this.xzmbbt = Whetherdisplay(this.btns, '下载模板');
    this.dcdcsvwj = Whetherdisplay(this.btns, '导出到CSV文件');
    this.qdhmddr = Whetherdisplay(this.btns, '渠道黑名单导入');
    this.ychhqdhmd = Whetherdisplay(this.btns, '移除渠道黑名单') || Whetherdisplay(this.btns, '恢复渠道黑名单');
    this.getchannels();
    this.http.getFirstOnlineCategories.request({ parent: 0 })
      .subscribe(categories => {
        this.firstCategories = categories['data']['rows'];
      });
    this.getproblackList(this.params);
  }
  // 输入条件查询方法
  search(paramsoption) {
    paramsoption.page_no = 1;
    this.getproblackList(paramsoption);
  }
  getSubOnlineCategories(code: String, name: String) {
    this.subCategories = [];
    this.params.search.online_cat_code = '';
    // console.log(name);
    this.http.getSubOnlineCategories.request({ parent: code })
      .subscribe(categories => {
        // console.log(categories);
        this.subCategories = categories['data'];
        if (this.subCategories && this.subCategories.length > 0) {
          this.params.search.online_cat_code = this.subCategories[0].code;
        } else {
          this.params.search.online_cat_code = '';
        }
      });
  }
  // 渠道黑名单导入
  channelblackInput(file: HTMLInputElement): void {
    this.loadingimg = true;
    this.importtip = true;
    const form = new FormData();
    form.append('file', file.files[0], file.files[0].name);
    this.http.channelblackInput.request(form)
      .subscribe(data => {
        if (data) {
          this.loadingimg = false;
          this.results = data;
        }
      });
    file.value = '';
  }
  // 渠道黑名单状态变化
  delblack(blacklist: any) {
    this.http.delblack.request(blacklist)
      .subscribe(tip => {
        this.notification.create('success', '温馨提示', tip['msg']);
        this.getproblackList(this.params);
      });
  }
  // 接收翻页操作传过来的值，然后请求服务得到新数据
  childparams($event) {
    const childoption = $event;
    this.params.page_no = childoption.page_no;
    this.cow = (childoption.page_no - 1) * childoption.page_size;
    this.getproblackList(childoption);

  }
  changecount: any;
  // 商品白名单列表
  getproblackList(param): void {
    this.cow = (param.page_no - 1) * param.page_size;
    this.http.getproblackList.request(param)
      .subscribe(blacklists => {
        this.blacklists = blacklists['data']['rows'];
        this.pageSize.count = blacklists['data']['count'];
        this.changecount = blacklists['data']['count'];
      });
  }
  // 获取渠道
  getchannels(): void {
    this.http.goodsGetchannels.request({})
      .subscribe(channels => {
        this.channels = channels['data']['rows'];

      }
      );
  }

  // 下载模板
  download = filename => this.publicservice.publicdownload(filename);
  // 重置
  Reset() {
    this.params.search.code = '';
    this.params.search.name = '';
    this.params.search.barcode = '';
    this.params.search.status = '';
    this.params.search.channel_keyword = '';
    this.params.search.online_sup_code = '';
    this.params.search.online_cat_code = '';
  }
  addexport() {
    let exportname: any, name: any, code: any, barcode: any, status: any, channel_keyword: any;
    if (this.params.search.name) { name = this.params.search.name + '-'; } else { name = ''; }
    if (this.params.search.code) { code = this.params.search.code + '-'; } else { code = ''; }
    if (this.params.search.barcode) { barcode = this.params.search.barcode + '-'; } else { barcode = ''; }
    if (this.params.search.status === '1') { status = '有效' + '-'; } else if (this.params.search.status === '-1') { status = '无效' + '-'; } else { status = '' }
    if (this.params.search.channel_keyword) { channel_keyword = this.params.search.channel_keyword + '-'; } else { channel_keyword = ''; }
    exportname = name + code + barcode + status + channel_keyword;

    let parame = {
      'path': '/bsp/bspmddata/item/getitemchannelblack',
      'search': {
        'code': '',
        'name': '',
        'barcode': '',
        'status': ''
      },
      'desc': exportname + '渠道黑名单',
      'sort': 'code',
      'sortDirKey': 'DESC',
      'export_columns': [
        { 'name': '商品编码', 'key': 'code' },
        { 'name': '商品条码', 'key': 'barcode' },
        { 'name': '商品名称', 'key': 'name' },
        { 'name': '渠道', 'key': 'channel_keyword' }

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
}
