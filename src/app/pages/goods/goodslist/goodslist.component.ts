import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseParams } from 'src/app/models';
import { HttpService } from 'src/app/http/http.service';
@Component({
  templateUrl: './goodslist.html',
  styleUrls: ['./goodslist.less']
})
export class GoodsList implements OnInit {
  @Input()
  params: BaseParams = {
    search: {
      barcode: '',
      code: ''
    },
    page_size: 50,
    page_no: 1,
    sort: 'timestamp',
    sortDirKey: 'DESC'
  };
  goodslist: any;
  changecount: any;
  pagecount: any =
    {
      totalPage: 0,
      count: 0
    };
  // 条码
  isItemcode = false;
  tcode: any = 0;
  constructor(private router: Router, private http: HttpService) {

  }

  ngOnInit(): void {
    this.getitemcodes(this.params);
  }

  getitemcodes(params) {
    this.goodslist = [];
    if (this.bcode !== 0) {
      this.params.page_no = 1;
      this.bcode = 0;
    }
    this.params.search.code = '';
    this.isItemcode = true;
    this.isBarcode = false;
    this.cow = (this.params.page_no - 1) * this.params.page_size;
    this.http.getitemwatchlist1.request(this.params)
      .subscribe(row => {
        if (row) {
          this.pagecount.count = row['data']['count'];
          this.changecount = row['data']['count'];
          this.goodslist = row['data']['rows'];
        }
      });
    this.tcode = this.tcode + 1;
  }

  // 编码
  isBarcode: boolean = false;
  bcode: any = 0;
  getbarcodes(params) {
    this.goodslist = [];
    if (this.tcode !== 0) {
      this.params.page_no = 1;
      this.tcode = 0;
    }
    this.params.search.barcode = '';
    this.isBarcode = true;
    this.isItemcode = false;

    this.cow = (this.params.page_no - 1) * this.params.page_size;
    this.http.getitemwatchlist.request(this.params)
      .subscribe(row => {
        if (row) {
          this.pagecount.count = row['data']['count'];
          this.changecount = row['data']['count'];
          this.goodslist = row['data']['rows'];
        }
      });
    this.bcode = this.bcode + 1;
  }

  search() {
    if (this.isItemcode) {
      this.getitemcodes(this.params);
    } else if (this.isBarcode) {
      this.getbarcodes(this.params);
    }
  }



  // 接收翻页操作传过来的值，然后请求服务得到新数据
  cow: number;
  childparams($event) {
    let childoption = $event;
    this.pagecount.page_no = childoption.page_no;
    this.cow = (childoption.page_no - 1) * childoption.page_size;
    if (this.isItemcode) {
      this.getitemcodes(this.params);
    } else if (this.isBarcode) {
      this.getbarcodes(this.params);
    }
  }

  Reset() {
    this.params.search.barcode = '';
    this.params.search.code = '';
    if (this.isItemcode) {
      this.getitemcodes(this.params);
    } else if (this.isBarcode) {
      this.getbarcodes(this.params);
    }
  }

}
