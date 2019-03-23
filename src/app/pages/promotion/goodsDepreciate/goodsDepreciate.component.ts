

import { Component, OnInit, Injector } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NGXLogger } from 'ngx-logger'; // 控制台输出 this.logger
import { Authbts, Whetherdisplay, GMTToStr } from './../../../validates/validates';
import { HttpService } from 'src/app/http/http.service';    // 导入所用接口
import { BreadcrumbService } from 'src/app/services/breadcrumb.service';
import { NzNotificationService, NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'app-goodsdepreciate',
  templateUrl: './goodsDepreciate.component.html',
  styleUrls: ['./goodsDepreciate.component.less']
})

export class GoodsDepreciateComponent implements OnInit {

  pd_code: any = '';
  onlinelist: any = []; // 活动列表
  dateTime: any = [];
  ranges = {
    '今天': [new Date(), new Date()],
  };

  // 翻页参数
  public pageSize: any = {
    totalPage: 0,
    count: 0
  };

  // 查询参数
  params = {
    search: {
      pd_code: '',
      pd_name: '',
      promotion_channel: '',
      begin_date: '',
      end_date: '',
      user_type: '',
      data_status: ''
    },
    page_no: 1,
    page_size: 50,
    sort: 'region_code',
    sortDirKey: 'ASC'
  };
  isVisible: Boolean = false;

  // 获取接口服务
  constructor(public router: Router, private route: ActivatedRoute, private logger: NGXLogger,
    private http: HttpService, public activatedRoute: ActivatedRoute, private breadcrumbService: BreadcrumbService,
    private notification: NzNotificationService, private modalService: NzModalService) {
    this.activatedRoute.data.subscribe(res => {
      console.log(res);
      this.breadcrumbService.sendMessage(
        [
          {
            name: res.breadcrumb,
            url: this.router.url
          }]);
    });
    this.notification.config({
      nzPlacement: 'topRight'
    });
  }

  ngOnInit() {

    const now = new Date(Date.now() + 0);
    this.params.search.begin_date = GMTToStr(now) + ' 00:00:00';
    this.params.search.end_date = GMTToStr(now) + ' 23:59:59';
    this.dateTime = [this.params.search.begin_date, this.params.search.end_date];

    // 接收参数
    // this.route.params.forEach((paramsInfo: Params) => {
    //     // console.log(paramsInfo);
    //     this.pd_code = paramsInfo.pd_code;
    //     console.log(this.pd_code);
    //     // const paramsCode = paramsInfo['code'];
    //     // console.log(paramsCode);
    // });


    this.promotiononline();
  }



  // 展开按钮
  onUnfold() {
    this.isVisible = this.isVisible ? false : true;
  }




  // 公用接口
  // 操作
  isSaveInfo(pd_code, status) {
    const opt = {
      pd_code: pd_code,
      data_status: status
    };
    this.http.operation.request(opt)
      .subscribe(res => {
        console.log(res);

        if (res['code'] === 0) {
          this.notification.create('success', '温馨提示', '操作成功');
          this.promotiononline();

        } else {
          this.notification.create('error', '温馨提示', res['msg']);
        }
      });
  }

  // 列表数据
  promotiononline() {

    this.http.promotiononline.request(this.params)
      .subscribe(res => {
        console.log(res);
        // console.log(res['data'].dtos);
        // console.log(res['data'].count);
        if (res['code'] === 0) {
          this.onlinelist = res['data'].dtos;
          this.pageSize.count = res['data'].count;

        } else {
          this.notification.create('error', '温馨提示', res['msg']);
        }
      });
  }





  // 接收翻页操作传过来的值，然后请求服务得到新数据
  childparams($event) {
    const childoption = $event;
    this.params.page_no = childoption.page_no;
    this.promotiononline();
  }


  // 日期选择
  onDateChange($event) {

    // console.log($event);

    this.params.search.begin_date = GMTToStr($event[0]) + ' 00:00:00';
    this.params.search.end_date = GMTToStr($event[1]) + ' 23:59:59';

    // if ($event.length !== 0) {
    //     this.params.search.begin_date = GMTToStr($event[0]) + ' 00:00:00';
    //     this.params.search.end_date = GMTToStr($event[1]) + ' 23:59:59';
    // } else {
    //     const now = new Date(Date.now() + 0);
    //     this.params.search.begin_date = GMTToStr(now) + ' 00:00:00';
    //     this.params.search.end_date = GMTToStr(now) + ' 23:59:59';
    // }
  }


  // 查询按钮
  searchInfo(params) {
    console.log(params);
    this.params.page_no = 1;
    this.promotiononline();
  }


  // 重置按钮
  Reset() {

    const now = new Date(Date.now() + 0);

    this.params.search = {
      pd_code: '',
      pd_name: '',
      promotion_channel: '',
      begin_date: GMTToStr(now) + ' 00:00:00',
      end_date: GMTToStr(now) + ' 23:59:59',
      user_type: '',
      data_status: ''
    };
    // this.dateTime = [];
    this.dateTime = [this.params.search.begin_date, this.params.search.end_date];

  }


  // 新增商品降价按钮
  onSkipadd() {
    this.router.navigate(['pages/promotion/goodsDepreciate/addGoodsDepreciate', { isTitle: '1' }]);
  }


  onLink(i, params) {

    switch (i) {
      case '1':   // 详情
        this.router.navigate(['pages/promotion/goodsDepreciate/detailsGoodsDepreciate', {
          pd_code: params.pd_code,
          pd_name: params.pd_name,
          data_status: params.data_status
        }]);
        break;
      case '2':   // 取消
        this.modalService.confirm({
          nzTitle: '温馨提示',
          nzContent: '确定要取消此项活动吗',
          nzOnOk: () => {
            this.isSaveInfo(params.pd_code, '3');
          }
        });
        break;
      case '3':   // 提交
        this.modalService.confirm({
          nzTitle: '温馨提示',
          nzContent: '你将要提交此项活动',
          nzOnOk: () => {
            this.isSaveInfo(params.pd_code, '2');
          }
        });
        break;
      case '4':   // 编辑
        this.router.navigate(['pages/promotion/addGoodsDepreciate', {
          pd_code: params.pd_code,
          promotion_channel: params.promotion_channel,
          isTitle: '2',
          source_type: params.source_type
        }]);
        break;
      default:    // 删除
        this.modalService.confirm({
          nzTitle: '温馨提示',
          nzContent: '确定要删除此项活动吗',
          nzOnOk: () => {
            this.isSaveInfo(params.pd_code, '-1');
          }
        });
        break;
    }
  }


}
