import { Component, OnInit, TemplateRef  } from '@angular/core';
import { BaseParams } from '../../../utils/base.list.params';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Authbts, Whetherdisplay } from '../../../validates/validates';
import { HttpService } from '../../../http/http.service';
import { UploadResult } from 'src/app/sharecomponets/upload/upload.component';
import { NzNotificationService } from 'ng-zorro-antd';


@Component({
    templateUrl: './liststores.html',
    styleUrls: ['./liststores.less']
})
export class ListStoresComponent implements OnInit {
    paras: BaseParams = {
        search: {
            code: '',
            name: '',
            city: '',
            status: '',
            channel: ''
        },
        page_no: 1,
        page_size: 50,
        sort: 'code',
        sortDirKey: 'ASC'
    };

    page: any =
        {
            count: 0,
            totalPage: 0
        };
    cow: number;
    stores: any;

    btns: any;
    xzmdxx: Boolean = true;
    mddrmb: Boolean = true;
    plbdmdmb: Boolean = true;
    mddr: Boolean = true;
    plbdmddrbt: Boolean = true;
    dcdcsvwj: Boolean = true;
    szbt: Boolean = true;
    ckrzbt: Boolean = true;
    policy: any;
    uploadFile: any;
    templeteobj: any;
    localbtns: any;
    userrights: any;
    userentid: any;
    usercode: any;
    searchcode($event) {
        this.paras.search.code = $event;
    }
    constructor(private router: Router, private route: ActivatedRoute,  private http: HttpService, private notification: NzNotificationService
    ) {
      this.notification.config({
        nzPlacement: 'topRight'
      });
    }

    ngOnInit(): void {
        this.btns = Authbts('门店管理', '门店列表');
        console.log(this.btns);
        this.xzmdxx = Whetherdisplay(this.btns, '新增门店信息');
        this.mddrmb = Whetherdisplay(this.btns, '门店导入模板');
        this.plbdmdmb = Whetherdisplay(this.btns, '批量绑定门店模板');
        this.mddr = Whetherdisplay(this.btns, '门店导入');
        this.plbdmddrbt = Whetherdisplay(this.btns, '批量绑定门店导入');
        this.dcdcsvwj = Whetherdisplay(this.btns, '导出到CSV文件');
        this.szbt = Whetherdisplay(this.btns, '设置');
        this.ckrzbt = Whetherdisplay(this.btns, '查看日志');
        this.getchannels();
        this.getStorelist();
        this.getStores(this.paras);
    }
    handleUpload(data: any): void {

        if (data && data.response) {
            data = JSON.parse(data.response);
            this.uploadFile = data;
        }
    }
    gettemplate(templete) {
        this.templeteobj = templete;
    }
    // 导入提示
    createBasicNotification(template: TemplateRef<{}>): void {
        this.notification.template(template, { nzDuration: 0 });
    }
    // 获取渠道
    channels: any[];
    getchannels(): void {
        // this.listStoresService.getchannels()
        //     .then(channels => {
        //         this.channels = channels.rows;
        //     }
        //     );
        this.http.getlistchannels.request()
            .subscribe(channels => {
                this.channels = channels['rows'];
            });
    }
    // 上传导入文件到oss
    // uploader: testUpload = new testUpload({
    //     url: 'http://images-m-glory.oss-cn-hangzhou.aliyuncs.com',
    //     method: 'POST'
    // });
    // 获取门店列表
    storecode: any;
    getStorelist() {
        // this.listStoresService.getStorelist()
        //     .then(store => {
        //         this.storecode = store;

        //     });
        this.http.getstorealist.request({})
            .subscribe(store => {
                this.storecode = store;

            });
    }


