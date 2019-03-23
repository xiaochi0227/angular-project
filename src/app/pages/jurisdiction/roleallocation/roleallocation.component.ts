import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/http/http.service';
import { Router } from '@angular/router';
import { NzNotificationService, NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'app-roleallocation',
  templateUrl: './roleallocation.component.html',
  styleUrls: ['./roleallocation.component.less']
})
export class RoleallocationComponent implements OnInit {
  params: any = {
    search: {},
    page_size: 50,
    page_no: 1,
    sort: 'timestamp',
    sortDirKey: 'desc'
  };
  // 请求参数
  getmenuparams: any = {
    search: {},
    page_size: 50,
    page_no: 1,
    sort: 'timestamp',
    sortDirKey: 'desc'
  };
  roleList: any[];
  item: any;
  totaldiv: boolean = false;
  navList: any[];
  rolemenuinfo: any = [];

  constructor(private router: Router, private http: HttpService, private notification: NzNotificationService, private modalService: NzModalService) {
    this.notification.config({
      nzPlacement: 'topRight'
    });
  }

  // 跳转到添加角色页面
  gotoaddrole() {
    this.router.navigate(['/pages/jurisdiction/addrole']);
  }

  // 获取角色列表
  getRoleList() {
    this.http.roleList.request(this.params).subscribe(role => {
      this.roleList = role['rows'];
    });
  }

  // 按钮分组
  groupings(powerbtns) {
    let map = {};
    let btns = [];
    //  根据btncode分组 显示
    for (let b = 0; b < powerbtns.length; b++) {
      let ai = powerbtns[b];
      if (!map[ai.btncode]) {
        btns.push({
          btncode: ai.btncode,
          groupings: [ai]
        });
        map[ai.btncode] = ai;
      } else {
        for (let h = 0; h < btns.length; h++) {
          let dj = btns[h];
          if (dj.btncode === ai.btncode) {
            dj.groupings.push(ai);
            break;
          }
        }
      }
    }
    return btns;
  }

  // 查询菜单列表
  getMenuInfo() {
    let map = {};
    let btns = [];
    this.http.getQYMenuInfo.request({})
      .subscribe(menu => {
        let a = menu[0].rolemenuinfo
        this.navList = menu[0].rolemenuinfo;
        if (this.navList.length !== 0) {
          for (let i = 0; i < this.navList.length; i++) {
            this.navList[i].sfxz = false;
            for (let j = 0; j < this.navList[i].List.length; j++) {
              this.navList[i].List[j].sfxz = false;
              for (let k = 0; k < this.navList[i].List[j].powerbtn.length; k++) {
                if (!this.navList[i].List[j].powerbtn[0].groupings) { // 判断是否分组
                  this.navList[i].List[j].powerbtn = this.groupings(this.navList[i].List[j].powerbtn);
                }
                for (let l = 0; l < this.navList[i].List[j].powerbtn[k].groupings.length; l++) {
                  this.navList[i].List[j].powerbtn[k].groupings[l].sfxz = false;
                }
              }

            }
          }
        }
      });

  }

