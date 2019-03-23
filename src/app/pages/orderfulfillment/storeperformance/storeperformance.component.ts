import { Component, OnInit, TemplateRef } from '@angular/core';
import { BaseParams } from 'src/app/utils/base.list.params';
import { HttpService } from 'src/app/http/http.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { Observable, of } from "rxjs";
@Component({
  selector: 'app-storeperformance',
  templateUrl: './storeperformance.component.html',
  styleUrls: ['./storeperformance.component.less']
})
export class StoreperformanceComponent implements OnInit {
  private params: BaseParams = {
    search: {},
    page_size: 50,
    page_no: 1,
    sort: 'timestamp',
    sortDirKey: 'DESC'
  };
  public queryList = new Array();
  public results: any;
  public searchStart = false; // 进行是否查询判断
  public modalparams = new Object();
  public pageSize =
    {
      totalPage: 0,
      count: 0
    };
  constructor(private http: HttpService, private modalService: NzModalService) { }

  ngOnInit() {
    this.queryList = [
      {
        show: true,
        type: "select",
        label: "门店",
        name: "region_code",
        search: true,
        list: this.getSelection('region_code'),
        code: "",
      },
      {
        show: true,
        type: "date-picker",
        label: "时间",
        name1: "startdate",
        name2: "enddate",
        value: [new Date(Date.now() - 3600 * 48 * 1000), new Date(Date.now() - 3600 * 24 * 1000)],
        value1: "",
        value2: ""
      },
    ]
  }

  getSelection(name) {
    this.http.getStorelist.request({})
      .subscribe((data) => {
        this.queryList.forEach((item) => {
          if (item.name === name) {

            item.list = JSON.parse(JSON.stringify(data)).map((item1, index) => {
              let obj = {
                code: item1.code,
                name: item1.codename
              };
              return obj;
            });
            item.list.unshift({
              code: "",
              name: "全部门店"
            });

          }
        });
      });
  }



  // 获取所有查询条件
  search($event) {
    this.params.search = $event;
    this.getsearchresults();
  }
  // 接收翻页操作传过来的值，然后请求服务得到新数据
  childparams($event) {
    const childoption = $event;
    this.params.page_no = childoption.page_no;
    this.getsearchresults();
  }

  getsearchresults() {
    this.http.storeagreementreport.request(this.params)
      .subscribe(res => {
        this.results = res['data'];
        this.pageSize.count = res['data'].count;
        console.log(this.results);
      });
  }


  // 查看单元格详情
  showModal(item, showModal: TemplateRef<{}>, title) {
    this.modalparams = item;
    let modal: NzModalRef = this.modalService.create({
      nzTitle: title,
      nzOkText: null,
      nzContent: showModal,
      nzOnCancel: () => { modal.destroy(); }
    });

  }
}
