import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseParams } from 'src/app/models';
import { HttpService } from 'src/app/http/http.service';
import { GMTToStr, Authbts, Whetherdisplay } from 'src/app/validates/validates';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  templateUrl: './writebriefing.html',
  styleUrls: ['./writebriefing.less']

})
export class WriteBriefing {
  channels: any[];
  params: any = {
    search: {
      date: '',
      ent_id: ''
    }
  };
  stvalue: number;
  slvalue: number;
  writebriefings: any;
  isempty: boolean;
  btns: any;
  dcdcsvwj: boolean = true;
  exportdate: any;
  constructor(private http: HttpService, private notification: NzNotificationService) {
    this.notification.config({
      nzPlacement: 'topRight'
    });
  }
  ngOnInit() {
    this.params.search.date = GMTToStr(new Date(Date.now() - 3600 * 24 * 1000));
    this.btns = Authbts('运营统计', '每日核销简报');
    // console.log(this.btns);
    this.dcdcsvwj = Whetherdisplay(this.btns, '导出到CSV文件');
    this.getchannels();
    this.getWriteBriefing(this.params.search);

  }
  // 获取渠道
  getchannels(): void {
    this.http.getChannels.request({ 'ebls_split': true })
      .subscribe(channels => {
        this.channels = channels['rows'];
      });
  }

  search(param) {
    if (param.date !== '') {
      param.date = String(param.date);
      this.getWriteBriefing(param);
    } else {
      this.notification.create('error', '温馨提示', ' 请选择完成日期! ');
    }
  }
  getWriteBriefing(data: any) {
    data.date = GMTToStr(new Date(data.date));
    this.exportdate = data.date;
    this.http.getwriteoffday.request(data)
      .subscribe(writebriefings => {
        this.writebriefings = writebriefings;
        if (this.writebriefings.length > 0) {
          this.isempty = false;
        } else {
          this.isempty = true;
        }
      });
  }

  getstvalue(event) {
    this.stvalue = -event.target.scrollTop;
    this.slvalue = -event.target.scrollLeft;
    //    lefttable.style.top = -event.scrollTop +  'px';
  }
  Reset() {
    this.params.search.channel = '';
    this.params.search.date = '';
  }

  // 每日核销简报导出
  addexport() {
    let exportopt: any;
    this.http.getwriteoffdayField.request()
      .subscribe(res => {
        exportopt = res;
        let parame = {
          'path': '/bsp/bspreport/reportexport/exportwriteoffday',
          'search': {},
          'desc': this.exportdate + '核销简报',
          'export_columns': []

        };
        if (exportopt) {
          for (let a in exportopt) {
            parame.export_columns.push({ 'name': a, 'key': exportopt[a] });
          }
        }
        console.log(parame.export_columns);


        if (this.params.search.date !== '') {
          const localuser = window.localStorage.getItem('userinfo');
          const userentid = JSON.parse(localuser).ent_id;
          this.params.search.ent_id = userentid;
          parame.search = this.params.search;
          this.http.addexport.request(parame)
            .subscribe(row => {

              if (row) {
                this.notification.create('success', '温馨提示', row['msg']);
              } else {
                this.notification.create('error', '温馨提示', '添加失败,请重试！');
              }

            });
        } else {
          this.notification.create('error', '温馨提示', ' 导出需要选择日期! ');
        }
      });
  }

}
