

import { Component, OnInit, Injector } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NGXLogger } from 'ngx-logger'; // 控制台输出 this.logger
import { Authbts, Whetherdisplay, GMTToStr } from './../../../validates/validates';
import { HttpService } from 'src/app/http/http.service';    // 导入所用接口

import { BreadcrumbService } from 'src/app/services/breadcrumb.service';    // 面包屑导航
import { NzNotificationService, NzModalService } from 'ng-zorro-antd';




@Component({
  selector: 'app-detailsgoodsdepreciate',
  templateUrl: './detailsGoodsDepreciate.component.html',
  styleUrls: ['./goodsDepreciate.component.less']
})


export class DetailsGoodsDepreciateComponent implements OnInit {

  pd_name: any = '';
  data_status: any;
  _dataSet: any = []; // 列表数据
  _dataSetList: any = []; // 选中的数据
  indeterminate: Boolean = false; // 全选框状态
  allChecked: Boolean = false;    // 全选框
  commodyNum: any = `已选 0 件商品`;  // 选中数据数量文字


  // 翻页参数
  public pageSize: any = {
    totalPage: 0,
    count: 0
  };

  // 查询所需参数
  params = {
    search: {
      pd_code: '',
      region_code: '',
      region_name: '',
      item_code: '',
      item_name: ''
    },
    page_no: 1,
    page_size: 50,
    sort: 'region_code',
    sortDirKey: 'ASC'
  };

  // 获取接口服务
  constructor(private route: ActivatedRoute, private logger: NGXLogger,
    private http: HttpService, private router: Router,
    public activatedRoute: ActivatedRoute, private breadcrumbService: BreadcrumbService,
    private notification: NzNotificationService, private modalService: NzModalService) {
    this.activatedRoute.data.subscribe(res => {
      console.log(res);
      this.breadcrumbService.sendMessage(
        {
          name: "单品直降详情",
          url: this.router.url
        },
      );
    });
    this.notification.config({
      nzPlacement: 'topRight'
    });
  }
  ngOnInit() {
    // console.log(this.route.params);

    // this.route.params.subscribe((paramsInfo: Params) => {
    //     console.log(paramsInfo);
    // });

    this.route.params.forEach((paramsInfo) => {
      // console.log(paramsInfo);

      this.pd_name = paramsInfo['pd_name'];
      this.params.search.pd_code = paramsInfo['pd_code'];
      this.data_status = paramsInfo['data_status'];
      //   this.params = JSON.parse(paramsInfo['parme']);
    });

    this.isPriceoffInfo();

  }


  // 公共接口
  // 列表数据
  isPriceoffInfo() {

    this.http.priceoffInfo.request(this.params)
      .subscribe(res => {
        // console.log(res);

        if (res['code'] === 0) {
          this._dataSet = res['data'].items;
          this.pageSize.count = res['data'].count;

          for (let i = 0; i < this._dataSet.length; i++) {

            for (let j = 0; j < this._dataSetList.length; j++) {

              if (this._dataSet[i].item_code === this._dataSetList[j].item_code &&
                this._dataSet[i].barcode === this._dataSetList[j].barcode) {

                this._dataSet[i].checked = true;
              }
            }
          }

        } else {
          this.notification.create('error', '温馨提示', res['msg']);
        }
      });

  }

  // 取消操作
  isCancel(datalist) {
    this.modalService.confirm({
      nzTitle: '温馨提示',
      nzContent: '确定要取消所选商品吗？',
      nzOnOk: () => {
        // console.log('确定');
        const opt = {
          pd_code: this.params.search.pd_code,
          data_status: '3',
          items: datalist
        };

        this.http.operation.request(opt)
          .subscribe(res => {
            // console.log(res);

            if (res['code'] === 0) {
              this.notification.create('success', '温馨提示', '取消成功');
              this.isPriceoffInfo();

              this._dataSetList = []; // 选中的数据
              this.indeterminate = false; // 全选框状态
              this.allChecked = false;    // 全选框
              this.commodyNum = `已选 0 件商品`;  // 选中数据数量文字

            } else {
              this.notification.create('error', '温馨提示', res['msg']);
            }
          });
      }
    });

  }


  // 接收翻页操作传过来的值，然后请求服务得到新数据
  childparams($event) {
    const childoption = $event;
    this.params.page_no = childoption.page_no;
    this.isPriceoffInfo();
  }


  // 查询按钮
  searchInfo() {
    console.log(this.params);
    this.params.page_no = 1;
    this.isPriceoffInfo();
  }

  // 重置按钮
  Reset() {
    this.params.search.region_code = '';
    this.params.search.region_name = '';
    this.params.search.item_code = '';
    this.params.search.item_name = '';
  }

  // 取消按钮
  onLinkCancel(i, params?) {

    if (i === '1') {    // 单个取消
      const items = [{
        region_code: params.region_code,
        item_code: params.item_code,
        barcode: params.barcode
      }];
      this.isCancel(items);

    } else {    // 批量取消

      // console.log(this._dataSetList);
      if (this._dataSetList.length === 0) {
        this.notification.create('error', '温馨提示', '请先勾选商品');

      } else {
        this.isCancel(this._dataSetList);
      }
    }

  }


  // 全选框按钮
  updateAllChecked(value) {

    if (value) {
      this._dataSet.forEach(data => {
        data.checked = true;

        this._dataSetList.push({
          region_code: data.region_code,
          item_code: data.item_code,
          barcode: data.barcode
        });
      });
    } else {
      this._dataSet.forEach(data => {
        data.checked = false;

        for (let i = 0; i < this._dataSetList.length; i++) {

          if (data.item_code === this._dataSetList[i].item_code &&
            data.barcode === this._dataSetList[i].barcode) {

            this._dataSetList.splice(i, 1);
          }

        }
      });
    }
    const count = this._dataSetList.length;
    this.commodyNum = `已选 ${count} 件商品`;
  }

  // 多选框按钮
  updateSingleChecked($event, data) {

    const allChecked = this._dataSet.every(value => value.checked === true);
    const allUnChecked = this._dataSet.every(value => !value.checked);

    if (this._dataSet.length === 0) {
      this.allChecked = false;
    } else {
      this.allChecked = allChecked;
    }

    this.indeterminate = (!allChecked) && (!allUnChecked);
    // const storeList = this._dataSet.filter(value => value.checked);
    // // console.log(storeList);

    if ($event) {
      this._dataSetList.push({
        region_code: data.region_code,
        item_code: data.item_code,
        barcode: data.barcode
      });
    } else {
      for (let i = 0; i < this._dataSetList.length; i++) {

        if (data.item_code === this._dataSetList[i].item_code &&
          data.barcode === this._dataSetList[i].barcode) {

          this._dataSetList.splice(i, 1);
        }
      }
    }

    const count = this._dataSetList.length;
    this.commodyNum = `已选 ${count} 件商品`;
  }


  // 返回
  goback() {
    this.router.navigate(['/pages/promotion/goodsDepreciate']);
  }

}
