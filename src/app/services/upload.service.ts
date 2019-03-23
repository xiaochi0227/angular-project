import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/http/http.service';
import { NGXLogger } from 'ngx-logger';
import { Observable, of, Subject } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';


export interface OssPolicy {
  accessid: string;
  host: string;
  expire: number;
  signature: string;
  policy: string;
  dir: string;
}

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  policy: OssPolicy;
  updating = false;
  subject: Subject<OssPolicy>;
  constructor(private http: HttpService, private logger: NGXLogger) {
    this.subject = new Subject();
  }

  getPolicy(): Observable<OssPolicy> {
    this._getPolicy();
    return this.subject.asObservable();
  }
  _getPolicy() {
    const now = parseInt(String(Date.now() / 1000), 10);
    if (this.policy && this.policy.expire && this.policy.expire - now > 0) {
      return this.subject.next(this.policy);
    }
    if (!this.updating) {
      this.updating = true;
      this.http.apiGetOSSPolicy.request<OssPolicy>().subscribe(v => {
        this.updating = false;
        this.policy = v;
        return this.subject.next(this.policy);
      });
    }
  }
}
