import { Component, Input, OnInit } from '@angular/core';
import { HttpService } from 'src/app/http/http.service';
import { Authbts, Whetherdisplay } from 'src/app/validates/validates';
import { BaseParams } from 'src/app/utils/base.list.params';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  templateUrl: './renamegoods.html',
  styleUrls: ['./renamegoods.less']
})
export class RenameGoodsComponent implements OnInit {
  @Input()
  params: BaseParams = {
    search: {
      name: ''
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
  // cow: number;
  renamelists: any;
  btns: any;

  dcgcsvwj = true;
  modalwidth: number; // 弹出框宽度
  templeteobj: any; // 提示templete
  modaltitle: string; // 弹出框title
  modalstatus: boolean; // 弹出框状态
  modalconfirloading: boolean; // 弹出框提交loading
  confirmisshow: boolean; // 弹出框是否显示确认按钮
  constructor(private http: HttpService, private notification: NzNotificationService) {
    this.notification.config({
      nzPlacement: 'topRight'
    });
  }

  ngOnInit(): void {
    this.btns = Authbts('商品管理', '异常商品');
    this.dcgcsvwj = Whetherdisplay(this.btns, '导出到CSV文件');
    // console.log(this.btns);

    this.getrenameList(this.params);
  }

  // 输入条件查询方法
  search(paramsoption) {
    paramsoption.page_no = 1;
    this.getrenameList(paramsoption);
  }
  // 商品重名列表
  getrenameList(param): void {
    this.http.getrenameList.request(param)
      .subscribe(renamelists => {
        this.renamelists = renamelists['data'].rows;
      });
  }
  totaldiv: boolean = false;
  detalrenames: any;
  seedetails(renamelist) {
    this.modalwidth = 800;
    this.modaltitle = '重复商品';
    this.modalstatus = true;
    this.confirmisshow = false;
    this.http.getbynamelist.request(renamelist)
      .subscribe(detalrenames => {
        this.detalrenames = detalrenames['data'];
      });
    this.totaldiv = true;
  }
  closemodal() { // 关闭弹出框时重置modalstatus默认值
    this.modalstatus = false;
  }
  updaterename(detalrename) {
    this.http.updaterename.request(detalrename)
      .subscribe(tip => {
        this.notification.create('success', '温馨提示', tip['msg']);
        this.totaldiv = false;
      });
  }
  // 重置
  Reset() {
    this.params.search.name = '';
  }



  addexport() {
    let exportname: any, name: any;
    if (this.params.search.name) { name = this.params.search.name + '-'; } else { name = ''; }
    exportname = name;
    let parame = {
      'path': '/test-export-bsp/item/getrepetitionlist',
      'search': {
        'name': '',
      },
      'desc': exportname + '异常商品',
      'sort': 'count',
      'sortDirKey': 'DESC',
      'export_columns': [
        { 'name': '线下名称', 'key': 'name' },
        { 'name': '线上名称', 'key': 'm_desc' },
        { 'name': '重复数', 'key': 'count' }
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
  handleokfun($event) {

  }
}
