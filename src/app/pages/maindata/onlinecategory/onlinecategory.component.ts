import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BaseParams } from 'src/app/models';
import { HttpService } from 'src/app/http/http.service';
import { GMTToStr, Authbts, Whetherdisplay } from 'src/app/validates/validates';
import { PublicService } from 'src/app/services/public.service';
import { UploadResult } from 'src/app/sharecomponets/upload/upload.component';
import { NzNotificationService, NzModalService } from 'ng-zorro-antd';
import { loadingimage } from 'src/app/images';
@Component({
  templateUrl: './onlinecategory.html',
  styleUrls: ['./onlinecategory.less']
})
export class OnlineCategory implements OnInit {
  // 线上分类查询条款
  // params: BaseParams = {
  //     search: {
  //         code: '',
  //         name: '',
  //         parent: '',
  //         isused: '',
  //     },
  //     sort: 'rowno',
  //     sortDirKey: 'ACS'
  // };
  // 商品主档查询条款
  itemParams: BaseParams = {
    search: {
      name: '',
      barcode: ''
    },
    page_no: 1,
    page_size: 10
  };

  itemPage: any =
    {
      count: 0,
      totalPage: 0
    };
  // @ViewChild(ImportTip)
  // private ImportTip: ImportTip;
  modalwidth: number; // 弹出框宽度
  templeteobj: any; // 提示templete
  modaltitle: string; // 弹出框title
  modalstatus: boolean; // 弹出框状态
  modalconfirloading: boolean; // 弹出框提交loading
  confirmisshow: boolean; // 弹出框是否显示确认按钮
  constructor(private http: HttpService, private publicservice: PublicService, private notification: NzNotificationService, private modalService: NzModalService) {
    this.options = {
      onUpdate: (event: any) => {
      }
    };
    this.notification.config({
      nzPlacement: 'topRight'
    });
  }

  firstCategories: any;

  category: any = {
    id: '',
    code: '',
    name: '',
    parent: '',
    rowno: ''
  };

  options: any;
  parent: {};  // 父级编码
  titletext: String = '添加品类';
  btns: any;
  xzmbbt: Boolean = true;
  xsfldr: Boolean = true;
  bcyjsx: Boolean = true;
  bcejsx: Boolean = true;
  xgbt: Boolean = true;
  kczm: Boolean = true;
  rzbt: Boolean = true;
  bcbt: Boolean = true;
  showlevel2: any = [];
  index: any;
  importtip: Boolean = false;


  ngOnInit(): void {
    this.btns = Authbts('商品管理', '线上品类');
    // console.log(this.btns);
    this.xzmbbt = Whetherdisplay(this.btns, '下载模板');
    this.xsfldr = Whetherdisplay(this.btns, '线上分类导入');
    this.bcyjsx = Whetherdisplay(this.btns, '保存顺序(一级)');
    this.bcejsx = Whetherdisplay(this.btns, '保存顺序(二级)');
    this.xgbt = Whetherdisplay(this.btns, '修改');
    this.kczm = Whetherdisplay(this.btns, '库存置满');
    this.rzbt = Whetherdisplay(this.btns, '日志');
    this.bcbt = Whetherdisplay(this.btns, '保存');
    this.parent = {
      parent: '0'
    };
    this.http.getOnlineCategories.request(this.parent)
      .subscribe(categories => {
        // console.log(categories);
        if (categories['code'] === '010001000') {
          this.categories = categories['data'];
        }
      });
    this.getFirstOnlineCategories();
  }





  categories: any; // 线上分类列表
  getOnlineCategories(parent) {
    this.http.getOnlineCategories.request(parent)
      .subscribe(categories => {
        this.categories = categories['data'];
      });
  }
  // // 线上品类重置
  // reset(): void {
  //     this.params.search.code = '';
  //     this.params.search.name = '';
  //     this.params.search.isused = '';
  // }
  // 主档条件重置
  itemReset(): void {
    this.itemParams.search.barcode = '';
    this.itemParams.search.name = '';
  }

