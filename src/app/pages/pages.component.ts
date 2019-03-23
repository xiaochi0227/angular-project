import { Component, OnInit, Injector, ViewChild, ElementRef } from '@angular/core';
import { HttpService } from '../http/http.service';
import { whitelogo } from '../images';
import { NGXLogger } from 'ngx-logger';
import { Router, ActivatedRoute } from '@angular/router';
import { Userinfo } from '../models';
import { Utils } from '../utils/utils';
import { Subscription } from 'rxjs';
import { BreadcrumbService } from 'src/app/services/breadcrumb.service';
@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.less'],

})

export class PagesComponent implements OnInit {
  whitelogo: String = whitelogo;
  isCollapsed = false;
  menus: Array<string>;
  userinfo: Userinfo;
  getbreadcrumbobj = [];
  subscription = new Subscription;
  @ViewChild("content") content: ElementRef;

  constructor(public router: Router, private http: HttpService, private logger: NGXLogger, private breadcrumbService: BreadcrumbService) {
    this.subscription = this.breadcrumbService.getMessage()
      .subscribe((msg) => {
        console.log(msg);
        if (msg.message == 0) {
          this.getbreadcrumbobj = JSON.parse(localStorage.getItem("breadCrumb"));
        } else {
          this.getbreadcrumbobj = JSON.parse(localStorage.getItem("breadCrumb"));
          msg.message.forEach(item => {
            this.getbreadcrumbobj.push(item);
          })


        }
        this.getbreadcrumbobj = this.unique(this.getbreadcrumbobj);

      });
  }

  ngOnInit() {
    if (localStorage.getItem("breadCrumb")) {
      this.getbreadcrumbobj = JSON.parse(localStorage.getItem("breadCrumb"));
    };
    console.log(this.getbreadcrumbobj);
    this.userinfo = Utils.getUserInfo();
    this.http.apiMenus.request()
      .subscribe(api => {
        api['data'].sort(function (x, y) {
          if (Number(x.menucode) < Number(y.menucode)) {
            return -1;
          }
          if (Number(x.menucode) > Number(y.menucode)) {
            return 1;
          }
          return 0;
        });
        api['data'].forEach(element => {
          if (!element.icon) {
            element.icon = 'folder';
          }
        });
        this.menus = api['data'];
        window.localStorage.setItem('menus', JSON.stringify(api['data']));

      }, err => {
        this.logger.error(err.message);
      });
  }
  loginout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
  getbreadcrumbvalue(menu, menuitem) {
    this.getbreadcrumbobj = [
      {
        name: menu.menuname
      },
      {
        name: menuitem.menuname,
        url: menuitem.menuurl
      }
    ];
    // 为了避免刷新的时候,页面的面包屑是空的
    localStorage.setItem("breadCrumb", JSON.stringify(this.getbreadcrumbobj));

  }

  unique(arr) {
    let result = [], i, j, len = arr.length;
    for (i = 0; i < len; i++) {
      for (j = i + 1; j < len; j++) {
        if (arr[i]['name'] === arr[j]['name']) {
          j = ++i;
        }
      }
      result.push(arr[i]);
    }
    return result;
  }







}
