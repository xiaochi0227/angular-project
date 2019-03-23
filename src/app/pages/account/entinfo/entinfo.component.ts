import { Component, OnInit } from '@angular/core';
import { Authbts, Whetherdisplay } from 'src/app/validates/validates';
import { HttpService } from 'src/app/http/http.service';
import { NzNotificationService, NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'app-entinfo',
  templateUrl: './entinfo.component.html',
  styleUrls: ['./entinfo.component.less']
})
export class EntinfoComponent implements OnInit {

  btns: any;
  bcbt = true;
  formulaparams = [
    { name: '餐盒费', value: 'box_value', sfxz: false, operator: '+' },
    { name: '商家包装费', value: 'package_fee', sfxz: false, operator: '+' },
    { name: '商家单品优惠', value: 'total_sj_dp', sfxz: false, operator: '-' },
    { name: '平台补贴(单品)', value: 'total_pt_dp', sfxz: false, operator: '+' },
    { name: '商家优惠(整单)', value: 'total_sj_disc', sfxz: false, operator: '-' },
    { name: '佣金', value: 'commission_value', sfxz: false, operator: '-' },
    { name: '商家运费收入', value: 'logistics_sj_value', sfxz: false, operator: '+' },
    { name: '运费佣金', value: 'logistics_sj_commission', sfxz: false, operator: '-' }
  ];
  exclude_pos_money_array: any;
  pzpc_receipt = false;
  pzandroid_receipt = false;
  pzpicking = false;
  pc_receipt = '-1';
  android_receipt = '-1';
  picking = '-1';
  qrcode: '';
  jyqds: any[]; // 所有经营渠道
  psqds: any[]; // 所有配送渠道
  entinfo: any;
  channel: any;
  checkedarr: any = [];
  mrxz: any = {
    channel_keyword: ''
  };
  channelopt: any = {
    appid: '',
    secret: '',
    token: '',
    memo: '',
    refreshToken: '',
    account: ''
  };
  channeloptarrs: any = [];
  selectedpsqd: any;
  selectedbts: any[] = [];
  clickarr: any[] = [];
  selectjyqd: any;
  j = 0;
  psqdselectedbts: any[] = [];
  psqdclickarr: any[] = [];
  psqdselectpsqd: any;
  k = 0;
  par: any = {
    name: ''
  };
  set_channel: any;
  delChannels = []; // 删除的渠道主题账号
  isChecked: any[];
  arr = []; data: any = {
    optype: '',
  };
  lqimginfo = {
    app_id: '',
    app_secret: '',
    sc_code: '',
    comments: ''
  };
  imgtype: string;
  autoclear_offline = 999;
  showformula: any;
  setshowformula: any;

  constructor(private http: HttpService, private notification: NzNotificationService, private modalService: NzModalService) {
    this.notification.config({
      nzPlacement: 'topRight'
    });
  }

  ngOnInit(): void {
    this.btns = Authbts('基础设置', '企业信息维护');
    this.bcbt = Whetherdisplay(this.btns, '保存');
    this.getchannels();
    this.channeloptarrs.push(this.channelopt);
    this.http.getBillOrderConfig.request<any>().subscribe(res => {
      if (res.exclude_pos_money && res.exclude_pos_money_array) {
        this.exclude_pos_money_array = res.exclude_pos_money_array;
        this.showformula = res.exclude_pos_money_desc;
        this.setshowformula = res.exclude_pos_money;
        if (this.exclude_pos_money_array && this.exclude_pos_money_array.length > 0) {
          for (let i = 0; i < this.exclude_pos_money_array.length; i++) {
            for (let j = 0; j < this.formulaparams.length; j++) {
              if (this.exclude_pos_money_array[i] === this.formulaparams[j].value) {
                this.formulaparams[j].sfxz = true;
              }
            }
          }
        }
      } else {
        this.setshowformula = '';
      }
    });
  }


