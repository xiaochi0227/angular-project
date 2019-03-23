import { Component, Directive, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { Http } from '@angular/http';
import { HttpService } from 'src/app/http/http.service';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'my-returnordercard',
  templateUrl: './returnordercard.html',
  styleUrls: ['./returnordercard.less']


})
export class ReturnOrderCard implements OnInit {
  @Input()
  orderdate: any;
  @Input()
  num: any;
  @Input()
  orderprocessingswitch: any;
  ordersdetailnew: any;
  userentid: any;
  user: any;
  @Output()
  updatelist: EventEmitter<any> = new EventEmitter<any>();
  constructor(private http: HttpService, private notification: NzNotificationService) {
    const localuser = window.localStorage.getItem('userinfo');
    this.userentid = JSON.parse(localuser).ent_id;
    this.user = JSON.parse(localuser).code;
    this.notification.config({
      nzPlacement: 'topRight'
    });
  }


  ngOnInit(): void { }
  clickcount = 0;
  zk: boolean = true;
  jezk: boolean = true;
  toggledetail(sheetno: any) {
    if (this.clickcount % 2 !== 0) {
      this.clickcount = 0;
      this.ordersdetailnew = false;
      this.zk = true;
    } else {
      this.clickcount = 1;
      this.getreturnorderdetailnew(sheetno);
      this.zk = false;
    }
  }
  jeclickcount = 0;
  jetoggledetail() {
    if (this.jeclickcount % 2 !== 0) {
      this.jeclickcount = 0;
      this.jezk = true;
    } else {
      this.jeclickcount = 1;
      this.jezk = false;
    }
  }
  // 退货详情
  getreturnorderdetailnew(sheetno: string) {
    if (this.ordersdetailnew) {
      this.ordersdetailnew = false;
    } else {
      const opt = {
        search: { sheetno: sheetno }
      };
      this.http.getreturnlist.request(opt)
        .subscribe(ordersdetailnew => {
          if (ordersdetailnew['code'] === '0' && ordersdetailnew['data']) {
            this.ordersdetailnew = ordersdetailnew['data'];
          }
        });
    }
  }
  remark: any;
  // 退单处理
  returnorderprocessing(order, i) {
    const opt = {
      channel_keyword: order.channel_keyword,
      ent_id: this.userentid,
      region_code: order.region_code,
      user: this.user,
      channel_sheetno: order.channel_sheetno,
      sheetno: order.sheetno,
      resultType: null,
      remark: null
    };
    if (i === '1') {
      opt.resultType = '0';
      opt.remark = this.remark;
      if (opt.remark) {
        this.http.afterSaleOrderApprove.request(opt)
          .subscribe(res => {
            this.notification.create('success', '温馨提示', res['msg']);
            this.updatelist.emit();
          });
        this.closeMe();
      } else {
        this.notification.create('error', '温馨提示', '驳回备注必填!');
      }
    }
    if (i === '2') {
      opt.resultType = '10';
      this.http.afterSaleOrderApprove.request(opt)
        .subscribe(res => {
          this.notification.create('success', '温馨提示', res['msg']);
          this.updatelist.emit();
        });
    }
    if (i === '3') {
      opt.resultType = '40';
      this.http.afterSaleOrderApprove.request(opt)
        .subscribe(res => {
          this.notification.create('success', '温馨提示', res['msg']);
          this.updatelist.emit();
        });
    }
  }
  visible: boolean;
  closeMe() {
    this.visible = false;
    this.remark = '';
  }
  confirmreceipt(order) {
    const opt = {
      channel_keyword: order.channel_keyword,
      ent_id: this.userentid,
      region_code: order.region_code,
      user: this.user,
      sheetno: order.sheetno,
    };
    this.http.confirmReceipt.request(opt)
      .subscribe(res => {
        this.notification.create('success', '温馨提示', res['msg']);
        this.updatelist.emit();
      });
  }
}
