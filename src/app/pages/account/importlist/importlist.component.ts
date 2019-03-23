import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/http/http.service';

@Component({
  selector: 'app-importlist',
  templateUrl: './importlist.component.html',
  styleUrls: ['./importlist.component.less']
})
export class ImportlistComponent implements OnInit {
  // params为查询参数
  params: any = {
    page_size: 10,
    page_no: 1,
    sort: 'start_time',
    sortDirKey: 'DESC'
  };
  count = 0;
  cow: number;
  importlists: any;
  results: any = {};
  isVisible = false;
  loading = false;
  constructor(private http: HttpService) { }
  ngOnInit(): void {
    this.getimportlists();
  }
  // 获取列表
  getimportlists() {
    this.cow = (this.params.page_no - 1) * this.params.page_size;
    this.http.importlist.request<any>(this.params)
      .subscribe(res => {

        this.importlists = res.rows; // 获取到的列表数据
        this.count = res.count; // 获取到的总记录数
      });
  }

  getfile(filePath, filename) {
    this.http.downloadFile(filePath, filename);
  }
  findresult(result) {
    this.results = result;
    this.isVisible = true;
  }
  search() {

  }
}

