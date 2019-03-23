import { Userinfo, APIGroup } from '../models';
import { DatePipe } from '@angular/common';

const tokenKey = 'token';
const userInfoKey = 'uinfo';
const dateFomater = new DatePipe('en-US');
const timeoutKey = 'timeout';
const apiGroupKey = 'apigroup';


export class Utils {
  static setToken(token?: string) {
    if (!token) {
      localStorage.removeItem(tokenKey);
    } else {
      localStorage.setItem(tokenKey, token);
    }

  }
  static getToken(): string {
    return localStorage.getItem(tokenKey);
  }
  static setUserInfo(info: Userinfo) {
    localStorage.setItem(timeoutKey, info.exp.toString());
    localStorage.setItem(userInfoKey, JSON.stringify(info));
  }
  static getTimeout(): number {
    const to = localStorage.getItem(timeoutKey);
    if (to && to.length > 0) {
      return parseInt(to, 10);
    }
    return 0;
  }
  static getUserInfo(): Userinfo {
    const info = localStorage.getItem(userInfoKey);
    if (info && info.startsWith('{')) {
      return JSON.parse(info);
    }
    return {};
  }
  static cleanLoginInfo() {
    const keys = [tokenKey, userInfoKey, timeoutKey];
    keys.forEach(key => {
      localStorage.removeItem(key);
    });
  }
  static formaterDate(time: number, format = 'yyyy-MM-dd HH:mm:ss'): string {
    time = time > 1000000000000 ? time : time * 1000;
    return dateFomater.transform(time, format);
  }
  static encodeBase64(input: string): string {
    return btoa(input);
  }
  static decodeBase64(input: string): string {
    return atob(input);
  }
  static setAPIS(apis: APIGroup) {
    localStorage.setItem(apiGroupKey, JSON.stringify(apis));
  }
  static getAPIS(): APIGroup {
    const apig = localStorage.getItem(apiGroupKey);
    if (apig && apig.length > 0) {
      return JSON.parse(apig);
    } else {
      return null;
    }
  }
}
