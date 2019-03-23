import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/http/http.service';
import { testUpload } from 'src/app/utils/test.upload';
import { NzMessageService } from 'ng-zorro-antd';
import { NzNotificationService, NzModalService } from 'ng-zorro-antd';
@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.less']
})
export class InvoiceComponent implements OnInit {
  public invoicelist: any;
  public selectedIndex = 1;
  public param: String = "";
  public isVisible: Boolean = false; // 发票公司对话框
  public isVisible1: Boolean = false; // 发票详情对话框
  public isConfirmLoading: Boolean = false; // 对话框确认按钮loading显示
  public isUsed = true;
  public indeterminate = false;
  public checked = false;
  modeltitle: String = ''; // 对话框标题
  userdetails: any = {
    compony: '', // 公司名称
    dutynum: '', // 税号
    principal: '', // 负责人
    tel: '', // 电话
    passward: '', // 证书密码
    appid: '', // appid
    secretkey: '', // 密钥
    invoiceStorecode: '', // 选择发票门店列表
    electronicStorecode: '', // 选择电子发票门店列表
    _id: '',        // 标识
    receiver: '',      // 收款人
    reviewer: '',     // 复核人
    drawer: '',       // 开票人
    invoice_address: '',    // 发票地址
  };
  downfileButton: Boolean;        // 是否显示下载文件按钮
  isFilelist: Boolean = false;
  public fileList = new Array();
  public filetext: String = "点击上传文件";
  public storecode: any;
  public saveUploadResult: any;
  public fileUrl: String;
  public filelistname: string;
  public invoiceStorelist = [];

  constructor(private http: HttpService, private msg: NzMessageService, private notification: NzNotificationService, private modalService: NzModalService) {
    this.notification.config({
      nzPlacement: 'topRight'
    });
  }

  ngOnInit() {
    this.search(1);
  }

  search(type = null) {
    this.indeterminate = false; // table表单选择框状态
    this.checked = false; // table表单选择框状态
    console.log(this.indeterminate, this.checked);
    let opt: any;
    if (type !== null) {
      opt = {
        sheet: type
      };
    } else {
      opt = {
        search: this.param
      };
    }
    this.http.getInvoicelist.request(opt)
      .subscribe(res => {
        console.log(res);
        if (res['sheet'] === 0) {
          // 返回的为发票信息
          this.selectedIndex = 0;
          this.invoicelist = res['invoices'];
        } else {
          this.selectedIndex = 1;
          this.invoiceStorelist = [];
          for (const iterator of res['invoices']) {

            for (const index of iterator.region_code) {

              const codeIndex = index.indexOf('[');
              const nameIndex = index.indexOf(']');
              const invoiceObj = {
                code: iterator.e_region_code,
                storecode: index.substring(codeIndex + 1, nameIndex),
                storename: index.substr(nameIndex + 1),
                invoice_company: iterator.invoice_company,
                region_code: iterator.region_code,
                e_region_code: index,
                _id: iterator._id,
                isAdd: '',
                invoice_switch: iterator.invoice_switch,
              };
              this.invoiceStorelist.push(invoiceObj);
            }
          }

          // this.invoiceStorelist.
          for (let i = 0; i < this.invoiceStorelist.length; i++) {
            const regionlist = this.invoiceStorelist[i];
            if (regionlist.code === undefined) {
              regionlist.isAdd = false;
            } else {
              if (regionlist.code.indexOf(regionlist.e_region_code) !== -1) {
                regionlist.isAdd = true;
              } else {
                regionlist.isAdd = false;
              }
            }
          }
          this.invoiceStorelist = this.invoiceStorelist.slice();
          console.log(this.invoiceStorelist);


        }
      })
  }
  reset() {
    this.param = "";
    console.log(this.invoiceStorelist);
  }

  // 获取门店列表
  getStorelist() {
    this.http.getStorelist.request()
      .subscribe(res => {
        this.storecode = res;
      });
  }



  // 单个启用/禁用按钮发票公司
  stopEmploy(params: any) {
    console.log(params);
    if (params.invoice_switch) {
      this.modalService.confirm({
        nzTitle: '温馨提示',
        nzContent: '你确定要停用此发票公司吗',
        nzOnOk: () => {
          this.getswitchcompany(params);
        }
      });
    } else {
      this.modalService.confirm({
        nzTitle: '温馨提示',
        nzContent: '你将要启用此发票公司',
        nzOnOk: () => {
          this.getswitchcompany(params);
        }
      });
    }
  }
  // 门店库存管理-启停用发票公司
  getswitchcompany(params) {
    const opt = {
      _id: params._id,
      invoice_switch: params.invoice_switch
    };
    this.http.getswitchcompany.request(opt)
      .subscribe(res => {
        if (res['status']) {
          if (params.invoice_switch) {
            params.invoice_switch = false;
          } else {
            params.invoice_switch = true;
          }
        } else {
          this.notification.create('error', '温馨提示', res['msg']);
        }
      })
  }

