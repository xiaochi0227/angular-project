import { Component, Input, OnInit } from '@angular/core';
import { BaseParams } from '../../../utils/base.list.params';
import { HttpService } from '../../../http/http.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { loadingimage } from '../../../images';
import { NzNotificationService, NzModalService } from 'ng-zorro-antd';


@Component({
  templateUrl: './editliststores.html',
  styleUrls: ['./liststores.less']
})
export class EditListStoresComponent implements OnInit {
  constructor(private route: ActivatedRoute, private location: Location, private http: HttpService, private notification: NzNotificationService, private modalService: NzModalService) {
    this.notification.config({
      nzPlacement: 'topRight'
    });
   }


  data = {
    code: '',
    type_keyword: ''
  };

  stores: any;
  // storelist: any;
  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      this.data.code = params['code'];
      this.data.type_keyword = params['type_keyword'];
    });

    this.eidtStore();
    // this.listStoresService.getStorelist()
    //   .then(storelist => {
    //     this.storelist = storelist;
    //   }
    //   );

  }

  store: any; // 单个门店对象
  channels: any; // 企业信息维护表，渠道信息
  channelDeliverys: any // 配送渠道信息
  qudaoobj: any;
  // qudaos: any[];
  checkedarr: any[] = [];
  pscheckedarr: any[] = [];
  // jyqds: any[];
  eidtStore(): void {
    // this.listStoresService.editStore(this.data)
    //   .then(stores => {
    //     this.stores = stores;
    //     this.store = stores.rows;
    //     if (stores.rows.out_of_stock) {
    //       this.store.out_of_stock = stores.rows.out_of_stock;
    //     } else {
    //       this.store.out_of_stock = false;
    //     }
    //     if (stores.rows.receipt) {
    //       this.store.receipt = stores.rows.receipt;
    //     } else {
    //       this.store.receipt = '-1';
    //     }
    //     if (stores.rows.picking) {
    //       this.store.picking = stores.rows.picking;
    //     } else {
    //       this.store.picking = '-1';
    //     }
    //     this.channels = stores.qudao.channels;
    //     this.qudaoobj = stores.qudao;

    //     for (let i = 0; i < this.channels.length; i++) {
    //       if (!this.channels[i].price_field) {
    //         this.channels[i]['price_field'] = '';
    //       }
    //       for (let a = 0; a < this.store.channel.length; a++) {
    //         if (this.channels[i].channel_keyword === this.store.channel[a].channel) {
    //           this.checkedarr.push(this.store.channel[a]);
    //           for (let b = 0; b < this.checkedarr.length; b++) {
    //             this.channels[i] = this.checkedarr[b];
    //             this.channels[i].channel_keyword = this.checkedarr[b].channel;
    //           }
    //         }
    //       }
    //       if (this.channels[i].channel_keyword === 'YOUZAN') {
    //         this.channels[i].home_store = false;
    //         if (this.channels[i].item_detail && this.channels[i].item_detail.length > 0) {
    //           const imgurl = this.channels[i].item_detail.split(" ");
    //           if (imgurl[1] && imgurl[1].length > 0) {
    //             const imgurlvalue = imgurl[1].split("'");
    //             console.log(imgurl); console.log(imgurlvalue);
    //             this.channels[i].item_detail = imgurlvalue[1];
    //           }


    //         }

    //       }
    //     }
    //     console.log(this.channels);

    //     this.channelDeliverys = stores.qudao.channelDeliverys;
    //     for (let i = 0; i < this.channelDeliverys.length; i++) {
    //       for (let a = 0; a < this.store.channelDeliverys.length; a++) {
    //         if (this.channelDeliverys[i].channel_delivery_keyword === this.store.channelDeliverys[a].channel) {
    //           this.pscheckedarr.push(this.store.channelDeliverys[a]);
    //           for (let b = 0; b < this.pscheckedarr.length; b++) {
    //             this.channelDeliverys[i] = this.pscheckedarr[b];
    //             this.channelDeliverys[i].delivery_name = this.pscheckedarr[b].channel_name;
    //             this.channelDeliverys[i].channel_delivery_keyword = this.pscheckedarr[b].channel;
    //           }
    //         }
    //       }
    //     }
    //   });
    this.http.editstore.request(this.data)
      .subscribe(stores => {
        this.stores = stores;
        this.store = stores['rows'];
        if (stores['rows'].out_of_stock) {
          this.store.out_of_stock = stores['rows'].out_of_stock;
        } else {
          this.store.out_of_stock = false;
        }
        if (stores['rows'].receipt) {
          this.store.receipt = stores['rows'].receipt;
        } else {
          this.store.receipt = '-1';
        }
        if (stores['rows'].picking) {
          this.store.picking = stores['rows'].picking;
        } else {
          this.store.picking = '-1';
        }
        this.channels = stores['qudao'].channels;
        this.qudaoobj = stores['qudao'];

        for (let i = 0; i < this.channels.length; i++) {
          if (!this.channels[i].price_field) {
            this.channels[i]['price_field'] = '';
          }
          for (let a = 0; a < this.store.channel.length; a++) {
            if (this.channels[i].channel_keyword === this.store.channel[a].channel) {
              this.checkedarr.push(this.store.channel[a]);
              for (let b = 0; b < this.checkedarr.length; b++) {
                this.channels[i] = this.checkedarr[b];
                this.channels[i].channel_keyword = this.checkedarr[b].channel;
              }
            }
          }
          if (this.channels[i].channel_keyword === 'YOUZAN') {
            this.channels[i].home_store = false;
            if (this.channels[i].item_detail && this.channels[i].item_detail.length > 0) {
              const imgurl = this.channels[i].item_detail.split(" ");
              if (imgurl[1] && imgurl[1].length > 0) {
                const imgurlvalue = imgurl[1].split("'");
                console.log(imgurl); console.log(imgurlvalue);
                this.channels[i].item_detail = imgurlvalue[1];
              }


            }

          }
        }
        console.log(this.channels);

        this.channelDeliverys = stores['qudao'].channelDeliverys;
        for (let i = 0; i < this.channelDeliverys.length; i++) {
          for (let a = 0; a < this.store.channelDeliverys.length; a++) {
            if (this.channelDeliverys[i].channel_delivery_keyword === this.store.channelDeliverys[a].channel) {
              this.pscheckedarr.push(this.store.channelDeliverys[a]);
              for (let b = 0; b < this.pscheckedarr.length; b++) {
                this.channelDeliverys[i] = this.pscheckedarr[b];
                this.channelDeliverys[i].delivery_name = this.pscheckedarr[b].channel_name;
                this.channelDeliverys[i].channel_delivery_keyword = this.pscheckedarr[b].channel;
              }
            }
          }
        }
      });
  }

  channeloptar: any[];
  updateChange(appid: any, channel_keyword: any, qudao: any): void {
    qudao.appid = '';
    qudao.secret = '';
    for (let i = 0; i < this.channels.length; i++) {
      if (this.channels[i].channel_keyword === channel_keyword) {
        this.channeloptar = this.channels[i].channeloptarr;
        for (let a = 0; a < this.channeloptar.length; a++) {
          if (this.channeloptar[a].appid === appid) {
            qudao.appid = this.channeloptar[a].appid;
            qudao.secret = this.channeloptar[a].secret;
            qudao.token = this.channeloptar[a].token;
            qudao.memo = this.channeloptar[a].memo;
            qudao.refreshToken = this.channeloptar[a].refreshToken;
            qudao.adjust_rate = this.channeloptar[a].adjust_rate;
            qudao.price_field = this.channeloptar[0].price_field;
          }
        }
      }
    }

  }
  i: any;
  channeloptarr1: any = [];
  clickchanneloptar(i: any, qudao: any): void {
    console.log(this.channels[i].channeloptarr);
    if (this.channels[i] && this.channels[i].channeloptarr && this.channels[i].channeloptarr.length === 0) {
      this.notification.create('error', '温馨提示', '企业信息维护页面未填写appid等信息');
      this.totaldiv2 = false;
    } else {
      if (!this.channels[i].channeloptarr) {
        this.totaldiv2 = false;
      } else {
        if (this.channels[i] && this.channels[i].channeloptarr && this.channels[i].channeloptarr.length === 1) {
          qudao.appid = this.channels[i].channeloptarr[0].appid;
          qudao.secret = this.channels[i].channeloptarr[0].secret;
          qudao.token = this.channels[i].channeloptarr[0].token;
          qudao.memo = this.channels[i].channeloptarr[0].memo;
          qudao.refreshToken = this.channels[i].channeloptarr[0].refreshToken;
          qudao.adjust_rate = this.channels[i].channeloptarr[0].adjust_rate;
          qudao.accuracy = this.channels[i].channeloptarr[0].accuracy;
          qudao.rounding = this.channels[i].channeloptarr[0].rounding;
          qudao.price_field = this.channels[i].channeloptarr[0].price_field;
          this.totaldiv2 = false;
        } else {
          this.i = i;
          this.channeloptarr1 = this.channels[i].channeloptarr;
          this.totaldiv2 = true;
        }

      }

    }

  }

  g: any;
  pschanneloptarr1: any = [];
  psclickchanneloptar(i: any, qudao: any): void {
    console.log(this.channelDeliverys[i].deliveryAccounts);
    console.log(qudao);

    if (this.channelDeliverys[i] && this.channelDeliverys[i].deliveryAccounts && this.channelDeliverys[i].deliveryAccounts.length === 0) {
      this.notification.create('error', '温馨提示', '企业信息维护页面未填写appid等信息');
      this.totaldiv4 = false;
    } else {
      if (!this.channelDeliverys[i].deliveryAccounts) {
        this.totaldiv4 = false;
      } else {
        if (this.channelDeliverys[i] && this.channelDeliverys[i].deliveryAccounts && this.channelDeliverys[i].deliveryAccounts.length === 1 &&
          qudao.channel_delivery_keyword === 'DADA') {
          qudao.main_account = this.channelDeliverys[i].deliveryAccounts[0].main_account;
          qudao.main_name = this.channelDeliverys[i].deliveryAccounts[0].main_name;
          qudao.appid = this.channelDeliverys[i].deliveryAccounts[0].appid;
          qudao.secret = this.channelDeliverys[i].deliveryAccounts[0].secret;
          qudao.token = this.channelDeliverys[i].deliveryAccounts[0].token;
          qudao.memo = this.channelDeliverys[i].deliveryAccounts[0].memo;
          qudao.weight_limit = this.channelDeliverys[i].deliveryAccounts[0].weight_limit;
          qudao.delivery_service_type = this.channelDeliverys[i].deliveryAccounts[0].dst;
          this.totaldiv4 = false;
        } else {
          this.g = i;
          if (this.channelDeliverys[i].deliveryAccounts) {
            for (let j = 0; j < this.channelDeliverys[i].deliveryAccounts.length; j++) {
              this.channelDeliverys[i].deliveryAccounts[j].dst = '';
            }
          }
          this.pschanneloptarr1.rows = this.channelDeliverys[i].deliveryAccounts;
          this.pschanneloptarr1.channel_delivery_keyword = qudao.channel_delivery_keyword;
          console.log(this.pschanneloptarr1);

          this.totaldiv4 = true;
        }

      }

    }

  }


  channeloptarr2(channeloptar: any): void {
    this.channels[this.i].appid = channeloptar.appid;
    this.channels[this.i].secret = channeloptar.secret;
    this.channels[this.i].token = channeloptar.token;
    this.channels[this.i].memo = channeloptar.memo;
    this.channels[this.i].refreshToken = channeloptar.refreshToken;
    this.channels[this.i].adjust_rate = channeloptar.adjust_rate;
    this.channels[this.i].price_field = channeloptar.price_field;
    this.totaldiv2 = false;
  }
  pschanneloptarr2(channeloptar: any, channel_delivery_keyword): void {
    if (channeloptar.dst === '' && channel_delivery_keyword !== 'DADA') {
      this.notification.create('error', '温馨提示', '请选择配送服务类型');
    } else {
      this.channelDeliverys[this.g].appid = channeloptar.appid;
      this.channelDeliverys[this.g].secret = channeloptar.secret;
      this.channelDeliverys[this.g].token = channeloptar.token;
      this.channelDeliverys[this.g].memo = channeloptar.memo;
      this.channelDeliverys[this.g].main_account = channeloptar.main_account;
      this.channelDeliverys[this.g].main_name = channeloptar.main_name;
      this.channelDeliverys[this.g].weight_limit = channeloptar.weight_limit;
      this.channelDeliverys[this.g].delivery_service_type = channeloptar.dst;
      this.totaldiv4 = false;
    }

  }
  totaldiv2 = false;
  closediv2() {
    this.totaldiv2 = false;
  }

  totaldiv4 = false;
  closediv4() {
    this.totaldiv4 = false;
  }

  totaldiv3 = false;
  closediv3() {
    this.totaldiv3 = false;
  }



  // loadingimgurl: string = loadingimage;
  loadingimg = false;

  qudao: any = {}; // 保存传给后台值


  updateStore(channels: any, store: any): void {
    this.loadingimg = true;
    console.log(channels);
    console.log(store);
    // this.qudao.code = store[0].code;
    // this.qudao.name = store[0].name;
    // this.qudao.address = store[0].address;
    // this.qudao.kcgxl = store[0].kcgxl;
    // this.qudao.aqkcl = store[0].aqkcl;
    // this.qudao.city = store[0].city;
    // this.qudao.area = store[0].area;
    // this.qudao.status = store[0].status;
    // this.qudao.channels = channels;
    let checkopt: any = true;
    if (this.channelDeliverys && this.channelDeliverys.length > 0) {
      for (let i = 0; i < this.channelDeliverys.length; i++) {
        if (this.channelDeliverys[i].main_account && this.channelDeliverys[i].appcode && this.channelDeliverys[i].appcode !== "") {
          checkopt = true;
        } else {
          if (!this.channelDeliverys[i].main_account && !this.channelDeliverys[i].appcode) {
            checkopt = true;
          } else {
            this.notification.create('error', '温馨提示', '配送渠道门店编号不能为空!');
            checkopt = false;
            break;
          }

        }
      }
    }

    console.log(this.channelDeliverys);

    if (checkopt) {
      let date = {
        code: store.code,
        name: store.name,
        address: store.address,
        kcgxl: store.kcgxl,
        aqkcl: store.aqkcl,
        city: store.city,
        area: store.area,
        status: store.status,
        receipt: store.receipt,
        picking: store.picking,
        out_of_stock: store.out_of_stock,
        channels: channels,
        syjh: store.syjh,
        syyh: store.syyh,
        channelDeliverys: this.channelDeliverys
      };
      console.log(date);

      // this.listStoresService.updateStore(date)
      //   .then(tip => {
      //     this.loadingimg = false;
      //     alert(tip.msg);
      //     this.eidtStore();
      //     for (let i = 0; i < this.selectedbts.length; i++) {
      //       this.selectedbts[i] = false;
      //     }
      //   });
      this.http.updatestore.request(date)
        .subscribe(tip => {
          this.loadingimg = false;
          // alert(tip.msg);
          this.notification.create('success', '温馨提示', tip['msg']);
          this.eidtStore();
          for (let i = 0; i < this.selectedbts.length; i++) {
            this.selectedbts[i] = false;
          }
        });

    }
  }
  initstore(channel) {
    let params = {
      appcode: channel.appcode,
      orgcode: channel.orgcode,
      channel: channel.channel
    };
    this.modalService.confirm({
      nzTitle: '温馨提示',
      nzContent: '渠道门店初始化后，渠道门店的分类和商品将被删除，是否继续初始化？',
      nzOnOk: () => {
        // this.listStoresService.initstore(params)
        //   .then((res) => {
        //     alert(res.msg);
        //   });
        this.http.initstore.request(params)
          .subscribe(res => {
            this.notification.create('success', '温馨提示', res['msg']);
          });
      }
    });


  }
  code: string;
  delchannel(channel: string, code: string): void {
    this.modalService.confirm({
      nzTitle: '温馨提示',
      nzContent: '解除绑定后，牵牛花将不会再向此渠道更新商品！是否确定解绑？',
      nzOnOk: () => {
        this.code = code;
        this.data = {
          code: code,
          type_keyword: channel
        };
        // this.listStoresService.delchannel(this.data)
        //   .then(tip => {
        //     alert(tip.msg)
        //     this.data.type_keyword = 'physical_shop';
        //     this.data.code = tip.region_code;
        //     this.eidtStore();
        //   });
        this.http.delchannel.request(this.data)
          .subscribe(tip => {
            // alert(tip.msg)
            this.notification.create('success', '温馨提示', tip['msg']);
            this.data.type_keyword = 'physical_shop';
            this.data.code = tip['region_code'];
            this.eidtStore();
          });
      }
    });

  }

  selectedbts: any[] = [];
  clickarr: any[] = [];
  selectjyqd: any;
  j: number = 0;
  toview(event, i, channel) {
    this.par.name = channel.channel_name;
    if (this.selectedbts[i]) {
      this.clickarr[i] = this.j;
      if (this.clickarr[i] % 2 !== 0) {
        this.clickarr[i] = 0;
        this.selectedbts[i] = true;
        event.target.value = '收起';
        // this.listStoresService.getchannel(this.par).then(row => {
        //   this.channels[i]['set_channel'] = row.set_channel;
        // });
        this.http.getchannel.request(this.par)
          .subscribe(row => {
            this.channels[i]['set_channel'] = row['set_channel'];
          });
      } else {
        this.clickarr[i] = 1;
        this.selectedbts[i] = false;
        event.target.value = '查看';
      }
    } else {
      this.selectedbts[i] = true;
      event.target.value = '收起';
      this.j = 0;
      // this.listStoresService.getchannel(this.par).then(row => {
      //   this.channels[i]['set_channel'] = row.set_channel;
      // });
      this.http.getchannel.request(this.par)
        .subscribe(row => {
          this.channels[i]['set_channel'] = row['set_channel'];
        });
    }
  }

  psselectedbts: any[] = [];
  psclickarr: any[] = [];
  selectpsqd: any;
  k: number = 0;
  pstoview(event, i, channel) {
    if (this.psselectedbts[i]) {
      this.clickarr[i] = this.k;
      if (this.clickarr[i] % 2 !== 0) {
        this.clickarr[i] = 0;
        this.psselectedbts[i] = true;
        event.target.value = '收起';
      } else {
        this.clickarr[i] = 1;
        this.psselectedbts[i] = false;
        event.target.value = '查看';
      }
    } else {
      this.psselectedbts[i] = true;
      event.target.value = '收起';
      this.k = 0;
    }
  }


  par: any = {
    name: ''
  }
  pspar: any = {
    name: ''
  }
  set_channel: any;
  getXsXx() {
    // this.listStoresService.getchannel(this.par).then(row => {
    //   this.set_channel = row.set_channel;
    // });
    this.http.getchannel.request(this.par)
      .subscribe(row => {
        this.set_channel = row['set_channel'];
      });
  }

  //   isChecked:any[];
  // checkedarr:any=[];
  //  arr:any[]=[];
  //   onchange(event:any,rowobj) { // without type info
  //         this.isChecked = event.currentTarget.checked;
  //         let channelselected:any={
  //               channel_keyword:''
  //             };
  //         if(this.isChecked)
  //         {
  //             var isbh = false;

  //             channelselected.channel_keyword = rowobj.channel_keyword;
  //             for( var i = 0; i < this.checkedarr.length; i++ )
  //             {

  //                 var tempchannel = this.checkedarr[i].channel_keyword;
  //                 if( channelselected.channel_keyword == tempchannel )
  //                 {
  //                     isbh = true;
  //                     break;
  //                 }
  //             }
  //             if( !isbh )
  //             {
  //                 this.checkedarr.push( channelselected );
  //             }
  //         }
  //         else
  //         {
  //             for( var i = 0; i < this.checkedarr.length; i++ )
  //             {

  //                 channelselected.channel_keyword = rowobj.channel_keyword;
  //                 var tempchannel = this.checkedarr[i].channel_keyword;
  //                 if( channelselected.channel_keyword == tempchannel )
  //                 {
  //                       this.checkedarr.splice( i, 1 );
  //                     break;
  //                 }
  //             }
  //         }


  //     }
  modalpage = true;
  storePage: any =
    {
      count: 0,
      totalPage: 0
    };
  changestorecount: any;
  cow1: number;
  // 接收翻页操作传过来的值，然后请求服务得到新数据
  storechildparams($event) {
    const childoption = $event;
    this.storePage.page_no = childoption.page_no;
    this.cow1 = (childoption.page_no - 1) * childoption.page_size;
    this.getordersetlogfun(this.params);

  }
  ordersetlogs: any;
  params = {
    search: {
      region_code: '',
      channel_keyword: ''
    },
    page_no: 1,
    page_size: 20
  };
  ordersetlog(storecode, channel) {
    this.params.search.region_code = storecode;
    this.params.search.channel_keyword = channel;
    this.params.page_no = 1;
    this.getordersetlogfun(this.params);

  }
  getordersetlogfun(params) {

    this.cow1 = (params.page_no - 1) * params.page_size;
    // this.listStoresService.queryStoreSetLog(params)
    //   .then(res => {
    //     if (res && res.rows.length > 0) {
    //       this.ordersetlogs = res.rows;
    //       this.storePage.count = res.count;
    //       this.changestorecount = res.count;
    //       this.totaldiv3 = true;
    //     } else {
    //       alert('暂无操作日志!');
    //     }
    //   });
    this.http.queryStoreSetLog.request(params)
      .subscribe(res => {
        if (res && res['rows'].length > 0) {
          this.ordersetlogs = res['rows'];
          this.storePage.count = res['count'];
          this.changestorecount = res['count'];
          this.totaldiv3 = true;
        } else {
          this.notification.create('error', '温馨提示', '暂无操作日志!');
        }
      });
  }

}



