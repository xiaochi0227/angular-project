import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/http/http.service';


@Component({
  templateUrl: './longnames.html',
  styleUrls: ['./longnames.less']
})
export class LongNames implements OnInit {
  @Input()
  params: any = {
    search: 15,
    page_size: 20,
    page_no: 1,
    sort: 'timestamp',
    sortDirKey: 'DESC'
  };
  pageSize =
    {
      totalPage: 0,
      count: 0
    };
  // cow: number;
  longnamelists: any;
  cow: number;
  constructor(private http: HttpService) { }

  ngOnInit(): void {
    this.getlongnameList(this.params);
  }

  // 输入条件查询方法
  search(paramsoption) {
    paramsoption.page_no = 1;
    this.getlongnameList(paramsoption);
  }
  // 接收翻页操作传过来的值，然后请求服务得到新数据
  childparams($event) {
    let childoption = $event;
    this.params.page_no = childoption.page_no;
    this.cow = (childoption.page_no - 1) * childoption.page_size;
    this.getlongnameList(childoption);

  }
  changecount: any;
  // 商品重名列表
  getlongnameList(param): void {
    this.cow = (param.page_no - 1) * param.page_size;
    param.search = Number(param.search);
    this.http.getlongnameList.request(param)
      .subscribe(res => {

        if (res && res['data']['list'] && res['data']['list'].length === 0) {
          this.longnamelists = '';
        } else {
          this.longnamelists = res['data']['list'];
        }
        this.pageSize.count = res['data']['rowCount'];
        this.changecount = res['data']['rowCount'];
      });
  }

  // 重置
  Reset() {
    this.params.search = '15';
  }

}
