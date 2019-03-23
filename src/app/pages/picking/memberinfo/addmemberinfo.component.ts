import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/http/http.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
@Component({
  selector: 'app-addmemberinfo',
  templateUrl: './addmemberinfo.component.html',
  styleUrls: ['./memberinfo.component.less']
})
export class AddmemberinfoComponent implements OnInit {

  params: any = {
    org_code: '',
    name: '',
    code: '',
    password: '',
    img_url: '',
    is_online: 0,
    status: '1',
    mobileNo: '',
    creator: '',
    picker_time: 10
  };
  public storelist: any;
  constructor(private router: Router, private route: ActivatedRoute, private http: HttpService, private notification: NzNotificationService) {
    this.notification.config({
      nzPlacement: 'topRight'
    });
  }

  ngOnInit() {
    this.getSelection();
    this.route.params.forEach((paramsInfo) => {
      console.log(paramsInfo);
      if (paramsInfo['parme']) {
        this.params = JSON.parse(paramsInfo['parme']);
        this.ping();
      }
    });
  }


  // 获取下拉列表
  getSelection() {
    // 获取门店信息
    this.http.getStorelist.request({})
      .subscribe((data) => {
        this.storelist = data;
      });
  }

  submitAddmember() {
    if (!this.params.name) {
      this.notification.create('error', '温馨提示', '请输入用户名');
      return false;
    }
    if (!this.params.org_code) {
      this.notification.create('error', '温馨提示', '请输入门店编码');
      return false;
    }
    if (!this.params.code) {
      this.notification.create('error', '温馨提示', '请输入账号');
      return false;
    }
    if (!this.params.password) {
      this.notification.create('error', '温馨提示', '请输入密码');
      return false;
    }
    if (!this.params.password) {
      this.notification.create('error', '温馨提示', '请输入员工编号');
      return false;
    }
    if (!this.params.mobileNo) {
      this.notification.create('error', '温馨提示', '请输入手机');
      return false;
    }
    let myreg = /^[1][3,4,5,6,7,8][0-9]{9}$/;
    if (!myreg.test(this.params.mobileNo)) {
      this.notification.create('error', '温馨提示', '请输入正确的手机号码');
      return false;
    }
    this.params.picker_time = parseInt(this.params.picker_time);
    this.http.addOrderPickers.request(this.params)
      .subscribe(data => {
        this.notification.create('success', '温馨提示', data['msg']);
        if (data['code'] === 'true') {
          this.router.navigate(['/pages/picking/memberinfo']);

        }
      })



  }
  submitupdmember() {
    if (!this.params.name) {
        this.notification.create('error', '温馨提示', '请输入用户名');
        return false;
    }
    if (!this.params.org_code) {
        this.notification.create('error', '温馨提示', '请输入门店编码');
        return false;
    }
    if (!this.params.code) {
        this.notification.create('error', '温馨提示', '请输入账号');
        return false;
    }
    if (!this.params.password) {
        this.notification.create('error', '温馨提示', '请输入密码');
        return false;
    }
    if (!this.params.password) {
        this.notification.create('error', '温馨提示', '请输入员工编号');
        return false;
    }
    if (!this.params.mobileNo) {
        this.notification.create('error', '温馨提示', '请输入手机');
        return false;
    }
    let myreg = /^[1][3,4,5,6,7,8][0-9]{9}$/;
    if (!myreg.test(this.params.mobileNo)) {
        this.notification.create('error', '温馨提示', '请输入正确的手机号码');
        return false;
    }
    this.params.picker_time = parseInt(this.params.picker_time);
    this.http.updOrderPickers.request(this.params)
    .subscribe(data => {
      this.notification.create('success', '温馨提示', data['msg']);
      if (data['code'] === 'true') {
        this.router.navigate(['/pages/picking/memberinfo']);

      }
    })

}

  ping() {
    if (this.params.status === '-1') {
      this.params.is_online = 0;
    } else if (this.params.status === '1') {
      this.params.is_online = 1;
    }
    console.log(this.params);
  }

}