  loadingimgurl: string = loadingimage;
  loadingimg: boolean = false;
  results: any;
  totaldiv3: boolean = false;
  new_results: any;
  // 线上分类导入
  olctgrInput = (result: UploadResult): void => {
    if (result) {
      const sucopt = {
        filename: result.fileName,
        key: result.key,
        local_url: result.localUrl,
        remote_url: result.remoteUrl
      };
      this.http.olctgrinput.request(sucopt)
        .subscribe(data => {
          if (data) {
            this.results = data;
            this.createBasicNotification(this.templeteobj);
          }
        });
    }
  }
  // 导入提示
  createBasicNotification(template: TemplateRef<{}>): void {
    this.notification.template(template, { nzDuration: 0 });
  }

  closediv3() {
    this.importtip = false;
  }
  // 置满库存
  updateStockFull(stock: any) {
    this.modalService.confirm({
      nzTitle: '温馨提示',
      nzContent: '你确定置满该分类售卖状态，且不接收线下库存的商品吗？',
      nzOnOk: () => {
        let online_cat_code = stock.code;
        let data = { online_cat_code: online_cat_code }
        this.http.updatestockfull.request(data)
          .subscribe(tip => {
            if (tip['code'] === '010001000') {
              this.notification.create('success', '温馨提示', tip['data'].msg);

            } else {
              this.notification.create('error', '温馨提示', tip['data'].msg);
            }

          });
      }
    });

  }

  totaldiv12: boolean = false;
  categorylogs: any;
  // 线上分类日志
  categoryLog(category: any) {
    this.http.getonlinecategorieslog.request(category)
      .subscribe(categorylog => {
        if (categorylog['code'] === '010001000') {

          this.categorylogs = categorylog['data'];
          this.modalwidth = 800;
          this.modaltitle = '商品资料';
          this.modalstatus = true;
          this.confirmisshow = false;

        } else {
          this.notification.create('error', '温馨提示', categorylog['msg']);
        }
      });

  }


  getFirstOnlineCategories() {
    this.http.getFirstOnlineCategories.request({ parent: 0 })
      .subscribe(categories => {
        console.log(categories);
        if (categories['code'] === '010001000') {
          this.firstCategories = categories['data'];
        }
      });
  }






  tip: any;


  closemodal() { // 关闭弹出框时重置modalstatus默认值
    this.modalstatus = false;
  }



