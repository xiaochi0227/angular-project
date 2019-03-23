import { Component, Input, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BaseParams } from '../../../utils/base.list.params';
import { NzNotificationService, NzModalService } from 'ng-zorro-antd';
import { HttpService } from '../../../http/http.service';


@Component({
  templateUrl: './storebusinessset.html',
  styleUrls: ['./storebusinessset.less']
})
export class StorebusinesssetComponent implements OnInit {
  // 请求参数
  params: BaseParams = {
    search: {
      channel: '',
      city: '',
      region_code: '',
      yy_status: '',
      jy_status: '',
      name: ''
    },
    page_size: 20,
    page_no: 1,
    sort: 'timestamp',
    sortDirKey: 'DESC'
  };
  pageSize =
    {
      totalPage: 0,
      count: 0
    };
  itemlists: any;
  itemdate: any;
  cow = 0; // 序号
  channels: any[];
  changecount: any = 0;
  pt: any = 0;
  selectitemarr: any = []; // 批量操作选中的门店

  ztopt = { // 批量操作营业状态保存传参
    status: '',
    channel: '',
    stores: []
  };
  jyztopt = { // 批量操作经营状态保存传参
    status: '',
    channel: '',
    stores: []
  };
  yytimeopt = {
    stores: [],
    channel: '',
    yy_time: []
  };
  timearr: any = [
    { start: null, end: null }
  ];
  allchecked = false;
  stores: any;
  region_name: any;
  // @ViewChild(SearchSelect)
  // private Child: SearchSelect;
  constructor(private notification: NzNotificationService, private http: HttpService, private modalService: NzModalService) {
    this.notification.config({
      nzPlacement: 'topRight'
    });
  }
  ngOnInit(): void {
    // this.storebusinesssetService.getchannels()
    //   .then(channels => {
    //     this.channels = channels.rows;
    //     this.params.search.name = channels.rows[0].name;
    //     this.params.search.channel = this.channels[0].channel_keyword;
    //     this.getstorebusiness(this.params);
    //   });
    this.http.getChannels.request({ 'ebls_split': true })
      .subscribe(channels => {
        this.channels = channels['rows'];
        this.params.search.name = channels['rows'][0].name;
        this.params.search.channel = this.channels[0].channel_keyword;
        this.getstorebusiness(this.params);
      });
    this.getStorelist();
  }
  // 获取门店列表
  getStorelist() {
    // this.storebusinesssetService.getStorelist()
    //   .then(stores => {
    //     // const tmp = [{ code: '', codename: '全部门店' }].concat(stores);
    //     this.stores = stores;
    //   });
    this.http.getStorelist.request()
      .subscribe(stores => {
        // const tmp = [{ code: '', codename: '全部门店' }].concat(stores);
        this.stores = stores;
      });
  }
  searchcode($event) {
    this.params.search.region_code = $event;
    // this.getreplists(this.params);
  }
  // 门店列表选择显示编码加名称
  searchname($event) {
    this.region_name = $event;
  }
  // 获取汇总列表
  getstorebusiness(param) {
    this.allchecked = false;
    this.selectitemarr = [];
    this.cow = (param.page_no - 1) * param.page_size;
    // this.storebusinesssetService.getstorebusiness(param)
    //   .then(res => {
    //     this.itemdate = res;
    //     this.itemlists = res.rows;
    //     this.pageSize.count = res.count;
    //     this.changecount = res.count;
    //     // console.log(commoditylists);
    //   });
    this.http.findChannelStore.request(param)
      .subscribe(res => {
        this.itemdate = res;
        this.itemlists = res['rows'];
        this.pageSize.count = res['count'];
        this.changecount = res['count'];
      });

  }



  getselectlist(channel) {
    this.params.search.channel = channel.channel_keyword;
    this.params.search.name = channel.name;
    this.getstorebusiness(this.params);

  }
  getQuery() {
    this.getstorebusiness(this.params);
  }
  selectitem(item) { // 单个复选框点击
    if (item.sfxz) {
      this.selectitemarr.push(item);
      if (this.selectitemarr.length === this.itemlists.length) {
        this.allchecked = true;
      }
    } else {
      this.allchecked = false;
      for (let i = 0; i < this.selectitemarr.length; i++) {
        if (item.region_code === this.selectitemarr[i].region_code) {
          this.selectitemarr.splice(i, 1);
          break;
        }
      }
    }
  }