    // 输入条件查询方法
    search(paramsoption) {
        paramsoption.page_no = 1;
        this.getStores(paramsoption);
    }
    // 接收翻页操作传过来的值，然后请求服务得到新数据
    childparams($event) {
        let childoption = $event;
        this.paras.page_no = childoption.page_no;
        this.cow = (childoption.page_no - 1) * childoption.page_size;
        this.getStores(childoption);

    }
    changecount: any = 0;
    getStores(param) {
        this.cow = (param.page_no - 1) * param.page_size;
        // this.listStoresService.getStores(param)
        //     .then(stores => {
        //         this.stores = stores;
        //     });
        this.http.getstores.request(param)
            .subscribe(stores => {
                this.stores = stores['rows'];

                console.log(stores);
            });
        // this.listStoresService.getStoreCount(this.paras)
        //     .then(storeCount => {
        //         this.page.count = storeCount.count;
        //         this.changecount = storeCount.count;
        //     });
        this.http.getstorecount.request(this.paras)
            .subscribe(storeCount => {
                this.page.count = storeCount['count'];
                this.changecount = storeCount['count'];
            });
    }

    totaldiv1: boolean = false;
    storeslogs: any;
    getStoresLog(param) {

        // this.listStoresService.getStoresLog(param)
        //     .then(storeslog => {

        //         if (storeslog.code === false) {
        //             alert(storeslog.msg);
        //         } else {
        //             this.storeslogs = storeslog;
        //             this.totaldiv1 = true;
        //         }
        //     });
        this.http.getstoreslog.request(param)
            .subscribe(storeslog => {

                if (storeslog['code'] === false) {
                  this.notification.create('error', '温馨提示', storeslog['msg']);
                } else {
                    this.storeslogs = storeslog;
                    this.totaldiv1 = true;
                }
            });
    }
    closediv1() {
        this.totaldiv1 = false;
    }


    addexport() {
        let exportname: any, name: any, channel: any;
        if (this.paras.search.name) { name = this.paras.search.name + '-'; } else { name = '' }
        if (this.paras.search.channel) { channel = this.paras.search.channel + '-'; } else { channel = '' }
        exportname = name + channel;
        let parame = {
            'path': '/test-export-bsp/store/getstores',
            'search': {
                'code': '',
                'name': '',
                'city': '',
                'status': '',
                'channel': ''
            },
            'desc': exportname + '门店列表',
            'sort': 'code',
            'sortDirKey': 'ASC',
            'export_columns': [
                { 'name': '门店编码', 'key': 'code' },
                { 'name': '城市', 'key': 'city' },
                { 'name': '门店名称', 'key': 'name' },
                { 'name': '门店地址', 'key': 'address' },
                { 'name': '上线日期', 'key': 'sxrq' },
                { 'name': '启用渠道', 'key': 'qudao' },
                { 'name': '库存共享率', 'key': 'kcgxl' },
                { 'name': '安全库存量', 'key': 'aqkcl' }
            ]
        };
        parame.search = this.paras.search;
        // this.listStoresService.addexport(parame)
        //     .then(row => {
        //         if (row) {
        //             alert(row.msg);
        //         } else {
        //             alert('添加失败,请重试！');
        //         }

        //     });
        this.http.addexport.request(parame)
            .subscribe(row => {
                if (row) {
                    this.notification.create('success', '温馨提示', row['msg']);
                } else {
                    this.notification.create('error', '温馨提示', '添加失败,请重试！');
                }
            });
    }

    download(filename: string): void {

        const filepath = '';
        // this.listStoresService.download(filename)
        //     .then(data => {
        //         let link = document.createElement('a');
        //         link.setAttribute('href', window.URL.createObjectURL(data));
        //         link.setAttribute('download', filename + '.xlsx');
        //         link.style.visibility = 'hidden';
        //         document.body.appendChild(link);
        //         link.click();
        //         document.body.removeChild(link);
        //     }
        //     );
        this.http.downloadFile(filepath, filename);
    }


    // loadingimgurl: string = loadingimage;
    loadingimg: boolean = false;
    results: any;
    new_results: any;
    storeinput = (result: UploadResult): void => {
        const sucopt = {
            filename: result.fileName,
            key: result.key,
            local_url: result.localUrl,
            remote_url: result.remoteUrl
        };
        this.http.storeChannelInput.request(sucopt)
            .subscribe(data => {
                if (data) {
                    this.results = data;
                    this.createBasicNotification(this.templeteobj);
                }
            });
    }
    // 门店导入
    // storeinput(file3): void {
    //     this.loadingimg = true;
    //     // this.importtip = true;
    //     // let form = new FormData();
    //     // form.append("file", file.files[0], file.files[0].name);


