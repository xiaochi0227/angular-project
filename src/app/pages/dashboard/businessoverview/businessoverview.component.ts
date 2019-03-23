import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';
const count = 5;
const fakeDataUrl = 'https://randomuser.me/api/?results=5&inc=name,gender,email,nat&noinfo';
@Component({
  templateUrl: './businessoverview.html',
  styleUrls: ['./businessoverview.scss']
})
export class BusinessoverviewComponent implements OnInit {
    index2 = 0;
    initLoading = true; // bug
  loadingMore = false;
  data = [];
  list = [];
  constructor(private logger: NGXLogger,private http: HttpClient, private msg: NzMessageService) { }
  ngOnInit() {
    this.getData((res: any) => {
      this.data = res.results;
      this.list = res.results;
      this.initLoading = false;
    });
  }
  getData(callback: (res: any) => void): void {
    this.http.get(fakeDataUrl).subscribe((res: any) => callback(res));
  }

  onLoadMore(): void {
    this.loadingMore = true;
    this.list = this.data.concat([...Array(count)].fill({}).map(() => ({ loading: true, name: {} })));
    this.http.get(fakeDataUrl).subscribe((res: any) => {
      this.data = this.data.concat(res.results);
      this.list = [...this.data];
      this.loadingMore = false;
    });
  }

  edit(item: any): void {
    this.msg.success(item.email);
  }

}
