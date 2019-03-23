import { Component, Input, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { BaseParams } from 'src/app/utils/base.list.params';
import { Authbts, Whetherdisplay } from 'src/app/validates/validates';
import { HttpService } from 'src/app/http/http.service';
import { UploadResult } from 'src/app/sharecomponets/upload/upload.component';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';


@Component({
  templateUrl: './autoshelf.html',
  styleUrls: ['./autoshelf.less']
})
export class AutoShelfComponent implements OnInit {
  params: BaseParams = {
    search: {
      item_code: '',
      name: '',
      barcode: '',
      status: '',
      // startdate: '',
      // enddate: ''
    },
    page_size: 50,
    page_no: 1,
    sort: 'timestamp',
    sortDirKey: 'DESC'
  };
  pageSize =
    {
      totalPage: 0,
      count: 0
    };
  autoshelfs: any; // 上下架列表
  totaldiv = false;
  titletext: string;  // 弹窗模板名称
  autoshelf: any = {
    item_code: '',
    barcode: '',
    status: '1',
    region_code: '',
    name: '',
    startdate: '',
    endate: '',
    offtime: '',
    ontime: '',
    onnum: 0
  };
  cow: number;
  editbm = false;
  btns: any;

  tjbt = true;
  xzmbbt = true;
  zdsxjqddr = true;
  results: any;
  public timeList = [];
  // start: string;  // 格式化开始时间
  // end: string;   // 格式化结束时间
  constructor(private http: HttpService, private modalService: NzModalService, private notification: NzNotificationService) {
    this.notification.config({
      nzPlacement: 'topRight'
    });
  }




  ngOnInit(): void {
    for (let i = 1; i < 25; i++) {
      this.timeList.push(i);
    }
    this.btns = Authbts('商品管理', '自动上下架清单');
    // console.log(this.btns);
    this.tjbt = Whetherdisplay(this.btns, '添加');
    this.xzmbbt = Whetherdisplay(this.btns, '下载模板');
    this.zdsxjqddr = Whetherdisplay(this.btns, '自动上下架清单导入');
    this.getautoshelfs(this.params);
  }
  // 接收翻页操作传过来的值，然后请求服务得到新数据
  childparams($event) {
    const childoption = $event;
    this.params.page_no = childoption.page_no;
    this.cow = (childoption.page_no - 1) * childoption.page_size;
    this.getautoshelfs(childoption);
  }
  changecount: any = 0;
  //  获取上下架清单
  getautoshelfs(params) {
    this.cow = (params.page_no - 1) * params.page_size;
    this.http.getautoshelfs.request(params)
      .subscribe(autoshelfs => {
        this.autoshelfs = autoshelfs['data']['rows'];
        this.pageSize.count = autoshelfs['data']['count'];
        this.changecount = autoshelfs['data']['count'];
      });
  }


  handleCancel() {
    this.modalService.closeAll();
    this.getautoshelfs(this.params);
  }
  saveAddshelf(autoshelf) {

    if (autoshelf.barcode === '') {
      this.notification.create('error', '温馨提示', '商品条码不能为空，请重新输入！');
      return false;
    }


    if (autoshelf.item_code === '') {
      this.notification.create('error', '温馨提示', '商品编码不能为空，请重新输入！');
      return false;
    }
    if (autoshelf.ontime === '' || autoshelf.offtime === '') {
      this.notification.create('error', '温馨提示', '上下架时间不能为空，请重新输入！');
    } else {
      this.compareDate(autoshelf.startdate, autoshelf.enddate, autoshelf);
    }


  }

  compareDate(checkStartDate, checkEndDate, autoshelf) {
    let arys1 = new Array();
    let arys2 = new Array();
    if (checkStartDate != null && checkEndDate != null) {
      arys1 = String(checkStartDate).split('-');
      let sdate = new Date(arys1[0], parseInt(arys1[1]) - 1, arys1[2]);
      arys2 = String(checkEndDate).split('-');
      let edate = new Date(arys2[0], parseInt(arys2[1]) - 1, arys2[2]);
      if (sdate > edate) {
        this.notification.create('warning', '温馨提示', '开始日期不能大于结束日期,请重新设置日期!');
      } else {
        let datePipe = new DatePipe('en-US');
        autoshelf.startdate = datePipe.transform(checkStartDate, 'yyyy-MM-dd 00:00:00');
        autoshelf.enddate = datePipe.transform(checkEndDate, 'yyyy-MM-dd 23:59:59');
        this.http.addAutoshelf.request(autoshelf)
          .subscribe(tip => {
            if (tip['code'] === "010001000") {
              this.notification.create('success', '温馨提示', tip['msg']);
              this.modalService.closeAll();
            } else {
              this.notification.create('error', '温馨提示', tip['msg']);
            }
          });
      }
    } else {
      this.http.addAutoshelf.request(autoshelf)
        .subscribe(tip => {
          if (tip['code'] === "010001000") {
            this.notification.create('success', '温馨提示', tip['msg']);
            this.modalService.closeAll();
          } else {
            this.notification.create('error', '温馨提示', tip['msg']);
          }
        });
    }
  }

  editAutoShelf(autoshelf, showModal, modalFooter) {
    console.log(autoshelf);
    this.autoshelf = autoshelf;
    this.editbm = true;
    this.modalService.create({
      nzTitle: '修改',
      nzWidth: "75%",
      nzContent: showModal,
      nzFooter: modalFooter

    });
  }
  addAutoShelf(showModal, modalFooter) {
    this.autoshelf = {
      item_code: '',
      barcode: '',
      status: '1',
      region_code: '',
      name: '',
      startdate: '',
      enddate: '',
      offtime: '',
      ontime: '',
      onnum: 0
    };
    this.modalService.create({
      nzTitle: '添加',
      nzWidth: "75%",
      nzContent: showModal,
      nzFooter: modalFooter

    });
    this.editbm = false;
  }
  onUploaded = (result: UploadResult) => {

    this.importtip = true;

    let opt = {
      fileName: result.fileName,
      key: result.key,
      localUrl: result.localUrl,
      remoteUrl: result.remoteUrl,
    };
    this.taskonoffinput(opt);


  }
  taskonoffinput(opt) {
    this.http.taskonoffinput.request(opt)
      .subscribe(data => {
        if (data['code'] === "010001000") {
          this.results = data;
          this.notification.create('success', '温馨提示', data['msg'])
        } else {
          this.notification.create('error', '温馨提示', data['msg'])
        }
      });
  }
  // 自动上下架清单导入
  // taskonoffinput(file: HTMLInputElement): void {
  //   this.importtip = true;
  //   const form = new FormData();
  //   form.append('file', file.files[0], file.files[0].name);
  //   this.http.taskonoffinput.request(form)
  //     .subscribe(data => {
  //       if (data) {
  //         this.results = data;
  //       }
  //     });
  // }


  // 下载模板
  download(filename: string) {
    this.http.download.request({ xh: filename })
      .subscribe(data => {
        const link = document.createElement('a');
        link.setAttribute('href', window.URL.createObjectURL(data));
        link.setAttribute('download', filename + '.xlsx');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
  }


  // 查询
  search() {
    this.getautoshelfs(this.params);
  }

  // 重置
  Reset() {
    this.params.search.item_code = '',
      this.params.search.barcode = '',
      this.params.search.name = '',
      this.params.search.status = ''
  }
  importtip: boolean = false;
  closeimportip() {
    this.importtip = false;
  }

  addexport() {
    let exportname: any, name: any;
    if (this.params.search.name) { name = this.params.search.name + '-'; } else { name = ''; }
    exportname = name;
    let parame = {
      'path': '/test-goods-bsp/bsp/autoShelf/queryAutoshelfList',
      'search': {
        'name': '',
      },
      'desc': exportname + '自动上下架清单',
      'sort': 'count',
      'sortDirKey': 'DESC',
      'export_columns': [
        { 'name': '状态', 'key': 'status' },
        { 'name': '门店编码', 'key': 'region_code' },
        { 'name': '商品编码', 'key': 'item_code' },
        { 'name': '商品条码', 'key': 'barcode' },
        { 'name': '商品名称', 'key': 'name' },
        { 'name': '开始时间', 'key': 'startdate' },
        { 'name': '结束时间', 'key': 'enddate' },
        { 'name': '上架时间', 'key': 'ontime' },
        { 'name': '下架时间', 'key': 'offtime' },
        { 'name': '上架数量', 'key': 'onnum' }
      ]

    };
    parame.search = this.params.search;

    this.http.addexport.request(parame)
      .subscribe(row => {
        if (row) {
          this.notification.create('success', '温馨提示', row['msg']);
        } else {
          this.notification.create('error', '温馨提示', '添加失败,请重试！');
        }

      });
  }

  // 查看门店商品售卖状态
  totaltype: boolean = false;
  itemregionstatus: any;
  getitemregionstatus(par, showModal) {

    this.http.getitemregionstatus.request(par)
      .subscribe(row => {
        if (row['code'] === "010001000") {
          this.itemregionstatus = row['data'];
          this.modalService.create({
            nzTitle: '修改',
            nzWidth: "75%",
            nzContent: showModal,

          });
        } else {
          this.notification.create('error', '温馨提示', row['msg'])
        }

      });
  }

  closetotaltype() {
    this.totaltype = false;
  }
}