    //     // this.listStoresService.storeinput(form)
    //     //     .then(data => {
    //     //         if (data) {
    //     //             this.loadingimg = false;
    //     //             this.results = data;
    //     //         }
    //     //     });
    //     if (this.uploader.queue[0]) {
    //         let filename = this.uploader.queue[0].file.name;

    //         let Num = '';
    //         for (let i = 0; i < 6; i++) {
    //             Num += Math.floor(Math.random() * 10);
    //         }

    //         if (this.policy) {
    //             let keyvalue = this.policy.dir + 'files/' + Num + filename;
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
    //                     let sucopt = {
    //                         filename: filename,
    //                         // channel: '',
    //                         // storesobj: '',
    //                         key: keyvalue,
    //                         local_url: 'images-m-glory.oss-cn-hangzhou-internal.aliyuncs.com/' + keyvalue,
    //                         remote_url: 'http://images-m-glory.oss-cn-hangzhou.aliyuncs.com/' + keyvalue
    //                     };

    //                     this.listStoresService.storeinput(sucopt)
    //                         .then(data => {
    //                             if (data) {
    //                                 this.loadingimg = false;
    //                                 this.new_results = data;
    //                                 this.importtip = true;
    //                             }
    //                         });
    //                 } else {
    //                     alert('上传失败!');
    //                     file3.value = '';

    //                     this.uploader.queue = [];
    //                     // 上传文件后获取服务器返回的数据错误
    //                 }
    //             };
    //             this.uploader.queue[0].withCredentials = false;
    //             this.uploader.queue[0].upload();
    //             file3.value = '';
    //             this.uploader.queue = [];

    //         } else {
    //             this.getPolicyService.getpolicy()
    //                 .then(res => {
    //                     if (res) {
    //                         setTimeout(function () { this.policy = false; }, 250000);
    //                     }
    //                     this.policy = res;
    //                     let keyvalue = this.policy.dir + 'files/' + Num + filename;
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
    //                             let sucopt = {
    //                                 filename: filename,
    //                                 // channel: '',
    //                                 // storesobj: '',
    //                                 key: keyvalue,
    //                                 local_url: 'images-m-glory.oss-cn-hangzhou-internal.aliyuncs.com/' + keyvalue,
    //                                 remote_url: 'http://images-m-glory.oss-cn-hangzhou.aliyuncs.com/' + keyvalue
    //                             };

    //                             this.listStoresService.storeinput(sucopt)
    //                                 .then(data => {
    //                                     if (data) {
    //                                         this.loadingimg = false;
    //                                         this.new_results = data;
    //                                         this.importtip = true;
    //                                     }
    //                                 });


    //                         } else {
    //                             alert('上传失败!');
    //                             file3.value = '';
    //                             this.uploader.queue = [];
    //                             // 上传文件后获取服务器返回的数据错误
    //                         }
    //                     };
    //                     this.uploader.queue[0].withCredentials = false;
    //                     this.uploader.queue[0].upload();
    //                     file3.value = '';
    //                     this.uploader.queue = [];

    //                 });
    //         }
    //     } else {
    //         alert('请检查后重试！');
    //     }

    // }
    // 单位转换系数导入
    // dwzhxsimports = (result: UploadResult): void => {
    //     const sucopt = {
    //         filename: result.fileName,
    //         channel: '',
    //         storesobj: '',
    //         key: result.key,
    //         local_url: result.localUrl,
    //         remote_url: result.remoteUrl
    //     };
    //     this.http.dwzhxsImport.request(sucopt)
    //         .subscribe(data => {
    //             if (data) {
    //                 this.results = data;
    //                 this.createBasicNotification(this.templeteobj);
    //             }
    //         });
    // }
    pldbmddr = (result: UploadResult): void => {
        const sucopt = {
            filename: result.fileName,
            key: result.key,
            local_url: result.localUrl,
            remote_url: result.remoteUrl
        };
        this.http.storeChannelInput.request(sucopt)
            .subscribe(data => {
                if (data) {
                    this.results = data;
                    this.createBasicNotification(this.templeteobj);
                }
            });
    }
    // 批量绑定门店导入
    // plbdmddr(file3): void {

