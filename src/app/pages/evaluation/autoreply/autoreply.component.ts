import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/http/http.service';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'app-autoreply',
  templateUrl: './autoreply.component.html',
  styleUrls: ['./autoreply.component.less']
})
export class AutoreplyComponent implements OnInit {
  public replyText: string;
  public postObj = {
    iszdhf: false,
    conlent: ''
  };
  constructor(private http: HttpService, private notification: NzNotificationService) {
    this.notification.config({
      nzPlacement: 'topRight'
    });
  }

  ngOnInit() {
    this.getcoulent();
  }

  getcoulent() {
    this.http.getcoulent.request({})
      .subscribe(data => {
        if (data['code'] === '0') {
          const con = data['data']['conlent'];
          this.postObj = {
            iszdhf: data['data']['iszdhf'],
            conlent: con[con.length - 1],
          };
        }

      });
  }

  saveautoreply() {
    this.http.saveAutoReply.request(this.postObj)
      .subscribe(data => {
        if (data['code'] === '0') {
          this.notification.create('success', '温馨提示', data['msg']);
        } else {
          this.notification.create('error', '温馨提示', data['msg']);
        }

      })
  }



}
