import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseParams } from 'src/app/models';
import { HttpService } from 'src/app/http/http.service';
import { GMTToStr, Authbts, Whetherdisplay } from 'src/app/validates/validates';
import { DatePipe } from '@angular/common';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  templateUrl: './daysalerep.html',
  styleUrls: ['./daysalerep.less']
})
export class DaySaleRep {
  channels: any[];
  params: any = {
    search: {
      channel: '',
      date: ''
    }
  };
  daysales: any;
  btns: any;
  dcdcsvwj: boolean = true;
  constructor(private http: HttpService, private notification: NzNotificationService) {
    this.notification.config({
      nzPlacement: 'topRight'
    });
  }
  ngOnInit() {
    this.params.search.date = GMTToStr(new Date(Date.now() - 3600 * 24 * 1000));
    this.btns = Authbts('运营统计', '当日销售简报');
    // console.log(this.btns);
    this.dcdcsvwj = Whetherdisplay(this.btns, '导出到CSV文件');
    this.getchannels();
    this.getDaySale(this.params.search);
  }
  // 获取渠道
  getchannels(): void {
    this.http.getChannels.request({ 'ebls_split': true })
      .subscribe(channels => {
        this.channels = channels['rows'];
      });
  }

  search(param) {
    if (param.date !== '') {
      this.getDaySale(param);
    } else {
      this.notification.create('error', '温馨提示', ' 请选择下单日期! ');
    }
  }
  getDaySale(data: any) {
    data.date = GMTToStr(new Date(data.date));
    this.http.getsaledayinfo.request(data)
      .subscribe(daysales => {
        this.daysales = daysales;
      });
  }
  Reset() {
    this.params.search.channel = '';
    this.params.search.date = '';
  }

  // 每日销售简报导出
  addexport() {

    let parame = {
      'path': '/bsp/bspreport/reportexport/exportdailysales',
      'search': {
        startDate: '',
        endDate: '',
        channel: '',
        status: ''
      },
      'desc': this.params.search.date + '销售简报',
      'export_columns': [
        { 'name': '门店名称', 'key': 'region_name' },
        { 'name': '订单状态', 'key': 'center' },
        { 'name': '订单数量', 'key': 'count' },
        { 'name': '商品金额', 'key': 'total_item_value' },
        { 'name': '支付金额', 'key': 'payable_value' },
        { 'name': '优惠金额', 'key': 'total_disc_value' }
      ]

    };


    if (this.params.search.date !== '') {
      let datePipe = new DatePipe('en-US');
      parame.search.startDate =
        datePipe.transform(this.params.search.date, 'yyyy-MM-dd 00:00:00');
      parame.search.endDate =
        datePipe.transform(this.params.search.date, 'yyyy-MM-dd 23:59:59');
      parame.search.channel = this.params.search.channel;
      parame.search.status = this.params.search.status;

      this.http.addexport.request(parame)
        .subscribe(row => {

          if (row) {
            this.notification.create('success', '温馨提示', row['msg']);
          } else {
            this.notification.create('error', '温馨提示', '添加失败,请重试！');
          }

        });
    } else {
      this.notification.create('error', '温馨提示', ' 导出需要选择日期! ');
    }

  }

}
