import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/http/http.service';
import { NGXLogger } from 'ngx-logger';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-memberinfo',
  templateUrl: './memberinfo.component.html',
  styleUrls: ['./memberinfo.component.less']
})
export class MemberinfoComponent implements OnInit {
  public params: any = {
    search: {},
    page_size: 50,
    page_no: 1,
    sort: 'timestamp',
    sortDirKey: 'DESC'
  };
  memberList: any;
  public pageSize: any =
    {
      totalPage: 0,
      count: 0
    };
  constructor(private router: Router, private logger: NGXLogger, private http: HttpService) {

  }

  public queryList = new Array();

  ngOnInit() {
    this.queryList = [
      {
        show: true,
        type: "input",
        label: "用户名",
        name: "name",
        value: ''
      },
      {
        show: true,
        type: "input",
        label: "账号",
        name: "code",
        value: ''
      },
      {
        show: true,
        type: "select",
        importent: "true",
        label: "门店",
        name: "org_code",
        search: true,
        list: this.getSelection('org_code')
      },
      {
        show: true,
        type: "input",
        label: "商品编码",
        name: "item_code",
        value: ''
      },
      {
        show: true,
        type: "select",
        label: "用户状态",
        name: "status",
        code: "",
        list: [
          {
            name: "请选择",
            code: ""
          },
          {
            name: "售卖",
            code: "1"
          },
          {
            name: "停售",
            code: "-1"
          },
        ],
      },
      {
        show: true,
        type: "select",
        label: "在线状态",
        name: "is_online",
        code: "",
        list: [
          {
            name: "请选择",
            code: ""
          },
          {
            name: "上班",
            code: "1"
          },
          {
            name: "休息",
            code: "0"
          },
        ],
      }

    ];
  }

  // 获取下拉列表
  getSelection(name) {
    // 获取门店信息
    this.http.getStorelist.request({})
      .subscribe((data) => {
        this.queryList.forEach((item) => {
          if (item.name === name) {
            item.list = JSON.parse(JSON.stringify(data)).map((item1, index) => {
              let obj = {
                code: item1.code,
                name: item1.codename
              };
              return obj;
            });
          }
        });
        console.log(this.queryList);
      });
  }

  // 获取所有查询条件
  search($event) {
    console.log($event);
    this.params.search = $event;
    this.getOrderPickers();
  }

  // 列表
  getOrderPickers() {
    this.http.getOrderPickers.request(this.params)
      .subscribe(data => {
        this.logger.log(data);
        this.pageSize.count = data['count'];
        this.memberList = data['rows'];

      });
  }
  // 新增
  newMember() {
    this.router.navigate(['/pages/picking/memberinfo/addmemberinfo']);
  }

  // 修改拣货员信息
  updInfo(item) {
    console.log(item);
    this.router.navigate(['/pages/picking/memberinfo/addmemberinfo', { parme: JSON.stringify(item) }]);
  }

  // 接收翻页操作传过来的值，然后请求服务得到新数据
  childparams($event) {
    const childoption = $event;
    this.params.page_no = childoption.page_no;
    this.getOrderPickers();

  }




}