  entlist(): void {
    this.http.entlist.request<any>().subscribe(entinfo => {
      if (entinfo && entinfo.rows) {
        this.entinfo = entinfo.rows;
      }
      if (this.entinfo.pc_receipt) {
        if (this.entinfo.pc_receipt === '1' || this.entinfo.pc_receipt === '2') {
          this.pzpc_receipt = true;
          this.pc_receipt = this.entinfo.pc_receipt;
        }
      } else {
        this.pzpc_receipt = false;
        this.pc_receipt = '-1';
      }
      if (this.entinfo.android_receipt) {
        if (this.entinfo.android_receipt === '1' || this.entinfo.android_receipt === '2') {
          this.pzandroid_receipt = true;
          this.android_receipt = this.entinfo.android_receipt;
        }
      } else {
        this.android_receipt = '-1';
        this.pzandroid_receipt = false;
      }
      if (this.entinfo.picking) {
        if (this.entinfo.picking === '1' || this.entinfo.picking === '2') {
          this.pzpicking = true;
          this.picking = this.entinfo.picking;
        }
      } else {
        this.pzpicking = false;
        this.picking = '-1';
      }
      if (this.entinfo.invoice_url) {
        this.qrcode = this.entinfo.invoice_url;
      } else {
        this.qrcode = '';
      }
      if (this.entinfo.autoclear_offline) {
        this.autoclear_offline = this.entinfo.autoclear_offline;
      }
      this.channel = this.entinfo.channels;
      if (this.entinfo.wptx) {
        this.lqimginfo = this.entinfo.wptx;
      }
      if (this.channel) {
        this.checkedarr = this.channel;
        if (this.checkedarr.length > 0) {
          for (let i = 0; i < this.checkedarr.length; i++) {
            for (let a = 0; a < this.jyqds.length; a++) {

              if (this.checkedarr[i].channel_keyword === this.jyqds[a].channel_keyword) {
                this.jyqds[a].sfxz = true;
                this.jyqds[a].channeloptarr = this.checkedarr[i].channeloptarr;
                this.jyqds[a].receipt = this.checkedarr[i].receipt;
                this.jyqds[a].picking = this.checkedarr[i].picking;
              }
            }
          }
        }
      } else {
        return;
      }
      if (this.entinfo.channelDeliverys && this.entinfo.channelDeliverys.length > 0) {
        this.psqds = this.entinfo.channelDeliverys;
        if (this.psqds && this.psqds.length > 0) {
          for (let i = 0; i < this.psqds.length; i++) {
            if (this.psqds[i].deliveryAccounts && this.psqds[i].deliveryAccounts.length > 0) {
              for (let j = 0; j < this.psqds[i].deliveryAccounts.length; j++) {
                if (this.psqds[i].deliveryAccounts[j].delivery_service_type &&
                  this.psqds[i].deliveryAccounts[j].delivery_service_type.length > 0) {
                  this.psqds[i].deliveryAccounts[j].selectedarr = [];
                  for (let k = 0; k < this.psqds[i].deliveryAccounts[j].delivery_service_type.length; k++) {
                    if (this.psqds[i].deliveryAccounts[j].delivery_service_type[k].checked) {
                      this.psqds[i].deliveryAccounts[j].selectedarr
                        .push(this.psqds[i].deliveryAccounts[j].delivery_service_type[k]);
                    }
                  }
                }
              }
            }
          }
        }
      }
    });
  }
  checkpsfwlx(item, event) {
    if (!item.checked) {
      this.modalService.confirm({
        nzTitle: '温馨提示',
        nzContent: '确定取消本配送类型吗？取消后正在使用本配送类型的门店将无法使用',
        nzOnOk: () => {
          item.checked = false;
          event.target.checked = false;
        },
        nzOnCancel: () => {
          item.checked = true;
          event.target.checked = true;
        }
      });
    }
  }

