import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
// import { BaseParams } from '../../../../entity/base.list.params';
import { Router, ActivatedRoute, Params } from '@angular/router';
// import { BtlBasicGoodsService } from './btlbasicGoods.service';
// import { PageComponent } from '../../../../theme/components/page';
import { FileUploader, FileItem } from 'ng2-file-upload';
// import { testUpload } from '../../../../../app/upload/test.upload';
// import { GetPolicyService } from '../../../../../app/upload/getpolicy.service';
// import { BtlmasterfilelogService } from '../../../logs/components/btlmasterfilelog/btlmasterfilelog.service';

import { Authbts, Whetherdisplay, GMTToStr } from 'src/app/validates/validates';
import { HttpService } from 'src/app/http/http.service';
import { DatePipe } from '@angular/common';
import { BaseParams } from 'src/app/utils/base.list.params';
import { testUpload } from 'src/app/utils/test.upload';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  templateUrl: './btlbasicGoods.html',
  styleUrls: ['./btlbasicGoods.less']
})
export class BtlBasicGoodsComponent implements OnInit {

  spzdrz: Boolean = true;
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
      norm: ''
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
  userinfo: any;
  changecount: any = 0;
  commodities: any;
  cow: number;
  constructor(private router: Router,
    private http: HttpService, private notification: NzNotificationService) {
    this.notification.config({
      nzPlacement: 'topRight'
    });
  }
  ngOnInit(): void {
    this.getItemList(this.params);
  }


  // 获取列表

  getItemList(param): void {
    this.cow = (param.page_no - 1) * param.page_size;
    // this.btlbasicGoodsService.getItemList(param)
    //   .then(commodities => {
    //     this.commodities = commodities.rows;
    //     this.pageSize.count = commodities.count;
    //     this.changecount = commodities.count;
    //     // console.log(this.pageSize.count);
    //   });
    this.http.getItemList.request(param)
    .subscribe(commodities => {
      this.commodities = commodities['data']['rows'];
      this.pageSize.count = commodities['data']['count'];
      this.changecount = commodities['data']['count'];
      // console.log(this.pageSize.count);
    });
  }

  // 接收翻页操作传过来的值，然后请求服务得到新数据
  childparams($event) {
    let childoption = $event;
    this.params.page_no = childoption.page_no;
    this.cow = (childoption.page_no - 1) * childoption.page_size;
    this.getItemList(childoption);
  }

  j: number = 0;
  hidesearch: boolean = false;
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

  search() {
    this.getItemList(this.params);
  }

  uploader: testUpload = new testUpload({
    url: 'http://images-m-glory.oss-cn-hangzhou.aliyuncs.com',
    method: 'POST'
  });

