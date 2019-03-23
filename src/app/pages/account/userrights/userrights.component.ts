import { Component, OnInit } from '@angular/core';
import { BaseParams } from 'src/app/models';
import { HttpService } from 'src/app/http/http.service';
import { Authbts, Whetherdisplay } from 'src/app/validates/validates';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NzMessageService, NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'app-userrights',
  templateUrl: './userrights.component.html',
  styleUrls: ['./userrights.component.less']
})
export class UserrightsComponent implements OnInit {
  constructor(private http: HttpService, private fb: FormBuilder, private message: NzMessageService, private notification: NzNotificationService) {
    this.notification.config({
      nzPlacement: 'topRight'
    });
  }
  addForm: FormGroup;
  params: BaseParams = {
    search: {
      code: '',
      name: '',
      usertype: '',
      status: ''
    },
    page_size: 10,
    page_no: 1,
    sort: 'code',
    sortDirKey: 'DESC'
  };
  count = 0;
  cow: number;
  btns: any;
  zjbt = true;
  qybt = true;
  tybt = true;
  xgbt = true;
  ur: any;
  userrights: any;
  selecteduser = [];
  tip: any;
  isadd = false;
  userdetails: any = {
    code: '',
    name: '',
    password: '',
    status: '',
    mobileNo: '',
    usertype: '',
    userstores: '',
    rolecode: '',
    rolename: '',
    channel_keywords: []
  };
  roleList = [];
  channels = [];
  rolearray: [{ name: string, value: string }];
  isVisible = false;
  storelist = [];
  isOkLoading = false;
  loading = false;
  editinguser: any;
  ngOnInit(): void {
    this.addForm = this.fb.group({
      code: [null, [Validators.required]],
      name: [null, [Validators.required]],
      password: [null, [Validators.required]],
      status: [null, [Validators.required]],
      mobileNo: [{ value: '', disabled: true }],
      usertype: [null, [Validators.required]],
      rolecode: [[], [Validators.required]],
      channel_keywords: [[]],
      rolename: [''],
    });
    const localuser = window.localStorage.getItem('userinfo');
    this.ur = JSON.parse(localuser);
    this.btns = Authbts('账号设置', '用户账号设置');
    // console.log(this.btns);
    this.zjbt = Whetherdisplay(this.btns, '新增');
    this.qybt = Whetherdisplay(this.btns, '启用');
    this.tybt = Whetherdisplay(this.btns, '停用');
    this.xgbt = Whetherdisplay(this.btns, '修改');
    this.getuserlist();
  }
  // 输入条件查询方法
  search() {
    this.params.page_no = 1;
    this.getuserlist();
  }

  // 获取列表
  getuserlist() {
    this.cow = (this.params.page_no - 1) * this.params.page_size;
    this.http.getuserinfos.request<any>(this.params)
      .subscribe(userrights => {
        this.userrights = userrights.rows;
        this.count = userrights.count;
      });
  }
  gotoadduser() {
    this.getRoleList();
    this.getchannels();
    this.isVisible = true;
    this.isadd = true;
  }

  gotoedituser(code) {
    if (this.roleList.length === 0 || this.storelist.length === 0) {
      this.getRoleList();
      this.getStores();
      this.getchannels();
    }
    this.http.edituserinfo.request<any>({ code: code }).subscribe(user => {
      this.editinguser = user;
      this.addForm.get('code').setValue(user.code);
      this.addForm.get('name').setValue(user.name);
      this.addForm.get('password').setValue(user.password);
      this.addForm.get('status').setValue(user.status);
      this.addForm.get('mobileNo').setValue(user.mobileNo);
      this.addForm.get('usertype').setValue(user.usertype);
      this.addForm.get('userstores').setValue(user.userstores);
      this.addForm.get('rolecode').setValue(user.rolecode);
      this.addForm.get('rolename').setValue(user.rolename);
      this.addForm.get('channel_keywords').setValue(user.channel_keywords);
      this.isVisible = true;
    });
  }

  setcheckbox(userright) {
    if (userright.code === this.ur.code) {
      userright.sfxz = true;
    }
    if (userright.sfxz) {
      userright.sfxz = false;
      this.selectRow(userright);
    } else {
      userright.sfxz = true;
      this.selectRow(userright);
    }
  }

  selectRow(userright: any) {
    const selected = userright.sfxz;
    if (selected) {
      let isbh = false;
      for (let i = 0; i < this.selecteduser.length; i++) {
        const code = userright.code;
        const tempcode = this.selecteduser[i].code;
        if (code === tempcode) {
          isbh = true;
          break;
        }
      }
      if (!isbh) {
        this.selecteduser.push(userright);
      }
    } else {
      for (let i = 0; i < this.selecteduser.length; i++) {
        const code = userright.code;
        const tempcode = this.selecteduser[i].code;
        if (code === tempcode) {
          this.selecteduser.splice(i, 1);
          break;
        }
      }
    }
  }

  enabled() {
    if (this.selecteduser.length >= 1) {
      for (let i = 0; i < this.selecteduser.length; i++) {
        this.selecteduser[i].status = '1';
      }
      this.http.changeuserstatus.request<any>(this.selecteduser)
        .subscribe(tip => {
          // this.tip = tip.msg;
          this.message.create('success', tip.msg);
          // alert(this.tip);
          this.getuserlist();
        });
    } else {
      this.notification.create('warning', '温馨提示', '请至少选择一条记录操作！');
    }
  }