    //     if (this.uploader.queue[0]) {
    //         let filename = this.uploader.queue[0].file.name;

    //         let Num = '';
    //         for (let i = 0; i < 6; i++) {
    //             Num += Math.floor(Math.random() * 10);
    //         }

    //         if (this.policy) {
    //             let keyvalue = this.policy.dir + 'files/' + Num + filename;
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
    //                     let sucopt = {
    //                         filename: filename,
    //                         // channel: '',
    //                         // storesobj: '',
    //                         key: keyvalue,
    //                         local_url: 'images-m-glory.oss-cn-hangzhou-internal.aliyuncs.com/' + keyvalue,
    //                         remote_url: 'http://images-m-glory.oss-cn-hangzhou.aliyuncs.com/' + keyvalue
    //                     };

    //                     this.listStoresService.plstoreinput(sucopt)
    //                         .then(data => {
    //                             if (data) {
    //                                 this.loadingimg = false;
    //                                 this.new_results = data;
    //                                 this.importtip = true;
    //                             }
    //                         });
    //                 } else {
    //                     alert('上传失败!');
    //                     file3.value = '';

    //                     this.uploader.queue = [];
    //                     // 上传文件后获取服务器返回的数据错误
    //                 }
    //             };
    //             this.uploader.queue[0].withCredentials = false;
    //             this.uploader.queue[0].upload();
    //             file3.value = '';
    //             this.uploader.queue = [];

    //         } else {
    //             this.getPolicyService.getpolicy()
    //                 .then(res => {
    //                     if (res) {
    //                         setTimeout(function () { this.policy = false; }, 250000);
    //                     }
    //                     this.policy = res;
    //                     let keyvalue = this.policy.dir + 'files/' + Num + filename;
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
    //                             let sucopt = {
    //                                 filename: filename,
    //                                 // channel: '',
    //                                 // storesobj: '',
    //                                 key: keyvalue,
    //                                 local_url: 'images-m-glory.oss-cn-hangzhou-internal.aliyuncs.com/' + keyvalue,
    //                                 remote_url: 'http://images-m-glory.oss-cn-hangzhou.aliyuncs.com/' + keyvalue
    //                             };
    //                             this.listStoresService.plstoreinput(sucopt)
    //                                 .then(data => {
    //                                     if (data) {
    //                                         this.loadingimg = false;
    //                                         this.new_results = data;
    //                                         this.importtip = true;
    //                                     }
    //                                 });
    //                         } else {
    //                             alert('上传失败!');
    //                             file3.value = '';
    //                             this.uploader.queue = [];
    //                             // 上传文件后获取服务器返回的数据错误
    //                         }
    //                     };
    //                     this.uploader.queue[0].withCredentials = false;
    //                     this.uploader.queue[0].upload();
    //                     file3.value = '';
    //                     this.uploader.queue = [];

    //                 });
    //         }
    //     } else {
    //         alert('请检查后重试！');
    //     }

    // }




    Reset() {
        this.paras.search.code = '',
            this.paras.search.name = '',
            this.paras.search.city = '',
            this.paras.search.status = '',
            this.paras.search.channel = '';

        // this.Child.clearshowtextvalue();
    }


    gotoeditliststores(store: any) {

        this.router.navigate(['/pages/maindata/editliststores', store]);
    }
    gotoaddstore() {
        this.router.navigate(['/pages/maindata/addstores']);
    }

    importtip: boolean = false;
    closeimportip() {
        this.importtip = false;
    }

    // 设置电话号码
    phones: any = {
        "phone": "",
        "region_code": ""
    }
    phone: boolean = false;
    setphone(par) {
        this.phone = true;
        this.phones.region_code = par.code;
    }
    savePhone() {
        // this.listStoresService.storePhone(this.phones)
        //     .then(data => {
        //         alert(data.msg);
        //         if (data.code === '0') {
        //             this.phone = false;
        //             this.getStores(this.paras);
        //         }
        //     });
        this.http.storePhone.request(this.phones)
            .subscribe(data => {
              this.notification.create('success', '温馨提示', data['msg']);
                if (data['code'] === '0') {
                    this.phone = false;
                    this.getStores(this.paras);
                }
            });
    }
    closephone() {
        this.phone = false;
    }

}