  addInvoice() {
    this.getStorelist();
    this.isVisible = true;
    this.modeltitle = '新增公司发票信息';
    this.filetext = '点击上传文件';
    this.downfileButton = false;
    this.isFilelist = false;
    // this.uploader.queue = [];
    this.userdetails = {
      compony: '', // 公司名称
      dutynum: '', // 税号
      principal: '', // 负责人
      tel: '', // 电话
      passward: '', // 证书密码
      appid: '', // appid
      secretkey: '', // 密钥
      invoiceStorecode: [], // 选择发票门店列表
      electronicStorecode: [], // 选择电子发票门店列表
      receiver: '',      // 收款人
      reviewer: '',     // 复核人
      drawer: '',       // 开票人
      invoice_address: '',    // 发票地址
      open_bank: ''   // 开户行
    };
  }

  // 点击编辑按钮弹出对话框
  comPile(params: any) {
    this.isVisible = true;
    this.modeltitle = '编辑公司发票信息';
    this.filetext = '点击更改上传文件';
    this.downfileButton = true;
    this.isFilelist = true;
    this.http.getInvoicedetail.request({ _id: params._id })
      .subscribe(res => {
        console.log(res);

        this.userdetails = {
          compony: res['invoice_company'], // 公司名称
          dutynum: res['invoice_no'], // 税号
          principal: res['principal'], // 负责人
          tel: res['tel'], // 电话
          passward: res['cert_password'], // 证书密码
          appid: res['app_id'], // appid
          secretkey: res['key'], // 密钥
          invoiceStorecode: res['region_code'], // 选择发票门店列表
          electronicStorecode: res['e_region_code'], // 选择电子发票门店列表
          _id: res['_id'],
          receiver: res['receiver'],      // 收款人
          reviewer: res['reviewer'],     // 复核人
          drawer: res['drawer'],       // 开票人
          invoice_address: res['invoice_address'],    // 发票地址
          open_bank: res['open_bank']   // 开户行
        };
        this.fileUrl = res['certificate'];
        let index = this.fileUrl.lastIndexOf("\/");
        this.filelistname = this.fileUrl.substring(index + 1, this.fileUrl.length);
      });
  }

  // 对话框中点击确定
  handleOk(userdetails: any) {
    console.log(userdetails);
    let saveBtPd = false;
    const opt = {
      _id: userdetails._id,
      invoice_company: userdetails.compony,
      invoice_no: userdetails.dutynum,
      principal: userdetails.principal,
      tel: userdetails.tel,
      certificate: this.saveUploadResult ? this.saveUploadResult.remote_url : userdetails.url,
      cert_password: userdetails.passward,
      app_id: userdetails.appid,
      key: userdetails.secretkey,
      region_code: userdetails.invoiceStorecode,
      e_region_code: userdetails.electronicStorecode,
      receiver: userdetails.receiver,
      reviewer: userdetails.reviewer,
      drawer: userdetails.drawer,
      invoice_address: userdetails.invoice_address,    // 发票地址
      open_bank: userdetails.open_bank
    };
    console.log(opt);
    for (let item in userdetails) {
      if (item !== 'principal' && item !== 'tel' && item !== 'invoiceStorecode' && item !== 'electronicStorecode') {

        if (userdetails[item] == "") {
          console.log(item);
          console.log(userdetails[item]);
          saveBtPd = true;
        }
      }
    }
    if (saveBtPd) {
      this.notification.create('warning', '温馨提示', '注意：* 号内容为必填项，不能为空');
    } else {
      this.isConfirmLoading = true;
      if (!this.userdetails._id) {
        console.log("新增公司");
        this.http.addInvoiceCompany.request(opt)
          .subscribe(res => {
            if (res['status']) {
              this.isConfirmLoading = false;
              this.isVisible = false;
              this.isFilelist = false;
              this.search();
            } else {
              this.notification.create('error', '温馨提示', res['msg']);
            }
          });
      } else {
        this.http.updateInvoiceCompany.request(opt)
          .subscribe(res => {
            if (res['status']) {
              this.isConfirmLoading = false;
              this.isVisible = false;
              this.search();
            } else {
              this.notification.create('error', '温馨提示', res['msg']);
            }
          });

      }

    }
  }