  disabled() {
    if (this.selecteduser.length >= 1) {
      for (let i = 0; i < this.selecteduser.length; i++) {
        this.selecteduser[i].status = '-1';
      }
      this.http.changeuserstatus.request<any>(this.selecteduser)
        .subscribe(tip => {
          // this.tip = tip.msg;
          // alert(this.tip);
          this.message.create('success', tip.msg);
          this.getuserlist();
        });
    } else {
      this.notification.create('warning', '温馨提示', '请至少选择一条记录操作！');
    }

  }

  Reset() {
    this.params.search.code = '';
    this.params.search.name = '';
    this.params.search.usertype = '';
    this.params.search.status = '';
    this.params.search.mobileNo = '';
  }

  addexport() {
    const parame = {
      'path': '/bsp/bspmddata/account/getuserinfos',
      'search': {
        mobileNo: '',
        code: '',
        name: '',
        usertype: '',
        status: '',
      },
      sort: this.params.sort,
      sortDirKey: this.params.sortDirKey,
      'desc': '用户账号设置',
      'export_columns': [
        { 'name': '用户名', 'key': 'code' },
        { 'name': '姓名', 'key': 'name' },
        { 'name': '状态', 'key': 'status_name' },
        { 'name': '手机号', 'key': 'mobileNo' },
        { 'name': '用户类型', 'key': 'usertype_name' },
        { 'name': '管理门店', 'key': 'userstores_name' },
      ]
    };
    parame.search.mobileNo = this.params.search.mobileNo;
    parame.search.code = this.params.search.code;
    parame.search.name = this.params.search.name;
    parame.search.usertype = this.params.search.usertype;
    parame.search.status = this.params.search.status;
    this.http.addexport.request<any>(parame)
      .subscribe(row => {
        if (row) {
          this.message.create('success', row.msg);
        } else {
          this.notification.create('warning', '温馨提示', '添加失败,请重试！');
        }
      });
  }

  // 查询角色
  getRoleList() {
    if (this.roleList && this.roleList.length > 0) {
      return;
    }
    this.http.roleList.request<any>(this.params).subscribe(role => {
      if (role && role.rows && role.rows.length > 0) {
        const rolelist = [];
        role.rows.forEach(r => {
          if (r && r.ID && r.rolename && r.rolename !== 'admin') {
            rolelist.push({ name: r.rolename, value: r.ID });
          }
        });
        this.roleList = rolelist;
      }
    });
  }
  // 获取渠道
  getchannels(): void {
    if (this.channels && this.channels.length > 0) {
      return;
    }
    this.http.getChannels.request<any>().subscribe(channels => {
      this.channels = channels.rows;
    });
  }

  // 获取门店
  getStores(): void {
    this.http.getStorelist.request<any>({}).subscribe(sl => {
      this.storelist = sl;
    });
  }

  hidemodal() {
    this.addForm.removeControl('userstores');
    this.isVisible = false;
    this.isadd = false;
    this.addForm.reset();
  }
  submit() {
    this.validateAddForm();
    this.isOkLoading = true;
    const formvalue = this.addForm.value;
    const us: string[] = formvalue.userstores;

    // 调整数据结构和老api一致，接口设计比较差
    if (us && us.length > 0) {
      const nus = us.join(',');
      formvalue.userstores = [{ code: nus }];
    }
    const rolenameArray = [];
    const roleids: string = formvalue.rolecode.join(',');
    this.roleList.forEach(r => {
      if (roleids.indexOf(r.value) >= 0) {
        rolenameArray.push(r.name);
      }
    });
    formvalue.rolename = rolenameArray.join(',');
    const channels: string = formvalue.channel_keywords.join(',');
    const cs = [];
    this.channels.forEach(c => {
      if (channels.indexOf(c.channel_keyword) >= 0) {
        c.sfxz = true;
        cs.push(c);
      }
    });
    formvalue.channel_keywords = cs;
    let postvalue: any;
    if (this.isadd) {
      postvalue = formvalue;
    } else {
      for (const key in formvalue) {
        if (formvalue.hasOwnProperty(key)) {
          this.editinguser[key] = formvalue[key];
        }
      }
      postvalue = this.editinguser;
    }
    this.http.saveuserinfos.request<any>(postvalue).subscribe(m => {
      this.isOkLoading = false;
      if (m && m.msg) {
        this.message.create('success', m.msg);
      }
      this.isVisible = false;
    });
  }
  validateAddForm(): void {
    for (const i in this.addForm.controls) {
      if (this.addForm.controls.hasOwnProperty(i)) {
        this.addForm.controls[i].markAsDirty();
        this.addForm.controls[i].updateValueAndValidity();
      }
    }
  }
  changeUserType(event) {
    if (!event) {
      return;
    }
    if (event === '3' || event === '-20000') {
      this.addForm.addControl('userstores', new FormControl([], Validators.required));
      if (this.storelist.length === 0) {
        this.getStores();
      }
    } else {
      this.addForm.removeControl('userstores');
    }
  }
  removeboundr() {
    this.http.removeboundr.request<any>(this.editinguser).subscribe(t => {
      this.message.create('success', t.msg);
    });
  }
}
