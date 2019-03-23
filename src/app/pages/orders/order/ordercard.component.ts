import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { Http } from '@angular/http';
import { HttpService } from 'src/app/http/http.service';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'my-ordercard',
  templateUrl: './ordercard.html',
  styleUrls: ['./ordercard.less']


})
export class OrderCard implements OnInit {
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
  returntotal: any = 0;
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
  toggledetail(channel_sheetno: any) {

    if (this.clickcount % 2 !== 0) {
      this.clickcount = 0;
      this.ordersdetailnew = false;
      this.zk = true;
    } else {
      this.clickcount = 1;
      this.getorderdetailnew(channel_sheetno);
      this.zk = false;
      this.bft = false;
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
  order_bftdetail: any;
  // 订单详情
  getorderdetailnew(channel_sheetno: any) {
    if (!this.ordersdetailnew) {
      const opt = {
        search: { channel_sheetno: channel_sheetno, request_type: 'PC' }
      };
      this.http.getorderdetail.request(opt)
        .subscribe(ordersdetailnew => {
          if (ordersdetailnew['code'] === '0' && ordersdetailnew['data']) {
            this.ordersdetailnew = ordersdetailnew['data'];
            this.order_bftdetail = JSON.parse(JSON.stringify(ordersdetailnew['data']['order_details']));
            if (this.order_bftdetail && this.order_bftdetail.length > 0) {
              for (let i = 0; i < this.order_bftdetail.length; i++) {
                this.order_bftdetail[i].maxcount = this.order_bftdetail[i].allow_ret_qty;
                this.order_bftdetail[i].returncount = 0;
              }
            }
          }

        });
    } else {
      this.ordersdetailnew = false;
    }


  }
  orderStatus: any;
  gotoorderstatus(channel_sheetno) {
    this.http.getorderstatus.request({ channel_sheetno: channel_sheetno })
      .subscribe(
        res => {
          this.orderStatus = res;
        });
  }
  isVisible = false;
  isConfirmLoading = false;
  modeltitle: any;
  ddgj = false;
  xpdy = false;
  xkfp = false;
  printorder: any;
  ticketdetail: any;
  invoiceobj: any;
  modalwidth: number; // 弹出框宽度
  modaltitle: string; // 弹出框title
  modalstatus: boolean; // 弹出框状态
  modalconfirloading: boolean; // 弹出框提交loading
  confirmisshow: boolean; // 弹出框是否显示确认按钮
  getordertrack(channel_sheetno) {
    this.modalwidth = 650;
    this.modaltitle = '订单轨迹';
    this.modalstatus = true;
    this.confirmisshow = false;
    this.orderStatus = [];
    this.gotoorderstatus(channel_sheetno);
  }
  ticketprint(order) {
    this.modalwidth = 800;
    this.modaltitle = '打印小票';
    this.modalstatus = true;
    this.confirmisshow = false;
    this.printorder = order;
    this.http.getorderdetail.request({ channel_sheetno: order.channel_sheetno })
      .subscribe(res => {
        this.ticketdetail = res;
      });
  }

  invoice(opt: any, payable_value) {
    this.modalwidth = 600;
    this.modaltitle = '发票信息';
    this.modalstatus = true;
    this.confirmisshow = false;
    this.invoiceobj = opt;
    this.invoiceobj.money = payable_value;
  }
  closemodal() { // 关闭弹出框时重置modalstatus默认值
    this.modalstatus = false;
  }
  handleokfun(key) {
    switch (key) {
      case '部分退':
        this.orderAdjust(this.orderdate, this.order_bftdetail);
        break;
    }
  }
  remark: any;
  // 订单处理
  orderprocessing(order, i) {
    const opt = {
      channel_keyword: order.channel_keyword,
      ent_id: this.userentid,
      region_code: order.region_code,
      user: this.user,
      channel_sheetno: order.channel_sheetno,
      sfty: null,
      reason: null
    };
    if (i === '1') {
      opt.sfty = false;
      opt.reason = this.remark;
    }
    if (i === '2') {
      opt.sfty = true;
    }
    this.http.cancelOrderApprove.request(opt)
      .subscribe(res => {
        this.notification.create('success', '温馨提示', res['msg']);
        this.updatelist.emit();
      });

  }
  visible: boolean;
  closeMe() {
    this.visible = false;
    this.remark = '';
  }
  reasonlist: any;
  getcancelreason(channel_keyword) { // 商户主动取消订单获取取消原因
    // const opt = {
    //     channel_keyword: orderdate.channel_keyword,
    //     sheetno: orderdate.sheetno
    // };
    this.http.cancelOrderReason.request(channel_keyword)
      .subscribe(res => {
        this.reasonlist = res['list'];
      });
  }
  shcancelorder(orderdate, reasoncode) { // 商户主动取消订单
    const opt = {
      channel_keyword: orderdate.channel_keyword,
      ent_id: this.userentid,
      region_code: orderdate.region_code,
      user: this.user,
      channel_sheetno: orderdate.channel_sheetno,
      reason: reasoncode ? reasoncode : null
    };
    this.http.cancelorder.request(opt)
      .subscribe(res => {
        if (res && res['code'] === 0) {
          this.notification.create('success', '温馨提示', '操作成功!');
        } else {
          this.notification.create('error', '温馨提示', res['msg']);
        }
      });
  }
  editorder(channel_sheetno) {  // 修改订单(商户操作订单部分退)
    this.modalwidth = 600;
    this.modaltitle = '部分退';
    this.modalstatus = true;
    this.confirmisshow = true;
    this.getorderdetailnew(channel_sheetno);
  }
  addCount(orderdetails, i): void {
    if (orderdetails.returncount >= orderdetails.maxcount) {
      orderdetails.returncount = orderdetails.maxcount;
    } else {
      orderdetails.returncount = orderdetails.returncount + 1;
    }

  }

  minCount(orderdetails, i): void {
    orderdetails.returncount = orderdetails.returncount - 1;
    if (orderdetails.returncount < 0) {
      orderdetails.returncount = 0;
    }
  }
  checktextvalue(i, returncount) {
    if (returncount > this.order_bftdetail[i].maxcount) {
      this.notification.create('error', '温馨提示', '输入数量超过商品总数');
      this.order_bftdetail[i].returncount = JSON.parse(JSON.stringify(this.order_bftdetail[i].maxcount));
    }
    if (returncount < 0) {
      this.notification.create('error', '温馨提示', '输入数量不能小于0');
      this.order_bftdetail[i].returncount = 0;
    }
  }
  czremark: any;
  bft = false;
  orderAdjust(orderdate, detail) {
    const opt = {
      channel_keyword: orderdate.channel_keyword,
      ent_id: this.userentid,
      region_code: orderdate.region_code,
      channel_sheetno: orderdate.channel_sheetno,
      reason: this.czremark,
      // orderStatus: orderdate.status,
      orderList: []
    };
    for (let i = 0; i < detail.length; i++) {
      const listopt = {
        sale_qty: detail[i].returncount,
        item_code: detail[i].code,
        barcode: detail[i].barcode,
        sale_price: detail[i].sale_price,
        item_no: detail[i].item_no
      };
      if (detail[i].returncount > 0) {
        opt.orderList.push(listopt);
      }
    }
    this.http.sjLaunchReturnOrder.request(opt)
      .subscribe(res => {
        if (res && res['code'] === 0) {
          this.notification.create('success', '温馨提示', '操作成功!');
          this.bft = false;
        } else {
          this.notification.create('error', '温馨提示', res['msg']);
        }
        this.czremark = '';
        this.updatelist.emit();
      });
  }


}