  uploader = (result) => {
    console.log(result);
    console.log(this.fileList);
    if (result.fileName.indexOf('.pfx') == -1) {
      this.msg.error(`请上传pfx文件`);
      this.fileList = [];
    } else {
      this.saveUploadResult = {
        fileName: result.fileName,
        key: result.key,
        localUrl: result.localUrl,
        remoteUrl: result.remoteUrl,
      };
    }
    if (this.fileList.length != 1) {
      this.msg.error(`只能上传一个文件`);
      this.fileList = this.fileList.splice(1, 1);
    }
  }

  // 取消对话框
  handleCancel(e) {
    // console.log('取消按钮');
    this.isVisible = false;
    this.isVisible1 = false;
    this.fileList = [];
  }

  // 选择所有门店
  setimportallstore(event) {
    // event.nzIndeterminate = false;
    this.indeterminate = false;
    if (event.nzChecked) {
      this.invoiceStorelist.forEach(item => item.sfxz = true);
      this.isUsed = false;
    } else {
      this.invoiceStorelist.forEach(item => item.sfxz = false);
      this.isUsed = true;
    }
  }

  checkList(event) {
    let count = this.invoiceStorelist.filter(item => item.sfxz == true);
    this.isUsed = count.length > 0 ? false : true;
    if (this.invoiceStorelist.every(item => item.sfxz === true)) {
      // event.nzIndeterminate = false;
      this.indeterminate = false;
    } else if (this.invoiceStorelist.every(item => item.sfxz === false)) {
      // event.nzIndeterminate = false;
      this.indeterminate = true;
      event.nzChecked = false;

    } else {
      this.indeterminate = true;
      // event.nzIndeterminate = true;
    }
  }

  // 单个启停用电子发票
  onSwitch(params) {
    console.log(params);
    const opt = {
      isAdd: !params.isAdd,
      _id: params._id,
      e_region_code: params.e_region_code
    };
    this.http.switchInvoice.request(opt)
      .subscribe(res => {
        console.log(res);
        this.notification.create('success', '温馨提示', res['msg']);
        this.search(1);
      });

  }
  // 批量关闭是否启动电子发票
  bathOperationStopShop(type) {
    let checkList = this.invoiceStorelist.filter(item => item.sfxz === true);
    console.log(type);
    if (checkList.every(item => item.invoice_switch === true)) {
      console.log(checkList);
      this.modalService.confirm({
        nzTitle: '温馨提示',
        nzContent: '你确定要批量停用所选中的电子发票吗？',
        nzOnOk: () => {
          const opt = {
            data: checkList,
            isSwitch: type ? 'on' : 'off'
          };
          this.http.batchSwitch.request(opt)
            .subscribe(res => {
              if (res['status']) {
                this.search(1);
              } else {
                this.notification.create('error', '温馨提示', res['msg']);
                this.search(1);
              }
            })
        }
      });
    } else {
      this.notification.create('error', '温馨提示', '你批量选择的门店中有已禁用的发票公司，不可操作，请重新选择');
    }
    console.log(checkList);


  }

  showInfos(params) {
    this.isVisible1 = true;
    const opt = {
      _id: params._id
    };
    this.http.getInvoicedetail.request(opt)
      .subscribe(res => {
        console.log(res);

        this.userdetails = {
          compony: res['invoice_company'], // 公司名称
          dutynum: res['invoice_no'], // 税号
          principal: res['principal'], // 负责人
          tel: res['tel'], // 电话
          passward: res['cert_password'], // 证书密码
          appid: res['app_id'], // appid
          secretkey: res['key'], // 密钥
          invoiceStorecode: res['region_code'], // 选择发票门店列表
          electronicStorecode: res['e_region_code'], // 选择电子发票门店列表
          _id: res['_id'],
          receiver: res['receiver'],      // 收款人
          reviewer: res['reviewer'],     // 复核人
          drawer: res['drawer'],       // 开票人
          invoice_address: res['invoice_address'],    // 发票地址
          open_bank: res['open_bank']
        };
        this.fileUrl = res['certificate'];
        const certindex = res['certificate'].indexOf('/files/');
        this.filelistname = res['certificate'].substr(certindex + 14);
      });

  }



}
