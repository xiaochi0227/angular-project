import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginResponse, LoginParameter, ValidateResponse } from '../models';
import { HttpService } from '../http/http.service';
import { map, mergeMap } from 'rxjs/operators';
import { Utils } from '../utils/utils';
import { Observable, of } from 'rxjs';
// import { of } from 'rxjs';

import { utils } from 'protractor';
import { NGXLogger } from 'ngx-logger';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  freshTimer: NodeJS.Timer;
  constructor(private http: HttpService, private router: Router, private logger: NGXLogger) { }
  // 登录
  login(params: LoginParameter): Observable<ValidateResponse> {
    if (!params || !params.code || !params.pwd) {
      params = params || {};
      throw new Error(`参数异常${JSON.stringify(params)}`);
    }
    const loginres = this.http.apiLogin.request<LoginResponse>(params);
    const apis = loginres.pipe(mergeMap(v => {
      if (v && v.code === 1 && v.data && v.data.token) {
        Utils.setToken(v.data.token);
        return this.http.initAPIS();
      } else {
        throw new Error(v.errmsg);
      }
    }));
    const userInfof = apis.pipe(mergeMap(v => {
      // 启动刷新token服务
      this.startFresh();
      return this.http.apiTokenValidate.request<ValidateResponse>({ authorization: Utils.getToken() });
    })).pipe(map(info => {
      if (info && info.code === 1) {
        Utils.setUserInfo(info.data);
      }
      return info;
    }));
    return userInfof;
  }

  // 启动刷新token服务
  startFresh() {
    this.freshTimer = setInterval(() => {
      this.freshToken().subscribe(v => {
        if (v && v.exp) {
          const d = Utils.formaterDate(v.exp);
          this.logger.debug(`token 超时时间更新为:${d}`);
        }
      });
    }, 1000 * 60 * 60);
  }

  // 刷新token
  freshToken() {
    return this.http.apiRefreshToken.request<LoginResponse>().pipe(mergeMap(v => {
      if (v && v.code === 1) {
        Utils.setToken(v.data.token);
        return this.http.apiTokenValidate.request<ValidateResponse>({ authorization: v.data.token }).pipe(map(val => {
          if (val && val.code === 1) {
            Utils.setUserInfo(val.data);
            return val.data;
          }
          throw new Error(v.errmsg);
        }));
      }
      throw new Error(v.errmsg);
    }));
  }
  // 判断是否登录,如果API没有初始化需要初始化
  isLogin(): Observable<boolean> {
    const token = Utils.getToken();
    const to = Utils.getTimeout() * 1000;
    const now = Date.now();
    if (!token || !to || to - now <= 0) {
      Utils.cleanLoginInfo();
      return of(false);
    }
    if (!this.http.isinited) {
      return this.http.initAPIS().pipe(map(v => {
        return true;
      }));
    }
    return of(true);
  }

  loginOut() {
    Utils.cleanLoginInfo();
    this.router.navigate(['/login']);
  }

  getPolicy() {
    this.http.apiGetOSSPolicy.request().subscribe(v => {
      console.log(v);
    });
  }
}
