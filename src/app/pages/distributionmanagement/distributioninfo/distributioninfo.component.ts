import { Component, Input, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BaseParams } from 'src/app/utils/base.list.params';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/http/http.service';
// import { SearchSelect } from '../../../../theme/components/searchSelect';
import { DatePipe } from '@angular/common';
import { Authbts, Whetherdisplay, GMTToStr } from '../../../validates/validates';
import { NzModalService } from 'ng-zorro-antd';
import { stringify } from '@angular/compiler/src/util';
import { NzNotificationService } from 'ng-zorro-antd';
@Component({
  templateUrl: './distributioninfo.html',
  styleUrls: ['./distributioninfo.less']
})
export class DistributioninfoComponent implements OnInit {
  checkpass: any = 'password';
  // 请求参数
  userdetails: any = {
    code: '', // 账号
    name: '', // 姓名
    password: '',
    mobileNo: '', // 手机号码
    status: '', // 用户状态
    usertype: '-30000', // 用户类型
    userstores: '', // 选择的门店
    rolecode: '',
    rolename: '',
    channel_keywords: []
  };
  passwordagain: any = '';
  isOkLoading = false;
  userstores: any = '';
  modelinput = true;
  params: BaseParams = {
    search: {
      code: '', // 门店
      name: '', // 配送员用户名
      usertype: '-30000',
      status: '', // 账号状态
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

  cow = 0; // 序号
  isConfirmLoading = false;
  modeltitle: any;
  isVisible = false;
  region_name: string;
  changecount: any = 0;
  totaldiv = false;
  myDate: any;
  myDate1: any;
  statements: any;
  localuser = window.localStorage.getItem('userinfo'); // 获取鉴权里的用户信息
  userrights: any;
  // @ViewChild(SearchSelect)
  // private Child: SearchSelect;
  _startDate = null;
  _endDate = null;
  isshow = true;
  tip: any;
  // 获取企业
  ents = [];
  channels: any[];
  menuList: any; // 配送员菜单列表
  itemid: any;
  stores: any;
  allstores: any;
  // 门店
  searchcodename: any = {};
  constructor(private router: Router, private http: HttpService, private modalService: NzModalService, private notification: NzNotificationService) {
    this.notification.config({
      nzPlacement: 'topRight'
    });
  }

  ngOnInit() {
    this.getStorelist();
    this.getuserdetails(this.params);
  }


  changeent(entid) {
    this.userdetails.storecode = [];
    const entparam = { ent_id: String(entid) };
    this.stores = [];
    // this.distributioninfoService.getentstores(entparam)
    //     .then(res => {
    //     });
    this.http.getentstores.request(entparam)
      .subscribe(res => {

      });
    this.getchannels(entparam);
  }
  // 模态框 添加配送员信息
  addpushconfig() {
    this.modeltitle = '录入配送员信息';
    this.userdetails = {
      code: '', // 账号
      name: '', // 姓名
      password: '',
      mobileNo: '', // 手机号码
      status: '', // 用户状态
      usertype: '-30000', // 用户类型
      userstores: '', // 选择的门店
      rolecode: '',
      rolename: '',
      channel_keywords: []
    };
    this.isshow = true;
    this.showModal();
  }

  // 添加配送员页面 确定提交按钮
  handleOk = (userdetails: any) => {
    console.log(this.modeltitle);
    if (this.modeltitle === '录入配送员信息') {
      console.log(1111111222222);
      console.log(userdetails);
      const usarr = [{ code: userdetails.userstores }];
      console.log(usarr);
      const psyopt = {
        code: userdetails.code, // 账号
        name: userdetails.name, // 姓名
        password: userdetails.password,
        mobileNo: userdetails.mobileNo, // 手机号码
        status: userdetails.status, // 用户状态
        usertype: '-30000', // 用户类型
        userstores: [], // 选择的门店
      };
      psyopt.userstores = usarr;
      if (psyopt.code && psyopt.name && psyopt.password && psyopt.status && psyopt.usertype) {
        // console.log(999)
        // alert('请正确填写内容')
        if (psyopt.userstores[0].code === '') {
          this.notification.create('error', '温馨提示', '门店用户必须选择门店!');
          // console.log(121)
        } else {
          // console.log(131)
          const testpass = String(psyopt.password);
          const testpassagain = String(this.passwordagain);
          if (testpass === '') {
            this.notification.create('error', '温馨提示', '请输入密码!');
          } else if (testpass !== testpassagain) {
            this.notification.create('error', '温馨提示', '两次密码输入不一致!');
          } else if (testpass.match(/\d/) && testpass.match(/[a-zA-Z]/) && testpass.length >= 6) {

            // this.distributioninfoService.saveUserDetail(psyopt)
            //     .then(tip => {
            //         this.tip = tip;
            //         alert(this.tip.msg);
            //         if (this.tip.code && this.tip.code === 'success') {
            //             this.getuserdetails(this.params);
            //             this.isVisible = false;
            //             this.isConfirmLoading = false;
            //         }
            //     });
            this.http.saveuserinfos.request(psyopt)
              .subscribe(tip => {
                this.tip = tip;
                this.notification.create('success', '温馨提示', this.tip.msg);
                if (this.tip.code && this.tip.code === 'success') {
                  this.getuserdetails(this.params);
                  this.isVisible = false;
                  this.isConfirmLoading = false;
                }
              });
          } else {
            this.notification.create('error', '温馨提示', '密码不符合规则，请重新输入 提示 密码格式为 字母 + 数字组合!');
          }
        }
      } else {
        this.notification.create('error', '温馨提示', '请正确填写内容*号为必填项');
      }
    } else {
      console.log(userdetails.userstores);
      const usarr = [{ code: userdetails.userstores }];
      const psyopt = {
        code: userdetails.code, // 账号
        name: userdetails.name, // 姓名
        password: userdetails.password,
        mobileNo: userdetails.mobileNo, // 手机号码
        status: userdetails.status, // 用户状态
        usertype: '-30000', // 用户类型
        userstores: [], // 选择的门店
        id: this.itemid
      };
      // console.log(111);
      // console.log(psyopt);
      psyopt.userstores = usarr;
      if (psyopt.code && psyopt.name && psyopt.password && psyopt.status && psyopt.usertype) {
        if (userdetails.userstores === '') {
          this.notification.create('error', '温馨提示', '门店用户必须选择门店!');
        } else {
          // this.distributioninfoService.updataUserDetail(psyopt)
          //     .then(tip => {
          //         this.tip = tip;
          //         alert(this.tip.msg);
          //         if (this.tip.code && this.tip.code === 'success') {
          //             this.getuserdetails(this.params);
          //             this.isVisible = false;
          //             this.isConfirmLoading = false;
          //         }

          //     });
          this.http.updataUserInfo.request(psyopt)
            .subscribe(tip => {
              this.tip = tip;
              this.notification.create('success', '温馨提示', this.tip.msg);
              if (this.tip.code && this.tip.code === 'success') {
                this.getuserdetails(this.params);
                this.isVisible = false;
                this.isConfirmLoading = false;
              }
            });
        }
      } else {
        this.notification.create('error', '温馨提示', '* 号为必填项!');
      }
    }

  }


  // 添加配送员页面 取消按钮
  handleCancel = () => {
    this.isVisible = false;
  }

  getents(): void {
    // this.distributioninfoService.getents()
    //     .then(ents => {
    //         this.ents = ents.data;

    //     });
    this.http.getentlist.request()
      .subscribe(ents => {
        this.ents = ents['data'];
      });
  }

  // 获取渠道
  getchannels(params): void {
    // this.distributioninfoService.getchannels(params)
    //     .then(channels => {
    //         // const tmp = [{ channel_keyword: 'all', name: '全部渠道', sfxz: false }].concat(channels.rows);
    //         this.channels = channels.rows;

    //     }
    //     );
    this.http.getchannelbyendid.request()
      .subscribe(channels => {
        this.channels = channels['rows'];
      });
  }
  // 接收翻页操作传过来的值，然后请求服务得到新数据
  childparams($event) {
    const childoption = $event;
    this.params.page_no = childoption.page_no;
    this.cow = (childoption.page_no - 1) * childoption.page_size;
    this.getuserdetails(childoption);
  }

  // 重置
  Reset() {


    this.params.search.code = '';
    this.params.search.name = '';
    this.params.search.status = '';
    this.params.search.region_code = '';
    // 清空门店信息
    // this.Child.clearshowtextvalue();
  }
  // 导出
  addexport() {
    let exportname = this.params.search.code;
    // userstores: any;
    // exportname = this.params.search.code;

    const parame = {
      'path': '/bsp/bspmddata/account/getuserinfos',
      'search': {},
      'desc': exportname + '配送员信息',
      'export_columns': [
        { 'name': '门店编号', 'key': 'userstores' },
        { 'name': '用户名', 'key': 'name' },
        { 'name': '账号', 'key': 'code' },
        { 'name': '账户状态', 'key': 'status' },
        { 'name': '联系电话', 'key': 'mobileNo' },
        { 'name': '创建时间', 'key': 'timestamp' }
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

  // 模态框显示
  showModal = () => {
    // this.getchannels();

    this.getStorelist();
    this.isVisible = true;
  }


  gotodetail(configopt) {

    this.showModal();
  }


  // 门店列表选择
  searchcode($event) {

    // let usarr = [
    //     {code:$event}
    // ]
    this.params.search.region_code = $event;




    // console.log(123456789)
    // console.log(this.searchcodename);
    // console.log(this.userdetails.userstores)

  }
  searchcodeagain($event) {
    console.log($event);
    const showselectarr = [];
    for (let i = 0; i < $event.length; i++) {
      showselectarr.push($event[i].code);
    }
    this.userdetails.userstores = showselectarr.join(',');

  }

  // gettextvalue($event) {
  //    console.log(this.searchcode)
  //    console.log(this.searchname)

  // }



  search(paramsoption) {
    paramsoption.page_no = 1;
    this.getuserdetails(paramsoption);
  }


  // 查询配送员列表
  getuserdetails(param) {

    this.cow = (param.page_no - 1) * param.page_size;
    // this.distributioninfoService.getuserdetails(param)
    //     .then(menu => {

    //         this.menuList = menu.rows;

    //         this.pageSize.count = menu.count;
    //         this.changecount = menu.count;
    //         // console.log(333)
    //         // console.log(this.menuList);

    //     });
    this.http.getuserinfos.request(param)
      .subscribe(menu => {
        this.menuList = menu['rows'];

        this.pageSize.count = menu['count'];
        this.changecount = menu['count'];
      });
  }

  // 修改配送员信息
  modifydistribut(params) {
    // console.log(params);

    // this.isVisible = true;
    this.modeltitle = '修改配送员信息';
    this.userdetails = null;
    this.userdetails = JSON.parse(JSON.stringify(params));
    this.userdetails.name = params.name;
    this.userdetails.channel_keyword = params.channel_keyword;
    this.userdetails.code = params.code;
    this.userdetails.mobileNo = params.mobileNo;
    this.userdetails.userstores = params.userstores[0];
    this.itemid = params._id;
    this.isshow = false;

    this.showModal();
  }
  // 停用配送员账户
  stopdistribut(parame) {
    if (parame.status === '1') {
      this.modalService.confirm({
        nzTitle: '温馨提示',
        nzContent: '你确定停用吗?',
        nzOnOk: () => {
          parame.status = '-1';
          let selectuser = [];
          selectuser.push(parame);
          // this.distributioninfoService.setstatus(selectuser)
          //     .then(tip => {
          //         this.tip = tip.msg;
          //         alert(this.tip);
          //         this.getuserdetails(this.params);
          //     });
          this.http.changeuserstatus.request(selectuser)
            .subscribe(tip => {
              this.tip = tip['msg'];
              this.notification.create('success', '温馨提示', this.tip);
              this.getuserdetails(this.params);
            });
        }
      });
    } else {
      this.modalService.confirm({
        nzTitle: '温馨提示',
        nzContent: '你确定启用吗?',
        nzOnOk: () => {
          parame.status = '1';
          let selectuser = [];
          selectuser.push(parame);
          this.http.changeuserstatus.request(selectuser)
            .subscribe(tip => {
              this.tip = tip['msg'];
              this.notification.create('success', '温馨提示', this.tip);
              this.getuserdetails(this.params);
            });
        }
      });

    }

  }
  // 控制密码显示隐藏
  changcepass() {
    if (this.checkpass === 'password') {
      // console.log(6666)
      this.checkpass = 'text';
    } else {
      this.checkpass = 'password';

    }

  }

  // 删除菜单
  deldist(params) {
    // if (confirm('你确定删除吗？')) {

    // this.distributioninfoService.deldist(params)
    // .then(menu => {
    //     if (menu.code === 'success') {
    //         alert('已删除');
    //         this.getuserdetails(this.params);
    //     }
    // });
    this.http.deleteUserInfo.request(params)
      .subscribe(menu => {
        if (menu['code'] === 'success') {
          this.notification.create('success', '温馨提示', '已删除');
          this.getuserdetails(this.params);
        }
      });

    // }

  }

  // 获取门店列表
  getStorelist() {
    this.http.getStorelist.request()
      .subscribe(stores => {
        this.stores = stores;
        this.allstores = this.stores;
      });
  }
  showConfirm(item): void {
    this.modalService.confirm({
      nzTitle: '<i>Do you Want to delete these items?</i>',
      nzContent: '<b>Some descriptions</b>',
      nzOnOk: () => this.deldist(item)
    });
  }

}

