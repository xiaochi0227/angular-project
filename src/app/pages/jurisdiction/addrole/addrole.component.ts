import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { HttpService } from 'src/app/http/http.service';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'app-addrole',
  templateUrl: './addrole.component.html',
  styleUrls: ['./addrole.component.less']
})
export class AddroleComponent implements OnInit {
  item: any;
  totaldiv: boolean = false;
  navList: any;
  rolemenuinfo: any = [];
  // 添加参数
  params: any = {
    rolename: '',
    rolecode: '',
    rolemenuinfo: [],
    ent_id: '',
    remarks: '',
    timestamp: ''
  };
  maxrolecode: any;
  // 查询请求参数
  getmenuparams = {
    search: {},
    page_size: 50,
    page_no: 1,
    sort: 'timestamp',
    sortDirKey: 'desc'
  };

  validateForm: FormGroup;

  constructor(private router: Router, private http: HttpService, private fb: FormBuilder, private notification: NzNotificationService) {
    this.notification.config({
      nzPlacement: 'topRight'
    });
  }

  // 跳转到角色页面
  gotoList() {
    this.router.navigate(['/pages/jurisdiction/roleallocation']);
  }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(i)) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }
    if (this.validateForm.valid) {
      this.params.rolemenuinfo = JSON.stringify(this.rolemenuinfo);
      this.http.insertRole.request(this.params).subscribe(menu => {
        if (menu === 1) {
          this.notification.create('success', '温馨提示', '添加成功');
          this.router.navigate(['/pages/jurisdiction/roleallocation']);
        } else {
          this.notification.create('error', '温馨提示', '添加失败');
        }
      });

    }
  }

  // 查询菜单列表
  getMenuInfo(params) {
    let map = {};
    let btns = [];
    this.http.getQYMenuInfo.request({}).subscribe(menu => {
        this.navList = menu[0].rolemenuinfo;
        for (let i = 0; i < this.navList.length; i++) {
          this.navList[i].sfxz = false;
          for (let j = 0; j < this.navList[i].List.length; j++) {
            this.navList[i].List[j].sfxz = false;
            if (this.navList[i].List.length !== 0) {
              for (let k = 0; k < this.navList[i].List[j].powerbtn.length; k++) {
                for (let l = 0; l < this.navList[i].List[j].powerbtn[k].groupings.length; l++) {
                  this.navList[i].List[j].powerbtn[k].groupings[l].sfxz = false;
                }
              }
            }

          }
        }

      });

    console.log(this.navList);

  }

  // 查询角色列表
  getRoleList(params) {
    this.http.roleList.request(params).subscribe(role => {
      this.maxrolecode = role['count'];
      this.params.rolecode = (parseInt(this.maxrolecode) + 10000).toString();

    });
  }

  // 确认权限
  distribution: any;
  btnAffirm() {
    this.params.distribution = '已分配';
    this.rolemenuinfo = [];
    let menulist = JSON.parse(JSON.stringify(this.navList));
    let n = 0;
    let n1 = 0;
    for (let i = 0; i < menulist.length; i++) {
      if (menulist[i].sfxz) {  // 验证父菜单是否选择
        this.rolemenuinfo.push(JSON.parse(JSON.stringify(menulist[i])));
        this.rolemenuinfo[n].List = [];
        for (let j = 0; j < menulist[i].List.length; j++) {
          if (menulist[i].List[j].sfxz) {  // 验证子菜单是否选择
            this.rolemenuinfo[n].List.push(JSON.parse(JSON.stringify(menulist[i].List[j])));
            for (let b = 0; b < menulist[i].List[j].powerbtn.length; b++) {
              this.rolemenuinfo[n].List[n1].powerbtn[b].groupings = [];
              for (let k = 0; k < menulist[i].List[j].powerbtn[b].groupings.length; k++) {
                if (menulist[i].List[j].powerbtn[b].groupings[k].sfxz) {  // 验证子菜单下面的按钮是否选择
                  this.rolemenuinfo[n].List[n1].powerbtn[b].groupings.push(menulist[i].List[j].powerbtn[b].groupings[k]);
                }
              }
            }
            n1++;
          }
        }
        n1 = 0;
        n++;
      }
    }

    this.totaldiv = false;

  }

  // checkbox 单选
  xzCheck(item, i, j) {
    this.navList[i].sfxz = true;
    this.navList[i].List[j].sfxz = true;
    if (item.sfxz) {
      item.sfxz = false;
    } else {
      item.sfxz = true;
    }
  }

  // 父菜单选中
  getSelected(event, items) {
    let isChecked = event.currentTarget.checked;
    if (isChecked) {
      // 父菜单选中
      items.sfxz = true;
      if (items.List) {
        for (let j = 0; j < items.List.length; j++) {
          items.List[j].sfxz = true;
          for (let b = 0; b < items.List[j].powerbtn.length; b++) {
            for (let k = 0; k < items.List[j].powerbtn[b].groupings.length; k++) {
              items.List[j].powerbtn[b].groupings[k].sfxz = true;
            }
          }
        }
      }
    } else {
      items.sfxz = false;
      if (items.List.length > 0) {
        for (let j = 0; j < items.List.length; j++) {
          items.List[j].sfxz = false;
          for (let b = 0; b < items.List[j].powerbtn.length; b++) {
            for (let k = 0; k < items.List[j].powerbtn[b].groupings.length; k++) {
              items.List[j].powerbtn[b].groupings[k].sfxz = false;
            }
          }
        }
      }
    }

  }
  // 子菜单选中
  getSelected1(event, items, i) {
    this.navList[i].sfxz = true;
    let isChecked = event.currentTarget.checked;
    if (isChecked) {
      this.navList[i].sfxz = true;
      items.sfxz = true;
      if (items.powerbtn) {
        for (let b = 0; b < items.powerbtn.length; b++) {
          for (let k = 0; k < items.powerbtn[b].groupings.length; k++) {
            items.powerbtn[b].groupings[k].sfxz = true;
          }
        }
      }

    } else {
      items.sfxz = false;
      if (items.powerbtn) {
        for (let b = 0; b < items.powerbtn.length; b++) {
          for (let k = 0; k < items.powerbtn[b].groupings.length; k++) {
            items.powerbtn[b].groupings[k].sfxz = false;
          }
        }
      }
      let istf: boolean = false;
      for (let k = 0; k < this.navList[i].List.length; k++) {
        if (this.navList[i].List[k].sfxz) {
          istf = true;
        }
        this.navList[i].sfxz = istf;
      }
    }
  }

  // 分配权限
  showModel() {
    this.totaldiv = true;
  }
  // 展示
  isShow(event, i) {
    if (this.navList[i].zs) {
      this.navList[i].zs = false;
      event.target.value = '+';
    } else {
      this.navList[i].zs = true;
      event.target.value = '-';
    }

  }
  // 关闭弹出
  closediv() {
    for (let i = 0; i < this.navList.length; i++) {
      for (let j = 0; j < this.navList[i].List.length; j++) {
        this.navList[i].List[j].sfxz = false;

      }
    }
    this.totaldiv = false;
  }


  ngOnInit() {
    this.validateForm = this.fb.group({
      rolename: [null, [Validators.required]],
      distribution: [null, [Validators.required]],
      remarks: [null, []]
    });
    this.getMenuInfo(this.getmenuparams);
    this.getRoleList(this.getmenuparams);
  }

}