  policy: any;
  loadingimg: boolean = false;
  importtip: boolean = false;
  // 商品主档售卖状态导入
  results:any;
  itemBaseStatus(file): void {
    this.loadingimg = true;
    this.importtip = true;
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
          if (status == 200) {
            // 上传文件后获取服务器返回的数据
            let sucopt = {
              filename: filename,
              channel: '',
              storesobj: '',
              key: keyvalue,
              local_url: 'images-m-glory.oss-cn-hangzhou-internal.aliyuncs.com/' + keyvalue,
              remote_url: 'http://images-m-glory.oss-cn-hangzhou.aliyuncs.com/' + keyvalue
            };

            this.http.itemBaseStatus.request(sucopt)
              .subscribe(data => {
                if (data) {
                  this.loadingimg = false;
                  this.results = data;
                  // console.log(data);
                }
              });

          } else {
            this.notification.create('error', '温馨提示', '上传失败!');
            file.value = '';

            this.uploader.queue = [];
            // 上传文件后获取服务器返回的数据错误
          }
        };
        this.uploader.queue[0].withCredentials = false;
        this.uploader.queue[0].upload();
        file.value = '';
      } else {
        this.http.apiGetOSSPolicy.request()
          .subscribe(res => {
            if (res) {
              setTimeout(function () { this.policy = false; }, 250000);
            }
            this.policy = res;
            let keyvalue = this.policy.dir + 'files/' + Num + filename;
            // console.log(keyvalue);

            // console.log(res);
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
              if (status == 200) {
                // 上传文件后获取服务器返回的数据
                let sucopt = {
                  filename: filename,
                  channel: '',
                  storesobj: '',
                  key: keyvalue,
                  local_url: 'images-m-glory.oss-cn-hangzhou-internal.aliyuncs.com/' + keyvalue,
                  remote_url: 'http://images-m-glory.oss-cn-hangzhou.aliyuncs.com/' + keyvalue
                }


                this.http.itemBaseStatus.request(sucopt)
                  .subscribe(data => {
                    if (data) {
                      this.loadingimg = false;
                      this.results = data;
                      // console.log(data);
                    }
                  });


              } else {
                this.notification.create('error', '温馨提示', '上传失败!');
                file.value = '';
                this.uploader.queue = [];
                // 上传文件后获取服务器返回的数据错误
              }
            };
            this.uploader.queue[0].withCredentials = false;
            this.uploader.queue[0].upload();
            file.value = '';
          });
      }
    } else {
      this.notification.create('error', '温馨提示', '请检查后重试！')
    }

  }


  totaldiv1: boolean = false; // 操作日志模块
  itemlogs: any;
  totaldiv:Boolean = false;
  //  获取主档操作日志
  geItemLog(param): void {
    this.http.getitembaseerplog.request(param)
      .subscribe(itemlog => {
        if (itemlog['data']['msg']) {
          this.notification.create('success', '温馨提示', itemlog['data']['msg']);
        } else {
          this.itemlogs = itemlog['data'];
          this.totaldiv1 = true;
        }
      });
  }
  closediv1() {
    this.totaldiv1 = false;
  }
  closediv() {
    this.totaldiv = false;
  }

  addexport() {
    let exportname: any, code: any, name: any, barcode: any,
     status: any, source_type_keyword: any, online_sup_code: any, online_cat_cod: any
    if (this.params.search.code) { code = this.params.search.code + '-'; } else { code = ''; }
    if (this.params.search.name) { name = this.params.search.name + '-'; } else { name = ''; }
    if (this.params.search.barcode) { barcode = this.params.search.barcode + '-'; } else { barcode = ''; }
    if (this.params.search.status === '1') { status = '售卖' + '-'; } else { status = '停售' + '-'; }
    if (this.params.search.source_type_keyword) { source_type_keyword = this.params.search.source_type_keyword + '-'; }
      else { source_type_keyword = ''; }
    if (this.params.search.online_sup_code) { online_sup_code = this.params.search.online_sup_code + '-'; } else { online_sup_code = ''; }
    if (this.params.search.online_cat_cod) { online_cat_cod = this.params.search.online_cat_cod + '-'; } else { online_cat_cod = ''; }
    exportname = code + name + barcode + status + source_type_keyword + online_sup_code + online_cat_cod;
    let parame = {
      'path': '/bsp/itemErp/getitemerpbases',
      'search': {
        'code': '',
        'name': '',
        'barcode': ''
      },
      'desc': exportname + '线下商品资料',
      'sort': 'code',
      'sortDirKey': 'DESC',
      'export_columns': [
        { 'name': '来源', 'key': 'source_type_keyword' },
        { 'name': '商品编码', 'key': 'code' },
        { 'name': '商品条码', 'key': 'barcode' },
        { 'name': '线下名称', 'key': 'name' },
        { 'name': '线下规格', 'key': 'spec' },
        { 'name': '线下单位', 'key': 'base_uom_name' },
        { 'name': '线下重量', 'key': 'gross_weight' },
        { 'name': '下线分类', 'key': 'source_cat_name' },
        { 'name': '售卖状态', 'key': 'status' },
        { 'name': '单位转换系数', 'key': 'dwzhxs' },
        { 'name': '餐盒费', 'key': 'lunch_box_fee' },
        { 'name': '商品名称', 'key': 'item_name'},
        { 'name': '单位', 'key': 'uom_name'},
        { 'name': '是否牵牛花维护', 'key': 'testwh'},
        { 'name': '是否生鲜商品', 'key': 'is_fresh'},		// i s_fresh
        { 'name': '是否必卖', 'key': 'must_sale'},		// must_sale
        { 'name': '是否有图片', 'key': 'is_img'},	// is_img
        { 'name': '线下同步时间', 'key': 'timestamp' }

        // BUG：导出信息缺少：售卖状态、单位转换系数、线下同步时间


      ]
    };
    parame.search = this.params.search;
    this.http.addexport.request(parame)
      .subscribe(row => {
        this.notification.create('success', '温馨提示', row['msg']);
        // if (row) {
        //   alert(row.msg);
        // } else {
        //   alert('添加失败,请重试！');
        // }

      });


  }

  // 重置
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
    // this.getItemList(this.params);
  }

}