  setallcheck(allcheck) { // 全选
    if (allcheck) {
      for (let i = 0; i < this.itemlists.length; i++) {
        this.itemlists[i].sfxz = true;
      }
      this.selectitemarr = JSON.parse(JSON.stringify(this.itemlists));
    } else {
      for (let i = 0; i < this.itemlists.length; i++) {
        this.itemlists[i].sfxz = false;
      }
      this.selectitemarr = [];
    }
  }


  changeyystatus(item) {  // 单个修改营业状态
    this.modalService.confirm({
      nzTitle: '温馨提示',
      nzContent: '确定取消本配送类型吗？取消后确认要修改营业状态吗？正在使用本配送类型的门店将无法使用',
      nzOnOk: () => {
        this.ztopt.stores = [];
        this.ztopt.stores.push(item.region_code);
        this.ztopt.channel = this.params.search.channel;
        this.ztopt.status = item.yy_status;
        console.log(this.ztopt);
        // this.storebusinesssetService.savestatus(this.ztopt)
        //   .then(res => {
        //     this.isConfirmLoading = false;
        //     this.notification.blank('提示', res.msg);
        //     this.handleCancel();
        //     this.getstorebusiness(this.params);
        //   });
        this.http.channelStoreyyStatus.request()
          .subscribe(res => {
            this.isConfirmLoading = false;
            this.notification.create('success', '温馨提示', res['msg']);
            this.handleCancel();
            this.getstorebusiness(this.params);
          });
      },
      nzOnCancel: () => {
        this.getstorebusiness(this.params);
      }
    });

  }

  changejystatus(item) {  // 单个修改经营状态

    this.modalService.confirm({
      nzTitle: '温馨提示',
      nzContent: '确认要修改经营状态吗？',
      nzOnOk: () => {
        this.jyztopt.stores = [];
        this.jyztopt.stores.push(item.region_code);
        this.jyztopt.channel = this.params.search.channel;
        this.jyztopt.status = item.jy_status;
        //  v
        this.http.channelStorejyStatus.request(this.jyztopt)
          .subscribe(res => {
            this.isConfirmLoading = false;
            this.notification.create('success', '温馨提示', res['msg']);
            this.handleCancel();
            this.getstorebusiness(this.params);
          });
      },
      nzOnCancel: () => {
        this.getstorebusiness(this.params);
      }
    });

  }

  // 获取渠道
  getchannels(): void {
    this.http.getChannels.request({ 'ebls_split': true })
      .subscribe(channels => {
        this.channels = channels['rows'];
        this.params.search.channel = this.channels[0].code;
      }
      );
  }
  // 接收翻页操作传过来的值，然后请求服务得到新数据
  childparams($event) {
    const childoption = $event;
    this.params.page_no = childoption.page_no;
    this.cow = (childoption.page_no - 1) * childoption.page_size;
    this.getstorebusiness(childoption);
  }

  search(param) {
    this.getstorebusiness(param);
  }

  Reset() {
    this.params.search.city = '';
    this.params.search.region_code = '';
    // this.Child.clearshowtextvalue();
    this.params.search.yy_status = '';
    this.params.search.jy_status = '';
  }

  isVisible = false;
  isConfirmLoading = false;
  modeltitle: any;
  yyzt = false;
  yysj = false;
  jyzt = false;
  edititemtime = false;
  setopenstatus() { // 批量设置营业状态
    if (this.selectitemarr.length < 1) {
      this.notification.create('warning', '提示', '请至少选择一项进行操作!');
    } else {
      this.yyzt = true;
      this.yysj = false;
      this.edititemtime = false;
      this.jyzt = false;
      this.ztopt.status = '';
      this.modeltitle = '批量设置营业状态';
      this.showModal();
    }

  }
  setopenjystatus() { // 批量设置经营状态
    if (this.selectitemarr.length < 1) {
      this.notification.create('warning', '提示', '请至少选择一项进行操作!');
    } else {
      this.yyzt = false;
      this.yysj = false;
      this.edititemtime = false;
      this.jyzt = true;
      this.jyztopt.status = '';
      this.modeltitle = '批量设置经营状态';
      this.showModal();
    }
  }
  setopentime() { // 批量设置营业时间
    if (this.selectitemarr.length < 1) {
      this.notification.create('warning', '提示', '请至少选择一项进行操作!');
    } else {
      this.yysj = true;
      this.yyzt = false;
      this.jyzt = false;
      this.edititemtime = false;
      this.yytimeopt.yy_time = [];
      this.modeltitle = '批量设置营业时间';
      this.showModal();
    }
  }
  itemtimearr: any = [];

