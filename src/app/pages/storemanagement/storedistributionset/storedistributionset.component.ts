import { Component, Input, OnInit, ViewChild, AfterViewInit, TemplateRef } from '@angular/core';
import { BaseParams } from '../../../utils/base.list.params';
import { Router, ActivatedRoute, Params } from '@angular/router';
// import { StoredistributionsetService } from './storedistributionset.service';
// import { SearchSelect } from '../../../../theme/components/searchSelect';
import { NzNotificationService } from 'ng-zorro-antd';
import { testUpload } from '../../../utils/test.upload';
import { HttpService } from '../../../http/http.service';
// import { GetPolicyService } from '../../../../../app/upload/getpolicy.service';
import { UploadResult } from 'src/app/sharecomponets/upload/upload.component';
import { PublicService } from 'src/app/services/public.service';
import { DatePipe } from '@angular/common';

@Component({
  templateUrl: './storedistributionset.html',
  styleUrls: ['./storedistributionset.less']
})
export class StoredistributionsetComponent implements OnInit {
  // 请求参数
  params: BaseParams = {
    search: {
      city: '',
      region_code: '',
      location: ''
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
  changecount: any = 0;
  itemlists: any;
  rephead: any;
  cow = 0; // 序号
  stores: any;
  channels: any;
  region_name: any;
  selectitemarr: any = []; // 批量操作选中的门店
  allchecked = false;
  isVisible = false;
  isConfirmLoading = false;
  modeltitle: any;
  psfs = false;
  psfy = false;
  editstore: any;
  zychannels: any;
  totaldiv: Boolean = false;
  //   @ViewChild(SearchSelect)
  //   private Child: SearchSelect;
  checkOptions: any = [];
  shippingfeearr: any = [
    {
      start_price: '', start_distance: '', start_weight: '',
      price: '', add_weight: '', add_weight_price: ''
      , add_distance: '', add_distance_price: '', time: { start: '', end: '' }, timestr: ''
    }
  ];
  plpsparams: any = {
    channel: '',
    region_code: [],
    costs: []
  };
  templeteobj: any; // 提示templete
  uploadFile: any;
  // end_format: any = HH:mm;
  // 上传导入文件到oss
  uploader: testUpload = new testUpload({
    url: 'http://images-m-glory.oss-cn-hangzhou.aliyuncs.com',
    method: 'POST'
  });
  constructor(private notification: NzNotificationService, private router: Router, private http: HttpService) {
    this.notification.config({
      nzPlacement: 'topRight'
    });
  }
  ngOnInit(): void {
    this.getStorelist();
    this.getreplists(this.params);
  }
  // 导入提示
  createBasicNotification(template: TemplateRef<{}>): void {
    this.notification.template(template, { nzDuration: 0 });
  }
  handleUpload(data: any): void {

    if (data && data.response) {
      data = JSON.parse(data.response);
      this.uploadFile = data;
    }
  }
  // 获取门店列表
  getStorelist() {
    // this.storedistributionsetService.getStorelist()
    //   .then(stores => {
    //     // const tmp = [{ code: '', codename: '全部门店' }].concat(stores);
    //     this.stores = stores;
    //   });
    this.http.getStorelist.request()
      .subscribe(stores => {
        this.stores = stores;
      });
  }
  // 获取汇总列表
  getreplists(param) {
    this.allchecked = false;
    this.selectitemarr = [];
    this.cow = (param.page_no - 1) * param.page_size;
    // this.storedistributionsetService.getreplists(param)
    //   .then(res => {
    //     this.itemlists = res.rows;
    //     this.rephead = res.channel;
    //     this.pageSize.count = res.count;
    //     this.changecount = res.count;
    //     this.message = '' ;
    //     for (let i = 0; i < this.itemlists.length; i++) {
    //       this.itemlists[i].isedittext = true;
    //     }

    //   });
    this.http.queryStoreDelivery.request(param)
      .subscribe(res => {
        this.itemlists = res['rows'];
        this.rephead = res['channel'];
        this.pageSize.count = res['count'];
        this.changecount = res['count'];
        this.message = '';
        for (let i = 0; i < this.itemlists.length; i++) {
          this.itemlists[i].isedittext = true;
        }
      });

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
  // 接收翻页操作传过来的值，然后请求服务得到新数据
  childparams($event) {
    const childoption = $event;
    this.params.page_no = childoption.page_no;
    this.cow = (childoption.page_no - 1) * childoption.page_size;
    this.getreplists(childoption);
  }
  searchcode($event) {
    this.params.search.region_code = $event;
    // this.getreplists(this.params);
  }
  // 门店列表选择显示编码加名称
  searchname($event) {
    this.region_name = $event;
  }
  search(param) {
    this.getreplists(param);
  }
  Reset() {
    this.params.search.city = '';
    this.params.search.region_code = '';
    // this.Child.clearshowtextvalue();
    this.region_name = '';
    this.params.search.location = '';
  }



  distributionset(item, a) { // 批量修改配送方式
    console.log(item);
    this.psfs = true;
    this.psfy = false;
    const stores = [];
    if (a == 2) {
      this.modeltitle = '修改' + item.name + '的配送方式';
      stores.push(item.region_code);
      this.editstore = JSON.parse(JSON.stringify(stores));
      this.getStoreDeliveryfun(stores, a);
    } else {
      if (this.selectitemarr.length < 1) {
        this.notification.create('warning', '提示', '请至少选择一项进行操作!');
      } else {
        console.log(item);
        this.modeltitle = '修改' + item.length + '家门店的配送方式';
        for (let i = 0; i < item.length; i++) {
          stores.push(item[i].region_code);
        }
        this.editstore = JSON.parse(JSON.stringify(stores));
        this.getStoreDeliveryfun(stores, a);
      }

    }
  }
  getStoreDeliveryfun(stores, g) {
    // this.storedistributionsetService.getStoreDelivery(stores)
    //   .then(res => {
    //     // console.log(res);
    //     res.forEach(res_list => {
    //       delete res_list.xzqd;
    //     });
    //     if (res && res.length > 0) {
    //       this.checkOptions = res;
    //       console.log(this.checkOptions);
    //       this.showModal();
    //     } else {
    //       this.notification.create('warning', '提示', '门店无自有平台!');
    //     }
    //   });
    this.http.findStoreDelivery.request<any>(stores)
      .subscribe(res => {
        res.forEach(res_list => {
          delete res_list['xzqd'];
        });
        if (res && res.length > 0) {
          this.checkOptions = res;
          console.log(this.checkOptions);
          this.showModal();
        } else {
          this.notification.create('warning', '提示', '门店无自有平台!');
        }
      });
  }

  n: any = 0;
  addBtn() { // 批量设置时间时添加一个时间范围
    this.n++;
    const dateitem: any = {
      start_price: '',
      start_distance: '',
      start_weight: '',
      price: '',
      add_weight: '',
      add_weight_price: ''
      , add_distance: '',
      add_distance_price: '',
      time: { start: '', end: '' },
      timestr: ''
    };
    this.shippingfeearr.push(dateitem);
  }

  // 批量设置时间时删除一个时间范围
  delBtn(index: any) {
    this.shippingfeearr.splice(index, 1);
  }
  // 获取渠道
  getchannels(): void {
    // this.storedistributionsetService.getchannels()
    //     .then(channels => {
    //         this.channels = channels.rows;
    //         // this.params.channel = this.channels[0].code;
    //     }
    //     );
    this.http.getChannels.request()
      .subscribe(channels => {
        this.channels = channels['rows'];
      });
  }
  batchdelivery() { // 批量修改配送费
    if (this.selectitemarr.length < 1) {
      this.notification.create('warning', '提示', '请至少选择一项进行操作!');
    } else {
      this.getchannels();
      this.shippingfeearr = [];
      const opt = {
        start_price: '',
        start_distance: '',
        start_weight: '',
        price: '',
        add_weight: '',
        add_weight_price: '',
        add_distance: '',
        add_distance_price: '',
        time: { start: '', end: '' },
        timestr: ''
      };
      this.shippingfeearr.push(opt);
      this.plpsparams.channel = '';
      this.psfy = true;
      this.psfs = false;
      this.modeltitle = '配送费用与范围';
      this.showModal();
    }
  }
  setshippingfee(item) {
    this.router.navigate(['/pages/storemanagement/shippingfeescope', item]);


  }
  showModal = () => {

    this.isVisible = true;
  }
  message = '';
  handleOk = () => {
    // this.isConfirmLoading = true;
    if (this.psfs) {
      const opt_temp = [];
      const opt = {
        region_code: [],
        devliverys: []
      };
      opt.region_code = JSON.parse(JSON.stringify(this.editstore));
      // console.log(this.checkOptions);

      if (this.checkOptions) {
        for (let i = 0; i < this.checkOptions.length; i++) {
          const devliveryopt: any = {
            channel: this.checkOptions[i].code,
            channelName: this.checkOptions[i].name,
            devlivery: this.checkOptions[i].xzqd,
            // devliveryName:
            // devliveryName: kk
          };
          this.checkOptions[i].deliverys.forEach(list => {
            if (list.code === this.checkOptions[i].xzqd) {
              devliveryopt.devliveryName = list.name;
            }
          });
          opt.devliverys.push(devliveryopt);
        }
        console.log(opt);
        for (let j = 0; j < opt.devliverys.length; j++) {
          if (opt.devliverys[j].devliveryName) {
            opt_temp.push(opt.devliverys[j]);

          } else {
            console.log('1');
          }
        }
        opt.devliverys = opt_temp;
        console.log(opt);


        // this.storedistributionsetService.savepsfs(opt)
        //     .then(res => {
        //         if (res.data.length > 0) {
        //             for (let i = 0; i < res.data.length; i++) {
        //                 this.message = this.message + res.data[i] + ',' + ' ';
        //             }
        //             alert(this.message);
        //         } else {
        //             alert(res.msg);
        //         }
        //         this.handleCancel(e);
        //         this.getreplists(this.params);
        //     });
        this.http.savepsfs.request(opt)
          .subscribe(res => {
            if (res['data'].length > 0) {
              for (let i = 0; i < res['data'].length; i++) {
                this.message = this.message + res['data'][i] + ',' + ' ';
              }
              this.notification.create('success', '温馨提示', this.message);
            } else {
              this.notification.create('error', '温馨提示', res['msg']);
            }
            this.handleCancel();
            this.getreplists(this.params);
          });
      }
    }
    if (this.psfy) {
      this.plpsparams.region_code = [];
      let check = false;
      console.log(this.shippingfeearr);
      for (let i = 0; i < this.shippingfeearr.length; i++) {
        let shourstr: any = '';
        let sminutesstr: any = '';
        let ehourstr: any = '';
        let eminutesstr: any = '';
        if (this.shippingfeearr[i].time.start && this.shippingfeearr[i].time.end) {
          check = true;
          if (this.shippingfeearr[i].time.start.getHours() >= 10) {
            shourstr = this.shippingfeearr[i].time.start.getHours();
          } else {
            shourstr = '0' + this.shippingfeearr[i].time.start.getHours();
          }
          if (this.shippingfeearr[i].time.start.getMinutes() >= 10) {
            sminutesstr = this.shippingfeearr[i].time.start.getMinutes();
          } else {
            sminutesstr = '0' + this.shippingfeearr[i].time.start.getMinutes();
          }

          if (this.shippingfeearr[i].time.end.getHours() >= 10) {
            ehourstr = this.shippingfeearr[i].time.end.getHours();
          } else {
            ehourstr = '0' + this.shippingfeearr[i].time.end.getHours();
          }
          if (this.shippingfeearr[i].time.end.getMinutes() >= 10) {
            eminutesstr = this.shippingfeearr[i].time.end.getMinutes();
          } else {
            eminutesstr = '0' + this.shippingfeearr[i].time.end.getMinutes();
          }
          const timeobjstart = shourstr + ':' + sminutesstr;

          const timeobjend = ehourstr + ':' + eminutesstr;
          const opt = timeobjstart + '-' + timeobjend;
          this.shippingfeearr[i].timestr = opt;
        } else {
          this.notification.create('error', '温馨提示', '开始时间和结束时间必填!');
          check = false;
          break;
        }

      }
      this.plpsparams.costs = JSON.parse(JSON.stringify(this.shippingfeearr));
      for (let i = 0; i < this.plpsparams.costs.length; i++) {
        this.plpsparams.costs[i].time = this.plpsparams.costs[i].timestr;
        delete this.plpsparams.costs[i].timestr;
      }
      console.log(this.selectitemarr);

      for (let j = 0; j < this.selectitemarr.length; j++) {
        this.plpsparams.region_code.push(this.selectitemarr[j].region_code);
      }
      if (check) {
        console.log(this.plpsparams);
        // this.storedistributionsetService.saveshippingfee(this.plpsparams)
        //     .then(res => {
        //         this.notification.blank('提示', res.msg);

        //     });
        this.http.getsavepsfj.request(this.plpsparams)
          .subscribe(res => {
            this.notification.create('success', '温馨提示', res['msg']);
          });
      }
      console.log(this.plpsparams);


    }

  }

  handleCancel = () => {
    this.psfs = false;
    this.psfy = false;
    this.isVisible = false;
  }
  policy: any;
  results: any;
  totaldiv3: boolean = false;
  new_results: any;
  // storecoordinates(file): void {
  //     // let form = new FormData();
  //     // form.append('file', file.files[0], file.files[0].name);
  //     this.totaldiv3 = true;
  //     file.value = '';
  //     if (this.uploader.queue[0]) {
  //         const filename = this.uploader.queue[0].file.name;

  //         let Num = '';
  //         for (let i = 0; i < 6; i++) {
  //             Num += Math.floor(Math.random() * 10);
  //         }

  //         if (this.policy) {
  //             const keyvalue = this.policy.dir + 'files/' + Num + filename;
  //             this.uploader.options.additionalParameter = {
  //                 name: Num + filename,
  //                 key: keyvalue,
  //                 policy: this.policy.policy,
  //                 OSSAccessKeyId: this.policy.accessid,
  //                 success_action_status: 200,
  //                 signature: this.policy.signature
  //             };
  //             this.uploader.queue[0].onSuccess = (response, status, headers) => {
  //                 // 上传文件成功
  //                 if (status == 200) {
  //                     // 上传文件后获取服务器返回的数据
  //                     const sucopt = {
  //                         filename: filename,
  //                         key: keyvalue,
  //                         remote_url: 'http://images-m-glory.oss-cn-hangzhou.aliyuncs.com/' + keyvalue,
  //                         local_url: 'images-m-glory.oss-cn-hangzhou-internal.aliyuncs.com/' + keyvalue,
  //                     };
  //                     console.log(sucopt);

  //                     this.storedistributionsetService.importStoreLocations(sucopt)
  //                         .then(data => {
  //                             if (data) {
  //                                 this.new_results = data;
  //                                 console.log(this.results);

  //                             }
  //                         });

  //                 } else {
  //                     alert('上传失败!');
  //                     file.value = '';

  //                     this.uploader.queue = [];
  //                     // 上传文件后获取服务器返回的数据错误
  //                 }
  //             };
  //             this.uploader.queue[0].withCredentials = false;
  //             this.uploader.queue[0].upload();
  //             file.value = '';
  //             this.uploader.queue = [];

  //         } else {
  //             this.getPolicyService.getpolicy()
  //                 .then(res => {
  //                     if (res) {
  //                         setTimeout(function () { this.policy = false; }, 250000);
  //                     }
  //                     this.policy = res;
  //                     const keyvalue = this.policy.dir + 'files/' + Num + filename;
  //                     // console.log(keyvalue);

  //                     // console.log(res);
  //                     this.uploader.options.additionalParameter = {
  //                         name: Num + filename,
  //                         key: keyvalue,
  //                         policy: this.policy.policy,
  //                         OSSAccessKeyId: this.policy.accessid,
  //                         success_action_status: 200,
  //                         signature: this.policy.signature
  //                     };
  //                     this.uploader.queue[0].onSuccess = (response, status, headers) => {
  //                         // 上传文件成功
  //                         if (status == 200) {
  //                             // 上传文件后获取服务器返回的数据
  //                             const sucopt = {
  //                                 filename: filename,
  //                                 key: keyvalue,
  //                                 remote_url: 'http://images-m-glory.oss-cn-hangzhou.aliyuncs.com/' + keyvalue,
  //                                 local_url: 'images-m-glory.oss-cn-hangzhou-internal.aliyuncs.com/' + keyvalue,
  //                             };

  //                             this.storedistributionsetService.importStoreLocations(sucopt)
  //                                 .then(data => {
  //                                     if (data) {
  //                                         this.new_results = data;
  //                                         console.log(this.results);

  //                                     }
  //                                 });


  //                         } else {
  //                             alert('上传失败!');
  //                             file.value = '';
  //                             this.uploader.queue = [];
  //                             // 上传文件后获取服务器返回的数据错误
  //                         }
  //                     };
  //                     this.uploader.queue[0].withCredentials = false;
  //                     this.uploader.queue[0].upload();
  //                     file.value = '';
  //                     this.uploader.queue = [];

  //                 });
  //         }
  //     } else {
  //         alert('请检查后重试！');
  //     }
  // }
  storecoordinates = (result: UploadResult): void => {
    if (result) {
      const sucopt = {
        filename: result.fileName,
        key: result.key,
        remote_url: result.remoteUrl,
        local_url: result.localUrl,
      };
      this.http.importStoreLocations.request(sucopt)
        .subscribe(data => {
          if (data) {
            this.results = data;
            console.log(112);
            this.createBasicNotification(this.templeteobj);
          }
        });
    }
  }

  // datainput = (result: UploadResult): void => {

  //     if (result) {
  //         const sucopt = {
  //             filename: result.fileName,
  //             channel: '',
  //             storesobj: '',
  //             key: result.key,
  //             local_url: result.localUrl,
  //             remote_url: result.remoteUrl
  //         };
  //         this.http.itemBaseImport.request(sucopt)
  //             .subscribe(data => {
  //                 if (data) {
  //                     this.results = data;
  //                     this.createBasicNotification(this.templeteobj);
  //                 }
  //             });
  //     }
  // }
  // 导入提示


  gettemplate(templete) {
    this.templeteobj = templete;
  }
  closediv3() {
    this.totaldiv3 = false;
  }

  editcoordinate(item) { // 修改店铺坐标
    item.isedittext = false;
  }
  savecoordinate(item) {
    const opt = {
      region_code: item.region_code,
      longitude: item.longitude,
      latitude: item.latitude
    };
    // this.storedistributionsetService.setStoreLocation(opt)
    //     .then(res => {
    //         alert(res.msg);
    //         this.getreplists(this.params);
    //     });
    this.http.setStoreLocation.request(opt)
      .subscribe(res => {
        this.notification.create('success', '温馨提示', res['msg']);
        this.getreplists(this.params);
      });
    item.isedittext = true;
  }

  download(filename: string): void {
    const filepath = '';
    // this.storedistributionsetService.download(filename)
    //     .then(data => {
    //         let link = document.createElement('a');
    //         link.setAttribute('href', window.URL.createObjectURL(data));
    //         link.setAttribute('download', filename + '.xlsx');
    //         link.style.visibility = 'hidden';
    //         document.body.appendChild(link);
    //         link.click();
    //         document.body.removeChild(link);
    //     });
    this.http.downloadFile(filepath, filename);
  }

  // 批量修改配送方式
  modify() {
    this.totaldiv = true;
    console.log('1212');
  }

  closediv() {
    this.totaldiv = false;
  }
}

