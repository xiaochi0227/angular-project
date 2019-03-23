import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/http/http.service';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'app-memberclassify',
  templateUrl: './memberclassify.component.html',
  styleUrls: ['./memberclassify.component.less']
})
export class MemberclassifyComponent implements OnInit {

  public storeList: any;
  params: any = {
    page_no: 1,
    page_size: 10,
    search: {
      region_code: ""
    }
  };
  public categories: any;
  constructor(private http: HttpService, private notification: NzNotificationService) {
    this.notification.config({
      nzPlacement: 'topRight'
    });
  }

  ngOnInit() {
    this.getStorelist();
  }

  // 获取门店列表
  getStorelist() {
    this.http.getStorelist.request({})
      .subscribe(data => {
        this.storeList = data;
        console.log(this.storeList);
        this.params.search.region_code = this.storeList[0].code;
        this.getonlineCategories();
      });
  }

  // 获取分类
  getonlineCategories() {
    console.log(this.params);
    this.http.queryPickerCategory.request(this.params)
      .subscribe(data => {
        console.log(data);
        this.categories = data;
      });
  }

  savememberclassify() {
    console.log(this.categories);
    let params = {
      region_code: this.params.search.region_code,
      category: this.categories
    };
    this.http.savePickerCategory.request(params)
      .subscribe(data => {
        this.notification.create('success', '温馨提示', data['msg']);
      });
  }


}
