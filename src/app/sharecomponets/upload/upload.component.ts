import { Component, OnInit, Input } from '@angular/core';
import { UploadService, OssPolicy } from 'src/app/services/upload.service';
import { NGXLogger } from 'ngx-logger';
import { UUID } from 'angular2-uuid';
import { of, Observable, Observer } from 'rxjs';

export interface UploadResult { fileName: string; key: string; localUrl: string; remoteUrl: string; size: number; }

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.less']
})
export class UploadComponent implements OnInit {
  @Input()
  dir = 'temp/';
  @Input()
  nzuploadtype; // 判断是否拖拽文件上传
  @Input()
  uploadtype = 'default';  // 判断上传是显示成按钮还是文字
  @Input()
  showuploadlist = false; // 是否显示uploadlist
  @Input()
  isRandom = true;
  @Input()
  onUploaded: (result: UploadResult) => void;
  @Input()
  uploadname = '点击上传文件';
  @Input()
  nzLimit = 2;
  @Input() nzFileType; // 文件类型
  @Input() size = 0; // 文件大小

  policy: OssPolicy;
  @Input() fileList = [];
  constructor(private us: UploadService, private logger: NGXLogger) { }

  ngOnInit() {

  }
  handleChange(event) {
    // 结束后
    if (event && event.type === 'success') {
      console.log(event);
      this.onUploaded({
        fileName: event.file.name,
        key: event.file.originFileObj.key,
        size: event.file.size,
        localUrl: 'http://images-m-glory.oss-cn-hangzhou-internal.aliyuncs.com/' + event.file.originFileObj.key,
        remoteUrl: 'http://images-m-glory.oss-cn-hangzhou.aliyuncs.com/' + event.file.originFileObj.key
      });
    }
  }
  additionParameter = file => {
    console.log(file);
    if (file && file.name) {
      let name: string = file.name;
      if (this.isRandom) {
        let suffix: string;
        if (name.indexOf('.') > 0) {
          suffix = name.split('.')[1];
        }
        name = UUID.UUID() + '.' + suffix;
        file.key = this.policy.dir + 'files/' + name;
        return {
          name: name,
          key: this.policy.dir + 'files/' + name,
          policy: this.policy.policy,
          OSSAccessKeyId: this.policy.accessid,
          success_action_status: 200,
          signature: this.policy.signature,
        };
      }
    }
  }
  before = file => {
    console.log(file);
    return new Observable((observer: Observer<boolean>) => { //  非拖拽方式直接上传文件
      this.us.getPolicy().subscribe(v => {
        if (v && v.policy && v.signature) {
          this.policy = v;
          observer.next(true);
        }
        observer.complete();
        return;
      });
    });
  }

  remove = file => {
    return true;
  }
}
