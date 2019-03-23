import { Component, Input, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BaseParams } from '../../../utils/base.list.params';
import { Router } from '@angular/router';
import { HttpService } from './../../../http/http.service';
import { DatePipe } from '@angular/common';
import { Authbts, Whetherdisplay, GMTToStr } from '../../../validates/validates';
import { NzMessageService } from 'ng-zorro-antd';
import { NzNotificationService, NzModalService  } from 'ng-zorro-antd';
@Component({
  templateUrl: './entstoregrouping.html',
  styleUrls: ['./entstoregrouping.less']
})
export class EntstoreGroupingComponent implements OnInit {
  // 请求参数
  params: any = {
    search: {
      group_name: ''
    },
    page_size: 20,
    page_no: 1
  };
  pageSize =
    {
      totalPage: 0,
      count: 0
    };
  cow: Number = 0; // 序号
  region_name: string;
  changecount: any = 0;
  modalContent: any;
  // @ViewChild(SearchSelect)
  // private Child: SearchSelect;
  configparam: any = {
    group_name: '',
    group_code: '',
    stores: []
  };
  list: any[] = [];
  editgrounp = false;
  detailbox = false;
  grounpdetaillists: any = [];
  selectedstores: any = [];
  detailopt = {
    search: {
      group_code: ''
    },
    page_no: 1,
    page_size: 10
  };
  detailPage: any =
    {
      count: 0,
      totalPage: 0
    };
  constructor(private router: Router, public msg: NzMessageService, private http: HttpService, private notification: NzNotificationService, private modalService: NzModalService) {
  }
  ngOnInit(): void {
    this.getgroupings(this.params);
  }
  testgroupname(groupname) {
    if (groupname.length > 10) {
      const gp = groupname.slice(0, 10);
      this.configparam.group_name = gp;
      // alert('输入需少于10个字!');
      this.notification.create('error', '温馨提示', '输入需少于10个字!');
    }

  }

  change(ret: any) {
    if (ret.to === 'right') {
      for (let i = 0; i < ret.list.length; i++) {
        ret.list[i].direction = 'right';
      }
    }
    if (ret.to === 'left') {
      for (let i = 0; i < ret.list.length; i++) {
        ret.list[i].direction = 'left';
      }
    }
  }
  select(ret: {}): void {
    // console.log('nzSelectChange', ret);
  }
  groupings: any;
  getgroupings(params) {
    this.cow = (params.page_no - 1) * params.page_size;
    // this.entstoreGroupingService.getgroupings(params)
    //     .then(res => {
    //         this.groupings = res.rows;
    //         this.pageSize.count = res.count;
    //         this.changecount = res.count;
    //     });
    this.http.queryStoreGroup.request(params)
      .subscribe(res => {
        this.groupings = res['rows'];
        this.pageSize.count = res['count'];
        this.changecount = res['count'];
      });

  }

  stores: any;
  // 牵牛账号登录获取门店列表
  // getStorelist() {
  //     this.entstoreGroupingService.getStorelist()
  //         .then(stores => {
  //             this.stores = stores;
  //         });
  // }

  // 接收翻页操作传过来的值，然后请求服务得到新数据
  childparams($event) {
    const childoption = $event;
    this.params.page_no = childoption.page_no;
    this.cow = (childoption.page_no - 1) * childoption.page_size;
    this.getgroupings(childoption);
  }
  searchcode($event) {
    this.params.store_code = $event;

  }
  search(params) {
    this.params.page_no = 1;
    this.getgroupings(params);
  }
  Reset() {
    this.params.search.group_name = '';
    // this.params.store_code = '';
    // this.Child.clearshowtextvalue();
  }

