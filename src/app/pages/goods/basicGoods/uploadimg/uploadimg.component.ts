import { Component, Input } from '@angular/core';
import { UploadResult } from 'src/app/sharecomponets/upload/upload.component';
import { HttpService } from 'src/app/http/http.service';
import { NzNotificationService } from 'ng-zorro-antd';


@Component({
  selector: 'app-goods-uploadimg',
  templateUrl: './uploadimg.component.html',
  styleUrls: ['./uploadimg.component.less']

})
export class GoodsuploadimgComponent {
  public fileList = [];
  paramn = '1';
  cover = '2';
  @Input() type = "main";
  constructor(private notification: NzNotificationService, private http: HttpService) {
    this.notification.config({
      nzPlacement: 'topRight'
    });
  }
  uploadimg = (result: UploadResult): void => {
    console.log(result);
    if (result) {
      const sucopt = {
        img_type: this.paramn,
        cover: this.cover,
        barcode: '',
        key: result.key,
        local_url: result.localUrl,
        remote_url: result.remoteUrl
      };
      if (result.size / 1024 / 1024 <= 2) {
        if (this.type === "main") {
          this.http.alluploadimgoss.request([sucopt])
            .subscribe(res => {
              if (res['code'] == "010001000") {
                console.log(res['data']);
                if (res['data'].success.length !== 0) {
                  sucopt['msg'] = res['data'].fail[0].msg;
                  sucopt['success'] = true;
                }
                if (res['data'].fail.length !== 0) {
                  sucopt['msg'] = res['data'].fail[0].msg;
                  sucopt['fail'] = true;
                }
                sucopt['fileName'] = result['fileName'];
                this.fileList.push(sucopt);
              }
            });
        } else {
          this.http.addBatchPictureDetails.request([sucopt])
            .subscribe(res => {
              if (res['code'] == "010001000") {
                console.log(res['data']);
                if (res['data'].success.length !== 0) {
                  sucopt['msg'] = res['data'].fail[0].msg;
                  sucopt['success'] = true;
                }
                if (res['data'].fail.length !== 0) {
                  sucopt['msg'] = res['data'].fail[0].msg;
                  sucopt['fail'] = true;
                }
                sucopt['fileName'] = result['fileName'];
                this.fileList.push(sucopt);
              }
            });
        }

      } else {
        console.log("图片过大");
        this.notification.create('warning', '温馨提示', result.fileName + "图片过大");
      }




    }
  }

  imgtype(event) {
    this.paramn = event;
  }
  covers(event) {
    this.cover = event;
  }


  delAllFilelist() {
    console.log(this.fileList);
    this.fileList = [];
  }





}