  // 选中
  getSelected(event, items, i) {
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
  // 确认权限
  btnAffirm() {
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

    let updparams = [
      { ID: this.params.ID },
      {
        $set: {
          rolemenuinfo: JSON.stringify(this.rolemenuinfo)
        }
      }]
    // 修改权限
    this.updateLlocation(updparams);

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

  // 修改权限
  updateLlocation(params) {
    this.http.updateRole.request(params).subscribe(role => {
      if (role === 1) {
        this.notification.create('success', '温馨提示', '已重新分配');
        this.getRoleList();
        this.getMenuInfo();
      }
    })

  }


  // 分配权限
  showModel(items) {
    let n = 0;
    let n1 = 0;
    let n2 = 0;
    let n3 = 0;
    let n4 = 0;
    for (let i = 0; i < this.navList.length; i++) {
      if (n < items.rolemenuinfo.length) {
        // 判断是否分配父菜单权限 是就选中
        if (this.navList[i].ID === items.rolemenuinfo[n].ID) {
          this.navList[i].sfxz = true
          for (let j = 0; j < this.navList[i].List.length; j++) {
            if (n1 < items.rolemenuinfo[n].List.length) {
              //   判断是否分配子菜单权限 是就选中
              if (this.navList[i].List[j].ID === items.rolemenuinfo[n].List[n1].ID) {
                this.navList[i].List[j].sfxz = true;
                if (items.rolemenuinfo[n].List[n1].powerbtn) {
                  for (let b = 0; b < this.navList[i].List[j].powerbtn.length; b++) {
                    // 判断是否分配子菜单下按钮权限 是就选中
                    if (n3 < items.rolemenuinfo[n].List[n1].powerbtn.length) {
                      for (let k = 0; k < this.navList[i].List[j].powerbtn[b].groupings.length; k++) {
                        if (items.rolemenuinfo[n].List[n1].powerbtn.length > 0) {
                          if (!items.rolemenuinfo[n].List[n1].powerbtn[0].groupings) { // 判断是否分组
                            items.rolemenuinfo[n].List[n1].powerbtn = this.groupings(items.rolemenuinfo[n].List[n1].powerbtn);
                          }
                        }

                        if (items.rolemenuinfo[n].List[n1].powerbtn[n3].groupings) {
                          if (n2 < items.rolemenuinfo[n].List[n1].powerbtn[n3].groupings.length) {
                            if (this.navList[i].List[j].powerbtn[b].groupings[k].btnname === items.rolemenuinfo[n].List[n1].powerbtn[n3].groupings[n2].btnname) {
                              this.navList[i].List[j].powerbtn[b].groupings[k].sfxz = true;
                              n2++;
                            } else {
                              this.navList[i].List[j].powerbtn[b].groupings[k].sfxz = false;
                            }
                          }
                        }
                      }
                    }

                    n2 = 0;
                    n3++;
                  }
                  n3 = 0;
                  n1++;
                }
              } else {
                this.navList[i].List[j].sfxz = false;
                for (let b = 0; b < this.navList[i].List[j].powerbtn.length; b++) {
                  for (let y = 0; y < this.navList[i].List[j].powerbtn[b].groupings.length; y++) {
                    this.navList[i].List[j].powerbtn[b].groupings[y].sfxz = false;
                  }
                }
              }
            }

          }
          n1 = 0;
          n++;

        } else {
          // 当父菜单没有选择是 取消父菜单下所有选中
          this.navList[i].sfxz = false;
          for (let s = 0; s < this.navList[i].List.length; s++) {
            this.navList[i].List[s].sfxz = false;
            for (let b = 0; b < this.navList[i].List[s].powerbtn.length; b++) {
              for (let y = 0; y < this.navList[i].List[s].powerbtn[b].groupings.length; y++) {
                this.navList[i].List[s].powerbtn[b].groupings[y].sfxz = false;
              }
            }
          }
        }
      } else {
        this.navList[i].sfxz = false;
        for (let s = 0; s < this.navList[i].List.length; s++) {
          this.navList[i].List[s].sfxz = false;
          for (let b = 0; b < this.navList[i].List[s].powerbtn.length; b++) {
            for (let y = 0; y < this.navList[i].List[s].powerbtn[b].groupings.length; y++) {
              this.navList[i].List[s].powerbtn[b].groupings[y].sfxz = false;
            }
          }
        }
      }
    }

    this.params.ID = items.ID;
    this.totaldiv = true;
  }


  // 关闭弹出
  closediv() {
    this.totaldiv = false;
  }

  // 删除角色
  delRole(items) {
    this.modalService.confirm({
      nzTitle: '温馨提示',
      nzContent: '你确定删除吗？删除后已分配用户权限将受影响',
      nzOnOk: () => {
        let params = {
          ID: items.ID
        };
        this.http.delRole.request(params).subscribe(role => {
          if (role === 1) {
            this.notification.create('error', '温馨提示', '已删除');
            this.getRoleList();
          }
        });
      }
    });

  }

  ngOnInit() {
    this.getRoleList();
    this.getMenuInfo();
  }

}