  edititemtimefun(itemtime) { // 单个设置营业时间
    console.log(itemtime);

    this.yytimeopt.yy_time = [];
    if (itemtime.yy_time) {
      this.itemtimearr = [];


      for (let i = 0; i < itemtime.yy_time.length; i++) {
        const d = new Date();
        console.log(this.itemtimearr[i]);
        let arrobj = { start: null, end: null };
        arrobj.start = itemtime.yy_time[i].substr(0, 5);
        arrobj.end = itemtime.yy_time[i].substr(6, 5);

        this.itemtimearr.push(arrobj);
      }
      console.log(this.itemtimearr);
      for (let i = 0; i < this.itemtimearr.length; i++) {
        const d = new Date();
        this.itemtimearr[i].start = d.setHours(this.itemtimearr[i].start.substr(0, 2),
          this.itemtimearr[i].start.substr(3, 2));
        this.itemtimearr[i].end = d.setHours(this.itemtimearr[i].end.substr(0, 2),
          this.itemtimearr[i].end.substr(3, 2));
      }
    } else {
      this.itemtimearr = [{ start: null, end: null }];
    }

    this.yytimeopt.stores = [];
    this.yytimeopt.stores.push(itemtime.region_code);

    this.modeltitle = '设置营业时间';
    this.yysj = false;
    this.yyzt = false;
    this.jyzt = false;
    this.edititemtime = true;
    this.showModal();
  }
  _console(value) {
    console.log(value);
  }
  n: any = 0;
  m: any = 0;

  addBtn() { // 批量设置时间时添加一个时间范围
    this.n++;
    const dateitem: any = {
      start: '',
      end: ''
    };
    this.timearr.push(dateitem);
  }

  addBtnitem() { // 单个设置时间时添加一个时间范围
    this.m++;
    const dateitem: any = {
      start: '',
      end: ''
    };
    this.itemtimearr.push(dateitem);
  }

  // 批量设置时间时删除一个时间范围
  delBtn(index: any) {
    this.timearr.splice(index, 1);
  }
  // 单个设置时间时删除一个时间范围
  delBtnitem(index: any) {
    this.itemtimearr.splice(index, 1);
  }
  showModal = () => {

    this.isVisible = true;
  }

