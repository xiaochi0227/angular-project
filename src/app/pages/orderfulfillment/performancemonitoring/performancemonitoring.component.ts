import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { HttpService } from 'src/app/http/http.service';
import { Router } from '@angular/router';
import { Z } from 'ng-zorro-antd';

@Component({
  selector: 'app-performancemonitoring',
  templateUrl: './performancemonitoring.component.html',
  styleUrls: ['./performancemonitoring.component.less']
})
export class PerformancemonitoringComponent implements OnInit, OnDestroy {
  params: any = {
    search: {
      region_code: '',
    },
    page_size: 20,
    page_no: 1,
    sort: 'order_time',
    sortDirKey: 'DESC'
  };
  userrights: any;
  public storeList: any;
  public monitorconfigdate: any = [];
  public results: any;
  inter: any;
  monitorinter: any;
  @ViewChild("voice") voice: ElementRef;
  audio: HTMLAudioElement;

  constructor(private router: Router, private http: HttpService) {
    const localuser = window.localStorage.getItem('userinfo');
    this.userrights = JSON.parse(localuser);
  }

  ngOnInit() {
    this.getagreement();
    this.getStorelist();
    this.audio = this.voice.nativeElement;
    console.log(this.audio);
  }

  // 获取初始页面
  getagreement() {
    this.http.getagreement.request({ property: 100 })
      .subscribe(res => {
        if (res && res['data']) {
          for (let i = 0; i < res['data'].length; i++) {
            if (res['data'][i].control_setting) {
              this.monitorconfigdate.push(res['data'][i]);
            }
          }
          console.log(this.monitorconfigdate);
          this.getsearchresults().then(data => {
            console.log(data);
            if (data) {
              if (data && this.monitorconfigdate && this.monitorconfigdate.length > 0) {
                this.audio.play();
                const currenttime = (new Date()).getTime();
                for (let i = 0; i < this.results.resultlist[0].orders.length; i++) {
                  for (let j = 0; j < this.monitorconfigdate.length; j++) {
                    if (this.results.resultlist[0].orders[i].honour_name === this.monitorconfigdate[j].honour_name) {
                      this.monitorconfigdate[j].oldtime = currenttime;
                    }
                  }
                }
              }
            }
          });

        }

      });
    this.inter = setInterval(() => {
      this.getsearchresults();
    }, 60000);
    this.monitorinter = setInterval(() => {
      this.getagreementfun();
    }, 61000);
  }
  ngOnDestroy() {
    window.clearInterval(this.inter);
    window.clearInterval(this.monitorinter);
  }

  getagreementfun() {
    if (this.results.resultlist[0].orders && this.results.resultlist[0].orders.length > 0) {
      const isplayarr = [];
      const crrenttime = (new Date()).getTime();
      for (let i = 0; i < this.results.resultlist[0].orders.length; i++) {
        if (this.monitorconfigdate && this.monitorconfigdate.length > 0) {
          for (let j = 0; j < this.monitorconfigdate.length; j++) {
            if (this.results.resultlist[0].orders[i].honour_name === this.monitorconfigdate[j].honour_name) {
              if (!this.monitorconfigdate[j].oldtime) {
                this.monitorconfigdate[j].oldtime = crrenttime;
                isplayarr.push(this.monitorconfigdate[j]);
              } else {
                const timedifference = crrenttime - this.monitorconfigdate[j].oldtime;
                if (timedifference / 1000 / 60 > this.monitorconfigdate[j].report_time) {
                  // this.audio.play();
                  isplayarr.push(this.monitorconfigdate[j]);
                  this.monitorconfigdate[j].oldtime = crrenttime;
                }
              }

            }
          }
        }
      }
      if (isplayarr.length > 0) {
        this.audio.play();
      }
    }

  }

  getsearchresults() {
    return new Promise<Array<any>>((resolve, reject) => {
      this.http.agreementreport.request(this.params.search)
        .subscribe(data => {
          if (data['data']) {
            this.results = data['data'];
            const lastobj = this.results.resultlist[this.results.resultlist.length - 1];
            this.results.resultlist.splice(-1, 1);
            this.results.resultlist.unshift(lastobj);
            const resorders = data['data'].resultlist[0].orders;
            resolve(resorders);
          }
        });
    });
  }
  searchcode($event) {
    this.params.search.region_code = $event;
    this.getsearchresults();
  }
  // 获取门店列表
  getStorelist() {
    this.http.getStorelist.request({})
      .subscribe(data => {
        this.storeList = data;
        const tmp = [{ code: '', codename: '全部门店' }].concat(this.storeList);
        this.storeList = tmp;
        this.params.search.region_code = this.storeList[0].code;
      });
  }
  // 进入订单履约监控页面
  gotodetailpage() {
    this.router.navigate(['/pages/orderfulfillment/monitorconfig']);
  }

  gotoreturnorder() {
    this.router.navigate(['/pages/orders/returnlist', { test: 1 }]);
  }
  gotoorder() {
    this.router.navigate(['/pages/orders/order', { status: 14 }]);
  }
}