  toview(jyqd, event, i) {
    this.par.name = jyqd.name;
    if (this.selectedbts[i]) {
      this.clickarr[i] = this.j;
      if (this.clickarr[i] % 2 !== 0) {
        this.clickarr[i] = 0;
        this.selectedbts[i] = true;
        event.target.value = '收起';
        this.http.getchannel.request<any>(this.par).subscribe(row => {
          this.jyqds[i]['set_channel'] = row.set_channel;
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
      this.http.getchannel.request<any>(this.par).subscribe(row => {
        this.jyqds[i]['set_channel'] = row.set_channel;
      });
    }
  }

  psqdtoview(psqd, event, i) {
    if (this.psqdselectedbts[i]) {
      this.psqdclickarr[i] = this.k;
      if (this.psqdclickarr[i] % 2 !== 0) {
        this.psqdclickarr[i] = 0;
        this.psqdselectedbts[i] = true;
        event.target.value = '收起';
      } else {
        this.psqdclickarr[i] = 1;
        this.psqdselectedbts[i] = false;
        event.target.value = '查看';
      }
    } else {
      this.psqdselectedbts[i] = true;
      event.target.value = '收起';
      this.k = 0;
    }
  }

  addoption(jyqdopt) {
    const option = {
      appid: '',
      secret: '',
      token: '',
      memo: '',
      refreshToken: '',
      account: ''
    };
    if (jyqdopt.channeloptarr) {
      jyqdopt.channeloptarr.push(option);
    } else {
      const jyqdarr: any = [];
      jyqdarr.push(option);
      jyqdopt.channeloptarr = jyqdarr;
    }
  }

  psqdaddoption(psqdopt) {
    const option: any = {
      appid: '',
      secret: '',
      token: '',
      memo: '',
      refreshToken: '',
      main_name: '',
      store_name: '',
      main_account: '',
      weight_limit: '15',
      delivery_service_type: []
    };
    if (psqdopt.channel_delivery_keyword === 'MTPS') {
      option.delivery_service_type = [
        { label: '飞速达', value: '4002' },
        { label: '快速达', value: '4011' },
        { label: '及时达', value: '4012' },
        { label: '集中送', value: '4013' }
      ];

    } else if (psqdopt.channel_delivery_keyword === 'FNPS') {
      option.delivery_service_type = [
        { label: '蜂鸟配送', value: '1' },
        { label: '蜂鸟优送', value: '2' },
        { label: '蜂鸟快送', value: '3' }
      ];
    }
    if (psqdopt.deliveryAccounts) {
      psqdopt.deliveryAccounts.push(option);
    } else {
      const psqdarr: any = [];
      psqdarr.push(option);
      psqdopt.deliveryAccounts = psqdarr;
    }
  }


  getchannels(): void {
    this.http.channels.request<any>()
      .subscribe(channels => {
        this.jyqds = channels.rows;
        this.psqds = channels.deliveryChannels;
        this.entlist();
      }
      );
  }

  del(t: any, index: any, ckbt): void {
    const delchannellist = {
      channel: '',
      appid: '',
      secret: '',
      token: '',
      memo: '',
      account: ''
    };
    delchannellist.channel = this.jyqds[t].channel_keyword;
    if (!this.jyqds[t].channeloptarr[index].appid) {
      this.jyqds[t].channeloptarr[index].appid = '';
    } else {
      delchannellist.appid = this.jyqds[t].channeloptarr[index].appid;
    }
    if (!this.jyqds[t].channeloptarr[index].secret) {
      this.jyqds[t].channeloptarr[index].secret = '';
    } else {
      delchannellist.secret = this.jyqds[t].channeloptarr[index].secret;
    }
    if (!this.jyqds[t].channeloptarr[index].token) {
      this.jyqds[t].channeloptarr[index].token = '';
    } else {
      delchannellist.token = this.jyqds[t].channeloptarr[index].token;
    }
    if (!this.jyqds[t].channeloptarr[index].memo) {
      this.jyqds[t].channeloptarr[index].memo = '';
    } else {
      delchannellist.memo = this.jyqds[t].channeloptarr[index].memo;
    }
    if (!this.jyqds[t].channeloptarr[index].account) {
      this.jyqds[t].channeloptarr[index].account = '';
    } else {
      delchannellist.account = this.jyqds[t].channeloptarr[index].account;
    }
    this.delChannels.push(delchannellist);
    this.modalService.confirm({
      nzTitle: '温馨提示',
      nzContent: '是否删除本行(appid,secret,token,备注,account）',
      nzOnOk: () => {
        this.jyqds[t].channeloptarr.splice(index, 1);
        if (this.jyqds[t].channeloptarr.length === 0) {
          this.jyqds[t].sfxz = false;
          this.jyqds[t].receipt = '-1';
          this.jyqds[t].picking = '-1';
          ckbt.value = '查看';
        }
      }
    });
  }
  psqddel(t: any, index: any, ckbt): void {
    const delchannellist = {
      appid: '',
      secret: '',
      token: '',
      memo: '',
      refreshToken: '',
      main_name: '',
      store_name: '',
      main_account: '',
      weight_limit: 15,
      delivery_service_type: []
    };
    this.modalService.confirm({
      nzTitle: '温馨提示',
      nzContent: '是否删除本行(appid,secret,token,备注,account）',
      nzOnOk: () => {
        this.psqds[t].deliveryAccounts.splice(index, 1);
        if (this.psqds[t].deliveryAccounts.length === 0) {
          this.psqds[t].sfxz = false;
          ckbt.value = '查看';
        }
      }
    });
  }

  onchange(event: any, rowobj) {
    this.isChecked = event.target.checked;
    const channelselected: any = {
      channel_keyword: ''
    };
    if (this.isChecked) {
      rowobj.sfxz = true;
      let isbh = false;
      channelselected.channel_keyword = rowobj.channel_keyword;
      for (let i = 0; i < this.checkedarr.length; i++) {
        const tempchannel = this.checkedarr[i].channel_keyword;
        if (channelselected.channel_keyword === tempchannel) {
          isbh = true;
          break;
        }
      }
      if (!isbh) {
        this.checkedarr.push(channelselected);
      }
    } else {
      this.modalService.confirm({
        nzTitle: '温馨提示',
        nzContent: '取消勾选后，将导致企业下所有门店都不能使用该功能！',
        nzOnOk: () => {
          rowobj.sfxz = false;
          for (let i = 0; i < this.checkedarr.length; i++) {
            channelselected.channel_keyword = rowobj.channel_keyword;
            const tempchannel = this.checkedarr[i].channel_keyword;
            if (channelselected.channel_keyword === tempchannel) {
              this.checkedarr.splice(i, 1);
              break;
            }
          }
        },
        nzOnCancel: () => {
          rowobj.sfxz = true;
          event.target.checked = true;
        }
      });
    }
  }

  psqdonchange(event, psqd) {
    const isChecked = event.target.checked;
    if (isChecked) {
      psqd.sfxz = true;
    } else {
      this.modalService.confirm({
        nzTitle: '温馨提示',
        nzContent: '取消勾选后，将导致企业下所有门店都不能使用该功能！',
        nzOnOk: () => {
          event.target.checked = false;
          psqd.sfxz = false;
        },
        nzOnCancel: () => {
          event.target.checked = true;
          psqd.sfxz = true;
        }
      });
    }

  }
  // getservicetype(stopt, copt) {
  //   const st = [];
  //   for (let i = 0; i < stopt.length; i++) {
  //     if (stopt[i].checked) {
  //       st.push(stopt[i].value);
  //     }
  //   }
  //   copt.delivery_service_type = st;
  // }
  // 更新企业信息
  entUpdate(channel: any, default_init_value: any, setshowformula): void {
    let isempty: any, psisempty: any = true;
    for (let i = 0; i < channel.length; i++) {
      if (channel[i].sfxz) {
        if (channel[i].channel_keyword === 'HXTZ') {
          isempty = true;
        } else {
          if (!channel[i].channeloptarr || channel[i].channeloptarr.length === 0) {
            this.notification.create('error', '温馨提示', channel[i].name + '配置信息未填写!');
            isempty = false;
            break;
          } else {
            isempty = true;
          }
        }
      } else {
        isempty = true;
      }
    }
    const wptx = this.lqimginfo;
    let exclude_pos_money: any;
    const autoclear_offline = this.autoclear_offline;
    if (setshowformula) {
      exclude_pos_money = setshowformula.replace(/(^\s*)|(\s*$)/g, '');
    } else {
      exclude_pos_money = '';
    }

    for (let i = 0; i < this.psqds.length; i++) {
      if (!this.psqds[i].sfxz) {
        this.psqds[i].deliveryAccounts = [];
      } else {
        if (this.psqds[i].deliveryAccounts && this.psqds[i].deliveryAccounts.length > 0 && psisempty) {
          for (let j = 0; j < this.psqds[i].deliveryAccounts.length; j++) {
            if (this.psqds[i].deliveryAccounts[j]) {
              if (this.psqds[i].deliveryAccounts[j].main_name === '' || this.psqds[i].deliveryAccounts[j].main_account === '' ||
                this.psqds[i].deliveryAccounts[j].appid === '' || this.psqds[i].deliveryAccounts[j].secret === '') {
                this.notification.create('error', '温馨提示', this.psqds[i].delivery_name + '渠道的配置信息未填写完整(主体名称、主体账号、appid、secret为必填)');
                psisempty = false;
                break;
              } else {
                if (this.psqds[i].channel_delivery_keyword !== 'DADA' && this.psqds[i].deliveryAccounts[j].delivery_service_type &&
                  this.psqds[i].deliveryAccounts[j].delivery_service_type.length > 0) {
                  let dstarr = [];
                  for (let k = 0; k < this.psqds[i].deliveryAccounts[j].delivery_service_type.length; k++) {
                    if (this.psqds[i].deliveryAccounts[j].delivery_service_type[k].checked) {
                      psisempty = true;
                      dstarr = [];
                      break;
                    } else {
                      dstarr.push(this.psqds[i].deliveryAccounts[j].delivery_service_type[k]);
                    }
                    if (dstarr.length === this.psqds[i].deliveryAccounts[j].delivery_service_type.length) {
                      this.notification.create('error', '温馨提示', this.psqds[i].delivery_name + '渠道的配送服务类型必选');
                      psisempty = false;
                    }
                  }
                  // if (dstarr.length === 0) {
                  //   alert(this.psqds[i].delivery_name + '渠道的配送服务类型必选');
                  //   psisempty = false;
                  // }
                } else {
                  psisempty = true;
                }

                // psisempty = true;

              }
              if (!psisempty) {
                break;
              }
            }
          }
        } else {
          this.notification.create('error', '温馨提示', this.psqds[i].delivery_name + '渠道的配置信息未填写完整(主体名称、主体账号、appid、secret为必填)');
          psisempty = false;
          break;
        }
      }
      if (!psisempty) {
        break;
      }

    }
    if (isempty && psisempty) {
      const entinfo = {
        channel,
        delChannel: this.delChannels,
        default_init_value,
        wptx,
        autoclear_offline,
        exclude_pos_money,
        pc_receipt: this.pc_receipt,
        android_receipt: this.android_receipt,
        picking: this.picking,
        invoice_url: this.qrcode,
        channelDeliverys: this.psqds
        // order_return_exclude_pos_money
      };
      this.http.entupdate.request<any>(entinfo)
        .subscribe(data => {
          this.notification.create('success', '温馨提示', data.msg);
          this.entlist();
        });
    } else {
      return;
    }
  }
  // uploader: testUpload = new testUpload({
  //   url: 'http://images-m-glory.oss-cn-hangzhou.aliyuncs.com',
  //   method: 'POST'

  // });
  // policy: any;
  // logoimg: any;
  // uploadlogofun(type) {
  //   let imagetype = this.uploader.queue[0].file.type.substring(6);
  //   let Num = '';
  //   for (let i = 0; i < 6; i++) {
  //     Num += Math.floor(Math.random() * 10);
  //   }
  //   let keyvalue = this.policy.dir + 'img/' + Num + '.' + imagetype;
  //   this.uploader.options.additionalParameter = {
  //     name: Num + '.' + imagetype,
  //     key: keyvalue,
  //     policy: this.policy.policy,
  //     OSSAccessKeyId: this.policy.accessid,
  //     success_action_status: 200,
  //     signature: this.policy.signature
  //   };
  //   this.uploader.queue[0].onSuccess = (response, status, headers) => {
  //     // 上传文件成功
  //     if (status == 200) {
  //       if (type === 1) {
  //         this.imgtype = 'logo';
  //       }
  //       if (type === 2) {
  //         this.imgtype = 'default_item_image';
  //       }
  //       // 上传文件后获取服务器返回的数据
  //       let sucopt = {
  //         imgtype: this.imgtype,
  //         key: keyvalue,
  //         local_url: 'images-m-glory.oss-cn-hangzhou-internal.aliyuncs.com/' + keyvalue,
  //         remote_url: 'http://images-m-glory.oss-cn-hangzhou.aliyuncs.com/' + keyvalue
  //       };
  //       this.entinfoservice.uploadimgoss(sucopt)
  //         .then(res => {
  //           alert(res.msg);
  //         });
  //       this.uploader.queue = [];
  //     } else {
  //       alert('上传失败!');

  //       // 上传文件后获取服务器返回的数据错误
  //     }
  //   };
  //   this.uploader.queue[0].withCredentials = false;
  //   this.uploader.queue[0].upload();
  // }
  // 新增logo 或商品默认图片
  // addImage(type: number): void {
  //   if (this.policy) {
  //     this.uploadlogofun(type);
  //   } else {
  //     this.getPolicyService.getpolicy()
  //       .then((res) => {
  //         this.policy = res;
  //         this.uploadlogofun(type);
  //       });
  //   }
  // }

  // 删除logo 或商品默认图片
  // delImage(type: number): void {
  //   if (type === 1) {
  //     this.data.optype = 'logo';
  //   } else {
  //     this.data.optype = 'default_item_image';
  //   }
  //   this.http.delImage.request<any>(this.data)
  //     .subscribe(data => {
  //       alert(data.msg);
  //     });
  //   this.entlist();
  // }

  setformula() {
    this.showformula = '';
    this.setshowformula = '';
    const setparams: any = [];
    for (let i = 0; i < this.formulaparams.length; i++) {
      if (this.formulaparams[i].sfxz) {
        setparams.push(this.formulaparams[i]);
      }
    }
    if (setparams.length > 0) {
      for (let i = 0; i < setparams.length; i++) {
        if (setparams[i].operator === '+') {
          this.swap(setparams, 0, i);
          break;
        }
      }

      for (let j = 0; j < setparams.length; j++) {
        this.showformula += ' ' + setparams[j].operator + ' ' + setparams[j].name;
        this.setshowformula += ' ' + setparams[j].operator + ' ' + setparams[j].value;
      }
      if (this.showformula.substr(1, 1) === '-') {
        this.showformula = this.showformula;
        this.setshowformula = this.setshowformula;
      } else {
        this.showformula = this.showformula.substring(2);
        this.setshowformula = this.setshowformula.substring(2);
      }

    }


  }
  swap(arr, i, j) {
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
    return arr;
  }

  setpcreceipt(opt) {
    if (opt) {
      this.pc_receipt = '1';
    } else {
      this.pc_receipt = '-1';
    }
  }
  setandroid(opt) {
    if (opt) {
      this.android_receipt = '1';
    } else {
      this.android_receipt = '-1';
    }
  }
  setpicking(opt) {
    if (opt) {
      this.picking = '1';
    } else {
      this.picking = '-1';
    }
  }
  setchannelreceipt(event, jyqd) {
    if (event.target.checked) {
      jyqd.receipt = '1';
    } else {
      jyqd.receipt = '-1';
    }
  }
  setchannelpicking(event, jyqd) {
    if (event.target.checked) {
      jyqd.picking = '1';
    } else {
      jyqd.picking = '-1';
    }
  }
}
