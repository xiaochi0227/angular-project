import { Component, Directive, EventEmitter, OnInit, OnChanges, Input, Output } from '@angular/core';
@Component({
  selector: 'my-page',
  template: `
  <div class="zh-pages" [class.modalpage]="pagetheme">
      <nz-pagination [(nzPageIndex)]="pageIndex" [nzTotal]="pagecount.count" nzShowSizeChanger nzShowQuickJumper
      [nzPageSize]='50' [nzPageSizeOptions]=[10,20,50,100] [nzShowTotal]="totalTemplate" (nzPageIndexChange)=getPageContent(pageIndex)
       (nzPageSizeChange)=getListByPageSize($event)></nz-pagination>
      <ng-template #totalTemplate let-total>共{{pagecount.count}}条信息</ng-template>
     </div>
      `,
  styleUrls: ['page.scss']

})
export class PageComponent implements OnInit, OnChanges {
  @Input() params;
  @Input() pagecount;
  @Input() changecount;
  @Output() childparams: EventEmitter<any> = new EventEmitter<any>();
  oldpagecount: any;
  inputpage_no: any;
  pageIndex = 1;
  @Input() pagetheme;
  constructor() { }
  // getTotalPage为获取当前页码数
  ngOnInit() {
    this.getTotalPage();
  }
  ngOnChanges() {
    this.pagecount.count = this.changecount;
    this.getTotalPage();
  }
  getTotalPage() {
    this.pagecount.totalPage = (this.pagecount.count % this.params.page_size === 0) ?
      Math.floor(this.pagecount.count / this.params.page_size)
      : Math.ceil(this.pagecount.count / this.params.page_size);
    this.inputpage_no = this.params.page_no;
  }


  getPageContent(page: number) {

    // if (page <= 0) {
    //   alert('页数不能小于1!');
    //   this.inputpage_no = this.params.page_no;
    //   return;
    // } else if (page > this.pagecount.totalPage) {
    //   alert('不能大于总页数!');
    //   this.inputpage_no = this.params.page_no;
    //   return;
    // } else {
    this.params.page_no = page;
    this.inputpage_no = this.params.page_no;
    this.childparams.emit(this.params);
    // }

  }

  getListByPageSize(e) {
    this.params.page_size = e;
    this.params.page_no = 1;
    this.childparams.emit(this.params);
    this.getTotalPage();
  }

}

