import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { BaseParams } from 'src/app/models';
import { HttpService } from 'src/app/http/http.service';

@Component({
  selector: 'app-taskconfig',
  templateUrl: './taskconfig.component.html',
  styleUrls: ['./taskconfig.component.less']
})
export class TaskconfigComponent implements OnInit, OnDestroy {

  // params为查询参数
  params: BaseParams = {
    search: {
      desc: ''
    },
    page_size: 10,
    page_no: 1,
    sort: 'submitTime',
    sortDirKey: 'DESC'
  };
  cow: number;
  exports: any;
  downloadurl: any;
  refresh: any;
  count = 0;
  loading = false;
  constructor(private http: HttpService) { }
  ngOnInit(): void {
    this.getexports();
  }
  ngOnDestroy(): void {
    clearInterval(this.refresh);
  }
  // 输入条件查询方法
  search() {
    this.params.page_no = 1;
    this.getexports();
  }

  // 获取列表
  getexports() {
    this.cow = (this.params.page_no - 1) * this.params.page_size;
    this.http.exportlist.request<any>(this.params)
      .subscribe(exports => {
        this.exports = exports.rows; // 获取到的列表数据
        this.count = exports.count; // 获取到的总记录数
      });
    // this.refresh = setInterval(() => {
    //   this.http.exportlist.request<any>(this.params)
    //     .subscribe(exports => {
    //       this.exports = exports.rows; // 获取到的列表数据
    //       this.taskConfigCount.count = exports.count; // 获取到的总记录数
    //       this.changecount = exports.count;
    //     });
    // }, 120000);
  }
  Reset() {
    this.params.search.desc = '';
  }
  getfile(filePath: string, filename: string) {
    this.http.downloadFile(filePath, filename);
  }
}
