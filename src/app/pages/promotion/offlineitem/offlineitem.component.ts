

import { Component, OnInit, Injector } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Authbts, Whetherdisplay, GMTToStr } from './../../../validates/validates';
import { HttpService } from 'src/app/http/http.service'; // 导入所用接口
import { BreadcrumbService } from 'src/app/services/breadcrumb.service'; // 面包屑导航
import { NzModalRef, NzModalService, NzNotificationService } from 'ng-zorro-antd'; // 对话框

@Component({
  selector: 'app-offlineitem',
  templateUrl: './offlineitem.html',
  styleUrls: ['./offlineitem.less']
})

export class OfflineitemComponent implements OnInit {


  // 获取接口服务
  constructor(public router: Router, private http: HttpService, public activatedRoute: ActivatedRoute,
    private modalService: NzModalService, private notification: NzNotificationService) {
    this.notification.config({
      nzPlacement: 'topRight'
    });
  }


  hidesearch: Boolean = false;
  j = 0;
  totaldiv: Boolean = false;
  singleitemlist: any;  // 列表数据

  // 请求参数
  params = {
    search: {
      pd_code: "", // 活动编码
      storecode: "",
      barcode: "",
      item_code: "", // 商品编码
      status: "", // 活动状态  值为1表示审核通过；值为-1表示取消
      channel: "", // 活动渠道
      begin_date: "", // 开始时间 日期后追加 00:00:01
      end_date: "" // 结束时间 日期后追加 23:59:59  两个时间需要同时填写或者都不填
    },
    page_size: 50,
    page_no: 1,
    sort: 'begin_date',
    sortDirKey: 'desc'
  };
  stores: any; // 门店
  channels: any[]; // 渠道
  _startDate = null;  // 开始时间
  _endDate = null;  // 结束时间
  // 翻页参数
  public pageSize: any = {
    totalPage: 0,
    count: 0
  };
  pd_code: any; // 活动编号

  ngOnInit(): void {
    // this._startDate = new Date(Date.now() - 3600 * 24 * 1000);
    // this._endDate = new Date(Date.now() - 3600 * 24 * 1000);
    // this.params.search.begin_date = GMTToStr(this._startDate);
    // this.params.search.end_date = GMTToStr(this._endDate);
    // 获取门店
    this.http.getStorelist.request()
      .subscribe(stores => {
        this.stores = stores;
      });

    // 获取渠道
    this.http.getChannels.request({ 'ebls_split': true })
      .subscribe(channels => {
        console.log(channels);
        this.channels = channels['rows'];
      });

    this.getSinglepromoteList(this.params);

  }

  // 获取列表
  getSinglepromoteList(params) {
    this.http.singlepromotelist.request(params)
      .subscribe(singleitem => {
        this.singleitemlist = singleitem['rows'];
        this.pageSize.count = singleitem['count'];
      });
  }


  // 搜索查询
  searchInfo() {
    this.params.page_no = 1;
    this.getSinglepromoteList(this.params);
  }


  // 展开更多
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


  // 重置
  Reset() {
    this.params.search = {
      pd_code: '', // 活动编码
      storecode: '',
      barcode: '',
      item_code: '', // 商品编码
      status: '', // 活动状态  值为1表示审核通过；值为-1表示取消
      channel: '', // 活动渠道
      begin_date: '', // 开始时间 日期后追加 00:00:01
      end_date: '' // 结束时间 日期后追加 23:59:59  两个时间需要同时填写或者都不填
    };
    this._startDate = '';
    this._endDate = '';
    // this._startDate = new Date(Date.now() - 3600 * 24 * 1000);
    // this._endDate = new Date(Date.now() - 3600 * 24 * 1000);
    // this.params.search.begin_date = GMTToStr(this._startDate);
    // this.params.search.end_date = GMTToStr(this._endDate);
    //   this.getSinglepromoteList(this.params);
  }


  // 日期控件
  startchange(event) {
    this._startDate = event;
    this.params.search.begin_date = GMTToStr(event) + ' 00:00:00';
  }

  endchange(event) {
    this._endDate = event;
    this.params.search.end_date = GMTToStr(event) + ' 23:59:59';
  }



  // 接收翻页操作传过来的值，然后请求服务得到新数据
  childparams($event) {
    const childoption = $event;
    this.params.page_no = childoption.page_no;
    this.getSinglepromoteList(this.params);
  }


  // 批量修改活动商品状态
  editAllRegion(component) {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: '批量修改活动商品状态',
      nzContent: component,
      nzWidth: '520',
      nzOnOk: () => {
        if (this.pd_code === '') {
          this.notification.create('error', '温馨提示', '请输入活动编码');
          return false;

        } else {
          this.http.updPromotionStateUrl.request({ pd_code: this.pd_code })
            .subscribe(res => {

              if (res['code'] === 0) {
                this.notification.create('success', '温馨提示', res['msg']);
                this.getSinglepromoteList(this.params);

              } else {
                this.notification.create('error', '温馨提示', res['msg']);
              }
            });
        }
      }
    });
    modal.afterOpen.subscribe(() => {   // 打开对话框回调
      // 清除缓存
      this.pd_code = '';
    });
  }


  // 单个修改活动商品状态
  updItemState(data) {
    this.modalService.confirm({
      nzTitle: '温馨提示',
      nzContent: '是否确认操作？',
      nzOnOk: () => {
        this.http.updItemStateUrl.request({
          barcode: data.barcode,
          item_code: data.item_code,
          pd_code: data.pd_code
        })
          .subscribe(res => {

            if (res['code'] === 0) {
              this.notification.create('success', '温馨提示', res['msg']);
              this.getSinglepromoteList(this.params);

            } else {
              this.notification.create('error', '温馨提示', res['msg']);
            }
          });
      }
    });

  }

}
