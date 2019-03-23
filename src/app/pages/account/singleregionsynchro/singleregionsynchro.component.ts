import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/http/http.service';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'app-singleregionsynchro',
  templateUrl: './singleregionsynchro.component.html',
  styleUrls: ['./singleregionsynchro.component.less']
})
export class SingleregionsynchroComponent implements OnInit {
  public params: any = {
    'ent_id': '',
    'regions': '',
    'item_code': '',
    'barcode': ''
  };
  localuser = localStorage.getItem('userinfo');
  public storelist: any;
  public initStorelist: any;
  public selectStoreList: any;
  public userrights: any;
  public res: any;
  constructor(private http: HttpService, private notification: NzNotificationService) {
    this.userrights = JSON.parse(this.localuser);
    console.log(this.userrights);
    this.notification.config({
      nzPlacement: 'topRight'
    });
  }

  ngOnInit() {
    this.params.ent_id = this.userrights.ent_id;
    this.getStoreList(this.params.ent_id);
  }

  getStoreList(ent_id) {
    this.http.getregions.request(ent_id)
      .subscribe((data) => {
        this.storelist = data;
      });
  }

  viewSelectList(event) {
    this.params.regions = event;
    console.log(this.params);
  }

  // 添加单个商品：
  onegoodsadd() {

    if (this.Check()) {
      console.log(this.params);
      this.http.onegoodsadd.request(this.params)
        .subscribe(res => {
          this.res = res;
        });
    }
  }
  onegoodsedit() {
    if (this.Check()) {
      this.http.onegoodsedit.request(this.params)
        .subscribe(res => {
          this.res = res;
        });
    }
  }
  onegoodsprice() {
    if (this.Check()) {
      this.http.onegoodsprice.request(this.params)
        .subscribe(res => {
          this.res = res;
        });
    }
  }
  onegoodsstock() {
    if (this.Check()) {
      this.http.onegoodsstock.request(this.params)
        .subscribe(res => {
          this.res = res;
        });
    }
  }
  编码: 20530907
  条码: 6927128225877
  onegoodsonoff() {
    if (this.Check()) {
      this.http.onegoodsonoff.request(this.params)
        .subscribe(res => {
          // this.res = res;
        });
    }
  }

  Check() {
    if (!this.params.ent_id) {
      this.notification.create('error', '温馨提示', '请选择企业');
      return false;
    }
    if (!this.params.regions || this.params.regions.length === 0) {
      this.notification.create('error', '温馨提示', '请最少选择1个门店');
      return false;
    }
    if (!this.params.item_code) {
      this.notification.create('error', '温馨提示', '请输入编码');
      return false;
    }
    if (!this.params.barcode) {
      this.notification.create('error', '温馨提示', '请输入条码');
      return false;
    }
    return true;
  }

}