  isVisible = false;
  isConfirmLoading = false;
  modeltitle: any;
  addstoregrouping() {

    const storearr = [];
    const opt = {
      group_code: '',
      search: ''
    };
    // this.entstoreGroupingService.findStore(opt)
    //     .then(stores => {
    //         this.stores = stores;
    //         for (let i = 0; i < this.stores.length; i++) {
    //             // this.stores[i].title = stores[i].code + stores[i].name + stores[i].city;
    //             this.stores[i].direction = 'left';
    //         }
    //         if (this.stores) {
    //             this.editgrounp = true;
    //             this.modeltitle = '新增门店分组';
    //             this.configparam.group_name = '';
    //             this.showModal();
    //         }
    //     });
    this.http.findStore.request(opt)
      .subscribe(stores => {
        this.stores = stores;
        for (let i = 0; i < this.stores.length; i++) {
          // this.stores[i].title = stores[i].code + stores[i].name + stores[i].city;
          this.stores[i].direction = 'left';
        }
        if (this.stores) {
          this.editgrounp = true;
          this.modeltitle = '新增门店分组';
          this.configparam.group_name = '';
          this.showModal();
        }
      });


  }
  showModal = () => {
    this.isVisible = true;
  }

  handleOk = (e) => {
    if (this.detailbox) {
      this.handleCancel(e);
      this.isConfirmLoading = false;
      console.log(123);
    }
    if (this.editgrounp) {
      this.isConfirmLoading = true;
      this.selectedstores = [];
      for (let i = 0; i < this.stores.length; i++) {
        if (this.stores[i].direction === 'right') {
          this.selectedstores.push(this.stores[i]);
        }
      }
      if (this.modeltitle === '修改门店分组') {
        let stores: any = [];
        for (let i = 0; i < this.selectedstores.length; i++) {
          const opt = {
            store_code: this.selectedstores[i].code,
            store_name: this.selectedstores[i].name,
            status: ''
          };
          stores.push(opt);
        }

        // let saveopt: any;
        // if (this.modeltitle === '增加门店分组') {

        // } else if(this.modeltitle === '修改门店分组'){
        //     const saveopt2 = {
        //         group_name: this.configparam.group_name,
        //         stores: stores,
        //         group_code: this.configparam.group_code
        //     };
        //     saveopt = saveopt2;
        // }
        // console.log(saveopt);
        this.configparam.stores = stores;
        // this.entstoreGroupingService.savegrouping(this.configparam)
        //     .then(res => {
        //         alert(res.message);
        //         this.handleCancel(e);
        //         this.isConfirmLoading = false;
        //         this.getgroupings(this.params);
        //     });
        this.http.saveStoreGroup.request(this.configparam)
          .subscribe(res => {
            // alert(res['message']);
            this.notification.create('success', '温馨提示', res['message']);
            this.handleCancel(e);
            this.isConfirmLoading = false;
            this.getgroupings(this.params);
          });
      } else if (this.modeltitle === '新增门店分组') {
        if (this.selectedstores.length > 0) {
          let stores: any = [];
          for (let i = 0; i < this.selectedstores.length; i++) {
            const opt = {
              store_code: this.selectedstores[i].code,
              store_name: this.selectedstores[i].name,
              status: ''
            };
            stores.push(opt);
          }

          // let saveopt: any;
          // if (this.modeltitle === '增加门店分组') {

          // } else if(this.modeltitle === '修改门店分组'){
          //     const saveopt2 = {
          //         group_name: this.configparam.group_name,
          //         stores: stores,
          //         group_code: this.configparam.group_code
          //     };
          //     saveopt = saveopt2;
          // }
          // console.log(saveopt);
          this.configparam.stores = stores;
          if (this.configparam.group_name) {
            // this.entstoreGroupingService.savegrouping(this.configparam)
            // .then(res => {
            //     alert(res.message);
            //     this.handleCancel(e);
            //     this.isConfirmLoading = false;
            //     this.getgroupings(this.params);
            // });
            this.http.saveStoreGroup.request(this.configparam)
              .subscribe(res => {
                // alert(res['message']);
                this.notification.create('success', '温馨提示', res['message']);

                this.handleCancel(e);
                this.isConfirmLoading = false;
                this.getgroupings(this.params);
              });
          } else {
            // alert('请填写分组名称');
            this.notification.create('error', '温馨提示', '请填写分组名称');

            this.isConfirmLoading = false;
          }
        } else {
          // alert('请至少选择一个门店');
          this.notification.create('error', '温馨提示', '请至少选择一个门店');

          this.isConfirmLoading = false;
        }
      }
    }
  }

