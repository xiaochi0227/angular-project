import { Injectable } from '@angular/core';
import { ArmsModule } from './arms.module';
import { NGXLogger } from 'ngx-logger';
import { ArmsConfig } from './arms.config';
import * as Arms from 'alife-logger';

@Injectable()
export class ArmsService {
  _bl: any;
  constructor(private logger: NGXLogger, private cfg: ArmsConfig) {
    if (!cfg || !cfg.pid || !cfg.imgUrl) {
      throw '参数异常';
    }
    const pipe = [
      ['setConfig', { enableSPA: true }]
    ];
    this._bl = Arms.singleton({
      pid: this.cfg.pid,
      imgUrl: this.cfg.imgUrl,
    }, pipe);
    if (this.cfg.addLoadListener) {
      window.addEventListener('load', e => {
        // 调用setConfig方法修改SDK配置项
        this._bl.setConfig({
          parseHash: function () {
            let hash = location.hash;
            var page = hash ? hash.replace(/^#/, '').replace(/\?.*$/, '') : '';
            return page || 'index';
          }
        });
      });
    }
    this.logger.info('ArmsService 初始化完成');
  }
  setPage(name: string, isReport: boolean = false) {
    this._bl.setPage(name, isReport);
  }
}