  handleOk = (e) => {
    // this.isConfirmLoading = true;
    if (this.yyzt) { // 批量设置营业状态保存
      this.ztopt.channel = this.params.search.channel;
      this.ztopt.stores = [];
      for (let i = 0; i < this.selectitemarr.length; i++) {
        this.ztopt.stores.push(this.selectitemarr[i].region_code);
      }
      console.log(this.ztopt);
      // this.storebusinesssetService.savestatus(this.ztopt)
      //   .then(res => {
      //     this.isConfirmLoading = false;
      //     this.notification.blank('提示', res.msg);
      //     this.handleCancel();
      //     this.getstorebusiness(this.params);
      //   });
      this.http.channelStoreyyStatus.request()
        .subscribe(res => {
          this.isConfirmLoading = false;
          this.notification.create('success', '温馨提示', res['msg']);
          this.handleCancel();
          this.getstorebusiness(this.params);
        });
    }
    if (this.jyzt) {// 批量设置经营状态保存
      this.jyztopt.channel = this.params.search.channel;
      this.jyztopt.stores = [];
      for (let i = 0; i < this.selectitemarr.length; i++) {
        this.jyztopt.stores.push(this.selectitemarr[i].region_code);
      }
      console.log(this.jyztopt);
      // this.storebusinesssetService.savejystatus(this.jyztopt)
      //   .then(res => {
      //     this.isConfirmLoading = false;
      //     this.notification.blank('提示', res.msg);
      //     this.handleCancel();
      //     this.getstorebusiness(this.params);
      //   });
      this.http.channelStorejyStatus.request(this.jyztopt)
        .subscribe(res => {
          this.isConfirmLoading = false;
          this.notification.create('success', '温馨提示', res['msg']);
          this.handleCancel();
          this.getstorebusiness(this.params);
        });
    }

    if (this.yysj) {// 批量设置营业时间保存
      this.yytimeopt.channel = this.params.search.channel;
      this.yytimeopt.stores = [];
      this.yytimeopt.yy_time = [];
      let check = false;
      for (let i = 0; i < this.selectitemarr.length; i++) {
        this.yytimeopt.stores.push(this.selectitemarr[i].region_code);
      }
      for (let i = 0; i < this.timearr.length; i++) {
        let shourstr: any = '';
        let sminutesstr: any = '';
        let ehourstr: any = '';
        let eminutesstr: any = '';
        if (this.timearr[i].start && this.timearr[i].end) {
          check = true;
          if (this.timearr[i].start.getHours() >= 10) {
            shourstr = this.timearr[i].start.getHours();
          } else {
            shourstr = '0' + this.timearr[i].start.getHours();
          }
          if (this.timearr[i].start.getMinutes() >= 10) {
            sminutesstr = this.timearr[i].start.getMinutes();
          } else {
            sminutesstr = '0' + this.timearr[i].start.getMinutes();
          }

          if (this.timearr[i].end.getHours() >= 10) {
            ehourstr = this.timearr[i].end.getHours();
          } else {
            ehourstr = '0' + this.timearr[i].end.getHours();
          }
          if (this.timearr[i].end.getMinutes() >= 10) {
            eminutesstr = this.timearr[i].end.getMinutes();
          } else {
            eminutesstr = '0' + this.timearr[i].end.getMinutes();
          }
          const timeobjstart = shourstr + ':' + sminutesstr;

          const timeobjend = ehourstr + ':' + eminutesstr;
          const opt = timeobjstart + '-' + timeobjend;
          this.yytimeopt.yy_time.push(opt);
        } else {
          this.isConfirmLoading = false;
          this.notification.create('error', '温馨提示', '开始时间和结束时间必填!');
          check = false;
          break;
        }

      }
      if (check) {
        console.log(this.yytimeopt);
        // this.storebusinesssetService.savejysj(this.yytimeopt)
        //   .then(res => {
        //     this.isConfirmLoading = false;
        //     this.notification.blank('提示', res.msg);
        //     this.handleCancel();
        //     this.getstorebusiness(this.params);
        //   });
        this.http.channelStoreTime.request(this.yytimeopt)
          .subscribe(res => {
            this.isConfirmLoading = false;
            this.notification.create('success', '温馨提示', res['msg']);
            this.handleCancel();
            this.getstorebusiness(this.params);
          });
      }

    }
    if (this.edititemtime) { // 单个设置营业时间保存
      this.yytimeopt.channel = this.params.search.channel;
      let check = false;
      console.log(this.itemtimearr);
      console.log(this.yytimeopt);

      for (let i = 0; i < this.itemtimearr.length; i++) {
        let shourstr: any = '';
        let sminutesstr: any = '';
        let ehourstr: any = '';
        let eminutesstr: any = '';

        if (this.itemtimearr[i].start && this.itemtimearr[i].end) {
          check = true;
          const sd = new Date(this.itemtimearr[i].start);
          const ed = new Date(this.itemtimearr[i].end);
          if (sd.getHours() >= 10) {
            shourstr = sd.getHours();
          } else {
            shourstr = '0' + sd.getHours();
          }
          if (sd.getMinutes() >= 10) {
            sminutesstr = sd.getMinutes();
          } else {
            sminutesstr = '0' + sd.getMinutes();
          }

          if (ed.getHours() >= 10) {
            ehourstr = ed.getHours();
          } else {
            ehourstr = '0' + ed.getHours();
          }
          if (ed.getMinutes() >= 10) {
            eminutesstr = ed.getMinutes();
          } else {
            eminutesstr = '0' + ed.getMinutes();
          }
          const timeobjstart = shourstr + ':' + sminutesstr;

          const timeobjend = ehourstr + ':' + eminutesstr;
          const opt = timeobjstart + '-' + timeobjend;
          this.yytimeopt.yy_time.push(opt);
        } else {
          this.isConfirmLoading = false;
          this.notification.create('error', '温馨提示', '开始时间和结束时间必填!');
          check = false;
          break;
        }

      }
      if (check) {
        console.log(this.yytimeopt);
        // this.storebusinesssetService.savejysj(this.yytimeopt)
        //   .then(res => {
        //     this.isConfirmLoading = false;
        //     this.notification.blank('提示', res.msg);
        //     this.handleCancel();
        //     this.getstorebusiness(this.params);
        //   });
        this.http.channelStoreTime.request(this.yytimeopt)
          .subscribe(res => {
            this.isConfirmLoading = false;
            this.notification.create('success', '温馨提示', res['msg']);
            this.handleCancel();
            this.getstorebusiness(this.params);
          });
      }
    }

  }

  handleCancel = () => {
    this.yyzt = false;
    this.yysj = false;
    this.jyzt = false;
    this.edititemtime = false;
    this.isVisible = false;
    this.timearr = [
      { start: null, end: null }
    ];
  }


}

