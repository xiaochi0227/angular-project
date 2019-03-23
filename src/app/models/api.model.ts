import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { retry, map } from 'rxjs/operators';

const RETRY = 1;

/**
 * API描述信息
 */
class APIDic {
  code: string;
  name?: string;
  version?: string;
  url: string;
  method: string;
  memo?: string;
}

/**
 * API组
 */
export class APIGroup {
  app_name: string;
  code: string;
  apis: { [key: string]: APIDic }
  name: string;
  memo: string;
  version: number;
  app_code: string;
}

/**
 * API请求结果对象
 */
export class HttpResponse {
  code: number;
  msg?: string;
  errmsg?: string;
  data?: any;
}

export interface APIGroupResponse {
  code: string;
  msg: string;
  data: APIGroup;
}

export interface APIIterface {
  request<T>(parameter?: any, customPath?: string): Observable<T>;
}

export class API implements APIIterface {
  // 重试次数
  private _retry = 1;
  // 缓存数据
  private _datas: { [key: string]: { lastrequest: number, data: any } } = {};
  // 缓存开关
  private _enableCache = false;
  // 缓存时间
  private _cacheTime = 1000 * 60;

  private _timeout: NodeJS.Timer;


  constructor(private client: HttpClient, private apidic: APIDic) { }

  request<T>(parameter?: any, customPath?: string): Observable<T> {
    parameter = parameter || '';
    if (this._datas && this._datas[parameter]) {
      const data = this._datas[parameter];
      const dur = Date.now() - data.lastrequest;
      if (dur < this._cacheTime) {
        return of(data.data);
      }
    }
    const url = this.apidic.url + (customPath || '');
    switch (this.apidic.method.toLowerCase()) {
      case 'get':
        return this.client.get<T>(url, { params: parameter, })
          .pipe(retry(this._retry));
        break;
      case 'post':
        return this.client.post<T>(url, parameter, { withCredentials: true })
          .pipe(retry(this._retry)).pipe(map(this.cache(parameter)));
        break;
      case 'put':
        return this.client.put<T>(url, parameter, { withCredentials: true })
          .pipe(retry(this._retry));
        break;
      case 'delete':
        return this.client.delete<T>(url, { params: parameter, withCredentials: true, })
          .pipe(retry(this._retry));
        break;
      default:
        return this.client.get<T>(url, { params: parameter, withCredentials: true, })
          .pipe(retry(this._retry));
        break;
    }
  }

  retry(times: number) {
    this._retry = times;
    return this;
  }

  /**
   *
   * 开启缓存功能
   * @Class API
   */
  enableCache() {
    this._enableCache = true;
    return this;
  }

  disableCache() {
    this._enableCache = false;
    return this;
  }

  /**
   *
   * @parameter  timestamp 缓存时间
   * @Class API
   */
  setCacheTime(timestamp: number) {
    // 少于一秒和高于10分钟的不予设置
    if (timestamp > 1000 && timestamp < 1000 * 60 * 10) {
      this._cacheTime = timestamp;
    }
    return this;
  }

  fresh(): void {
    this._datas = {};
  }

  private cache(key: string) {
    return v => {
      if (this._enableCache) {
        this._datas[key] = { lastrequest: Date.now(), data: v };
        clearTimeout(this._timeout);
        this._cleanCache();
      }
      return v;
    };
  }

  private _cleanCache() {
    this._timeout = setTimeout(() => {
      this._datas = {};
    }, this._cacheTime);
  }

}
