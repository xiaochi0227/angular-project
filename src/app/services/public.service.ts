import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/http/http.service';
import { NGXLogger } from 'ngx-logger';
import { NzNotificationService } from 'ng-zorro-antd';


@Injectable({
  providedIn: 'root'
})
export class PublicService {

  constructor(private http: HttpService, private logger: NGXLogger, private notification: NzNotificationService) {
    this.notification.config({
      nzPlacement: 'topRight'
    });
  }
  // 下载模板

  publicdownload(filename: string) {
    return this.http.download.request({ xh: filename })
      .subscribe(data => {
        const link = document.createElement('a');
        link.setAttribute('href', window.URL.createObjectURL(data));
        link.setAttribute('download', filename + '.xlsx');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
  }
  // 批量导入商品图片csv
  batchimportcsv(file: any, clean: boolean) {
    return this.http.batchimportcsv.request({ clean: clean })
      .subscribe(
        res => {
          this.notification.create('success', '温馨提示', res['msg']);
        });

  }
}