  // 保存按钮事件
  saveOnlineCategory(category: any) {

    // console.log(category);
    const data = {
      id: category.id,
      code: category.code,
      name: category.name,
      parent: category.parent,
      rowno: category.rowno,
      isused: category.isused
    };

    if (data.code === '' || data.name === '') {
      this.notification.create('error', '温馨提示', '[编码,名称]均不能为空!!!');
    } else {
      if (this.titletext === '添加品类') {

        if (category.parent === '') {
          console.log('添加的是一级分类');
          this.http.saveonlinecategory.request(data)
            .subscribe(tip => {
              if (tip['code'] === "010001000") {
                console.log(tip);
                this.tip = tip;
                if (tip['code'] === false) {
                  this.category.isused = true;
                }

                this.parent = {
                  parent: 0
                };
                this.getOnlineCategories(this.parent);
                this.addOnlineCategory();
              } else {
                this.notification.create('error', '温馨提示', tip['msg']);
              }



            });
        } else {
          console.log('添加的是二级分类');
          this.http.saveonlinecategory.request(data)
            .subscribe(tip => {
              console.log(tip);
              this.tip = tip;
              if (tip['code'] === "010001000") {
                this.category.isused = true;
              }
              this.notification.create('error', '温馨提示', tip['msg']);

              const code = String(category.parent);
              // console.log(code);
              this.http.getOnlineCategories.request({ parent: code })
                .subscribe(categories => {
                  // 获得一级分类的索引
                  const i = this.index;
                  this.level2 = categories['data']['rows'];
                  this.showlevel2[i] = this.level2;

                  console.log(this.showlevel2[i]);
                });
              this.addOnlineCategory();

            });
        }
      } else if (this.titletext === '修改品类') {

        if (category.parent === '0') {
          console.log('修改的是一级分类');
          this.http.saveonlinecategory.request(data)
            .subscribe(tip => {
              console.log(tip);
              this.tip = tip;
              if (tip['code'] !== "010001000") {
                this.category.isused = true;
              }
              this.notification.create('error', '温馨提示', tip['msg']);

              this.parent = {
                parent: 0
              };
              this.getOnlineCategories(this.parent);
              const i = this.index;
              this.selectedbts[i] = false;
              // event.target.value = '+';

            });
        } else {
          console.log('修改的是二级分类');
          this.http.saveonlinecategory.request(data)
            .subscribe(tip => {
              console.log(tip);
              this.tip = tip;
              if (tip['code'] !== "010001000") {
                this.category.isused = true;
              }
              this.notification.create('error', '温馨提示', tip['msg']);

              const code = String(category.parent);
              // console.log(code);
              this.getOnlineCategories('0');
              setTimeout(() => {
                this.http.getOnlineCategories.request({ parent: code })
                  .subscribe(categories => {
                    // 获得一级分类的索引
                    const i = this.index;
                    this.level2 = categories['data']['rows'];
                    this.showlevel2[i] = this.level2;

                    console.log(this.showlevel2[i]);
                  });
              }, 500);
            });
        }
      }

    }


  }

  totaldiv: Boolean = false;
  editbm: Boolean = false;
  getOnlineCategory(category) {
    console.log(category);
    this.http.getFirstOnlineCategories.request({ parent: 0 })
      .subscribe(categories => {
        this.firstCategories = categories['data'];
        this.titletext = '修改品类';
        this.category = category;
        this.editbm = true;
      });
  }

  addOnlineCategory() {
    this.http.getFirstOnlineCategories.request({ parent: 0 })
      .subscribe(categories => {
        this.firstCategories = categories['data'];
        this.titletext = '添加品类';
        this.editbm = false;
        this.category = {
          id: '',
          code: '',
          name: '',
          parent: '',
          rowno: '',
          isused: ''
        };
      });
  }

  level2: any;

  selectedbts: any[] = [];
  clickarr: any[] = [];
  j: number = 0;
  emptytip: any[] = [];




  // 折叠面板
  getlevel2(levelcode, event, i) {

    this.addOnlineCategory();
    this.index = i;
    // console.log(i);

    if (this.selectedbts[i]) {  // 判断点击的按钮是哪种状态，然后切换状态
      this.clickarr[i] = this.j;
      if (this.clickarr[i] % 2 !== 0) {   // 判断一个按钮点了几次，通过取余判断，查看就改为收起
        this.clickarr[i] = 0;
        const code = String(levelcode);
        this.http.getOnlineCategories.request({ parent: code })
          .subscribe(categories => {
            // console.log(categories);
            this.level2 = categories['data']['rows'];
            this.showlevel2[i] = this.level2;
          });
        this.selectedbts[i] = true;
        event.target.value = '-';
      } else {                                     // 收起就改为查看状态
        this.clickarr[i] = 1;
        this.selectedbts[i] = false;
        event.target.value = '+';
      }
    } else {
      let code = String(levelcode);
      this.http.getOnlineCategories.request({ parent: code })
        .subscribe(categories => {
          console.log(categories);
          this.level2 = categories['data']['rows'];
          this.showlevel2[i] = this.level2;
          if (this.showlevel2[i].length > 0) {
            this.emptytip[i] = false;
          } else {
            this.emptytip[i] = true;
          }
        });
      this.selectedbts[i] = true;
      event.target.value = '-';
      this.j = 0;
    }
  }
  savesortorder(categories) {
    this.http.saveSortOrder.request({ categories: categories },)
      .subscribe(tip => {
        this.notification.create('success', '温馨提示', tip['msg']);
        this.parent = {
          parent: '0'
      };
        this.getOnlineCategories(this.parent);
      });
  }
  selectItems: any[] = [];
  selectItem(item: any) {
    let selected = item.itemSfxz;
    if (selected) {
      this.selectItems.push(item);
    } else {
      for (let i = 0; i < this.selectItems.length; i++) {
        let barcode = item.barcode;
        let tempBarcode = this.selectItems[i].barcode;
        if (barcode == tempBarcode) {
          this.selectItems.splice(i, 1);
          break;
        }
      }
    }
  }


