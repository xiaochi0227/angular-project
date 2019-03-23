import { Component, OnInit, TemplateRef } from '@angular/core';
import { HttpService } from 'src/app/http/http.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'app-functionsetting',
  templateUrl: './functionsetting.component.html',
  styleUrls: ['./functionsetting.component.less']
})
export class FunctionsettingComponent implements OnInit {
  public parmes =
    {
      "stats": 3,
      "order_examine": true,
      "sj_delivery": true,
      "allchecked": true,
      "re_check": []
    }
  public storeList: any;
  public showStoreList = false;
  constructor(private modalService: NzModalService, private http: HttpService, private notification: NzNotificationService) {
    this.notification.config({
      nzPlacement: 'topRight'
    });
  }

  ngOnInit() {
    this.getStorelist();
  }

  // 获取门店列表
  getStorelist() {
    this.http.getStorelist.request({})
      .subscribe(data => {
        this.storeList = data;
        console.log(this.storeList);
        this.getagreement();
      });
  }
  // 获取初始页面
  getagreement() {
    this.http.getagreement.request({ property: 1000 })
      .subscribe(data => {
        this.storeList.forEach(item => {
          this.parmes.allchecked = data['data']['re_check'].length == 0 ? false : true;
          this.parmes.re_check = data['re_check'];
          this.parmes.sj_delivery = data['sj_delivery'];

          data['data']['re_check'].forEach(item1 => {
            if (item.code == item1) {
              item.sfxz = true;
            }
          });

        });
      });
  }
  // 保存接口
  settingsave() {

    this.parmes.re_check = [];
    this.storeList.forEach(item => {
      if (item.sfxz == true) {
        this.parmes.re_check.push(item.code);
      }
    });
    console.log(this.parmes);
    console.log(this.storeList);
    this.http.setagreement.request(this.parmes)
      .subscribe(data => {
        console.log(data);
        this.notification.create('success', '温馨提示', data['data']);
      })
  }


  // 全部勾选
  checkAll(event) {
    console.log(event);
    this.parmes.re_check = [];
    if (event) {
      this.storeList.forEach(item => { item.sfxz = true; });
    } else {
      this.storeList.forEach(item => { item.sfxz = false; })

    }

  }

  changeAllchecked() {
    let lspd = true;
    this.storeList.forEach(item => {
      if (item.sfxz == true) {
        this.parmes.allchecked = true;
        lspd = false;
      }
    })
    if (lspd) {
      this.parmes.allchecked = false;
    }

  }



  isShowStorelist() {
    this.showStoreList = !this.showStoreList;
  }
}
