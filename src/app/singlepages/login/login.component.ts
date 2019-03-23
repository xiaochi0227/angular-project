import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidateRex } from 'src/app/validates/validates';
import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/http/http.service';
import { LoginResponse } from 'src/app/models';
import { map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Utils } from '../../utils/utils';
import { Router } from '@angular/router';
import { bg } from '../../images';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  bg: any = bg;
  editpass = true;
  editmsg = false;
  validateForm: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private notification: NzNotificationService) {
    this.notification.config({
      nzPlacement: 'topRight'
    });
  }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(i)) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }
    if (this.validateForm.valid) {
      this.login();
    }
  }

  login() {
    this.auth.login(this.validateForm.value).subscribe(v => {
      // @todo 这里拿到userinfo对象做判断是否用户能够登录
      if (v && v.code === 1) {
        window.localStorage.setItem('userinfo', JSON.stringify(v.data));
        this.router.navigate(['/pages']);
      }
    }, err => {
      this.notification.create('error', '温馨提示', err.message);
    });
  }
  confirm() {
    this.editmsg = true;
  }
  ngOnInit(): void {
    this.validateForm = this.fb.group({
      code: [null, [Validators.required, Validators.minLength(6), ValidateRex.only]],
      pwd: [null, [Validators.required]],
      remember: [true]
    });
  }
}