  handleCancel = (e) => {
    this.isVisible = false;
    this.editgrounp = false;
    this.detailbox = false;
  }
  changedetailcount: any;
  cow1 = 0;
  gotodetailfun(opt) {
    this.cow1 = (opt.page_no - 1) * opt.page_size;
    // this.entstoreGroupingService.getgounplists(opt)
    //     .then(res => {
    //         console.log(res);
    //         this.grounpdetaillists = res.rows;
    //         this.detailPage.count = res.total;
    //         this.changedetailcount = res.total;
    //     });
    this.http.findDistributionStore.request(opt)
      .subscribe(res => {
        console.log(res);
        this.grounpdetaillists = res['rows'];
        this.detailPage.count = res['total'];
        this.changedetailcount = res['total'];
      });
  }
  gotodetail(groupcode) {
    this.modeltitle = '分组门店详情';
    this.detailbox = true;
    this.editgrounp = false;
    this.detailopt.search.group_code = groupcode;
    this.detailopt.page_no = 1;
    this.gotodetailfun(this.detailopt);
    this.showModal();
  }
  detailchildparams($event) {
    const childoption = $event;
    this.detailPage.page_no = childoption.page_no;
    this.cow1 = (childoption.page_no - 1) * childoption.page_size;
    this.gotodetailfun(this.detailopt);

  }
  // 修改d单个门店分组
  editdetail(configopt) {
    const storearr = [];
    const opt = {
      group_code: configopt.group_code,
      search: ''
    };
    // this.entstoreGroupingService.findStore(opt)
    //     .then(stores => {
    //         this.stores = stores;
    //         for (let i = 0; i < this.stores.length; i++) {
    //             this.stores[i].title = this.stores[i].code + this.stores[i].name + this.stores[i].city;
    //             if (this.stores[i].sfxz) {
    //                 this.stores[i].direction = 'right';
    //             } else {
    //                 this.stores[i].direction = 'left';
    //             }
    //         }
    //         if (this.stores) {
    //             this.editgrounp = true;
    //             this.modeltitle = '修改门店分组';
    //             this.configparam.group_name = configopt.group_name;
    //             this.configparam.group_code = configopt.group_code;
    //             this.showModal();
    //         }
    //     });
    this.http.findStore.request(opt)
      .subscribe(stores => {
        this.stores = stores;
        for (let i = 0; i < this.stores.length; i++) {
          this.stores[i].title = this.stores[i].code + this.stores[i].name + this.stores[i].city;
          if (this.stores[i].sfxz) {
            this.stores[i].direction = 'right';
          } else {
            this.stores[i].direction = 'left';
          }
        }
        if (this.stores) {
          this.editgrounp = true;
          this.modeltitle = '修改门店分组';
          this.configparam.group_name = configopt.group_name;
          this.configparam.group_code = configopt.group_code;
          this.showModal();
        }
      });
  }
  del(groupcode) {
    const gcode = {
      group_code: String(groupcode)
    };
    this.modalService.confirm({
      nzTitle: '温馨提示',
      nzContent: '您是否要删除本条记录？',
      nzOnOk: () => {
        // this.entstoreGroupingService.delgrouping(gcode)
        //     .then(res => {
        //         alert(res.message);
        //         this.getgroupings(this.params);
        //     });
        this.http.delStoreGroup.request(gcode)
          .subscribe(res => {
            // [                alert(res['message']);
            this.notification.create('success', '温馨提示', res['msg']);
            this.getgroupings(this.params);
          });

      }
    });
  }
}
