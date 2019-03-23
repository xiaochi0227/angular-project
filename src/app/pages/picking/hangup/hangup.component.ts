import { Component, OnInit, TemplateRef } from '@angular/core';
import { HttpService } from 'src/app/http/http.service';
import { NzModalRef, NzModalService, NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'app-hangup',
  templateUrl: './hangup.component.html',
  styleUrls: ['../memberclassify/memberclassify.component.less']
})
export class HangupComponent implements OnInit {

  params: any = {
    search: {
      code: '',
      name: ''
    },
    page_no: 1,
    page_size: 10
  };
  public hangUp = {
    code: "",
    name: ""
  };

  public categories: any;
  constructor(private http: HttpService, private modalService: NzModalService, private notification: NzNotificationService) {
    this.notification.config({
      nzPlacement: 'topRight'
    });
  }

  ngOnInit() {
    this.getonlineCategories();
  }

  // 获取分类
  getonlineCategories() {
    console.log(this.params);
    this.http.queryPickHangUpReason.request({})
      .subscribe(data => {

        this.categories = data;
      })
  }

  addHangup() {

  }

  // 回复评价
  change(item, showModal: TemplateRef<{}>) {
    console.log(item);
    if (item) {
      this.hangUp = item;
    } else {
      this.hangUp = {
        code: "",
        name: ""
      }
    }
    let modal: NzModalRef = this.modalService.create({
      nzTitle: '添加挂起原因',
      nzContent: showModal,
      nzOnOk: () => {
        return new Promise((resolve, reject) => {
          this.http.savePickHangUpReason.request(item)
            .subscribe(data => {
              if (data['code'] == 0) {
                 this.notification.create('success', '温馨提示', data['msg']);
                resolve(true);
              } else {
                 this.notification.create('error', '温馨提示', data['msg']);
              }
            });
        });
      },
      nzOnCancel: () => { showModal['replyText'] = ""; modal.destroy() }
    });

  }

  // 删除
  pickingHangUpResonSort(params) {
    this.http.delPickHangUpReason.request(params)
      .subscribe(data => {
        if (data['code'] === '0') {
          this.getonlineCategories();
        }
         this.notification.create('error', '温馨提示', data['msg']);
      })
  }

  savememberclassify() {
    this.http.pickingHangUpResonSort.request(this.params)
      .subscribe(data => {
         this.notification.create('success', '温馨提示', data['msg']);
        this.getonlineCategories();
      })
  }

}