  download = filename => this.publicservice.publicdownload(filename);

  addexport() {

    let parame = {
      'path': '/bsp/bspmddata/onlinecategory/getOnlineCategories',
      'search': {
        'code': '',
        'name': '',
        'parent': ''
      },
      'desc': '线上分类',
      'sort': 'rowno',
      'sortDirKey': 'ASC',
      'export_columns': [
        { 'name': '编码', 'key': 'code' },
        { 'name': '名称', 'key': 'name' },
        { 'name': '上级编码', 'key': 'parent' },
        { 'name': '上级名称', 'key': 'parentName' },
        { 'name': '排列顺序', 'key': 'rowno' },
        { 'name': '商品数', 'key': 'count' }
      ]

    };
    this.parent = '0';
    this.http.addexport.request(parame)
      .subscribe(row => {

        if (row) {
          this.notification.create('success', '温馨提示', row['msg']);
        } else {
          this.notification.create('error', '温馨提示', '添加失败,请重试！');
        }

      });
  }


  // 删除一级分类
  getDelOnlineCategory(parame) {
    console.log(parame);
    this.modalService.confirm({
      nzTitle: '温馨提示',
      nzContent: `此分类为 " ${parame.name} [${parame.code}] "，删除后不可恢复，是否确认删除？`,
      nzOnOk: () => {
        console.log('点击了一级分类确定');

        const opt = {
          id: parame.id,
          code: parame.code,
          name: parame.name,
          parent: parame.parent,
          rowno: parame.rowno,
          isused: parame.isused,
          del_status: parame.del_status
        };
        this.http.deldisableonlinecategory.request(opt)
          .subscribe(res => {
            console.log(res);

            if (res['code'] === 0) {
              this.parent = '0';
              setTimeout(() => {
                this.http.getOnlineCategories.request(this.parent)
                  .subscribe(categories => {
                    console.log(categories);
                    this.categories = categories;
                  });
              }, 1000);
            } else {
              this.notification.create('error', '温馨提示', '接口出错，删除失败');
            }
          });
      }
    });

  }


  // 删除二级分类
  getDelOnlineCategorySecond(parame, i) {

    this.modalService.confirm({
      nzTitle: '温馨提示',
      nzContent: `此分类为 " ${parame.name} [${parame.code}] "，删除后不可恢复，是否确认删除？`,
      nzOnOk: () => {
        console.log('点击了二级分类确定');

        const opt = {
          id: parame.id,
          code: parame.code,
          name: parame.name,
          parent: parame.parent,
          rowno: parame.rowno,
          isused: parame.isused,
          del_status: parame.del_status
        };
        this.http.deldisableonlinecategory.request(opt)
          .subscribe(res => {
            console.log(res);

            if (res['code'] === 0) {
              setTimeout(() => {
                const code = String(parame.parent);
                // console.log(code);
                this.http.getOnlineCategories.request(code)
                  .subscribe(categories => {
                    // console.log(categories);
                    this.level2 = categories['rows'];
                    this.showlevel2[i] = this.level2;

                    console.log(this.showlevel2[i]);
                  });
              }, 1000);
            } else {
              this.notification.create('error', '温馨提示', '接口出错，删除失败');
            }
          });
      }
    });

  }
}
