
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { HttpService } from 'src/app/http/http.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { SearchBarComponent } from 'src/app/sharecomponets/search-bar/search-bar.component';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'app-evaluationlist',
  templateUrl: './evaluationlist.component.html',
  styleUrls: ['./evaluationlist.component.less']
})
export class EvaluationlistComponent implements OnInit {
  public pageIndex = 1;
  public queryList = new Array();
  public storelist: any; // 门店列表
  public initStorelist: any;
  public channels: any; // 渠道列表
  public initchannels: any;
  public exclude_pos_money_desc: any; // tip 描述
  public statements: any; // 页面列表数据
  public hzobj: any; // 商品信息
  public types = 0;
  public evaluations = new Array();
  public params: any = {
    search: {},
    page_size: 20,
    page_no: 1,
  };
  memberList: any;
  searchStart: any;
  public pageSize: any =
    {
      totalPage: 0,
      count: 0
    };
  @ViewChild('searchbar') searchbar: SearchBarComponent;
  constructor(private http: HttpService, private modalService: NzModalService, private notification: NzNotificationService) {
    this.notification.config({
      nzPlacement: 'topRight'
    });
  }

  closeModel() {
  }
  ngOnInit() {
    this.queryList = [
      {
        show: true,
        type: "select",
        label: "门店",
        name: "region_code",
        search: true,
        code: "",
        list: this.getSelection('region_code')
      },
      {
        show: true,
        type: "select",
        label: "渠道",
        name: "channel_keyword",
        code: "",
        list: this.getSelection('channel')
      },
      {
        show: true,
        type: "input",
        label: "渠道订单号",
        name: "channel_sheetno",
        value: ''
      },
      {
        show: true,
        type: "date-picker",
        label: "选择日期",
        name1: "start_time",
        name2: "end_time",
        value: [new Date(Date.now() - 3600 * 48 * 1000), new Date(Date.now() - 3600 * 24 * 1000)],
        value1: "",
        value2: ""
      },
      {
        show: true,
        type: "radio",
        label: "回复情况",
        name: "reply_state",
        code: "",
        list: [
          {
            name: "全部",
            code: ""
          },
          {
            name: "未回复",
            code: "2"
          },
          {
            name: "已回复",
            code: "1"
          }
        ],
      },
      {
        show: true,
        type: "radio",
        label: "满意程度",
        name: "grade",
        code: "",
        list: [
          {
            name: "全部",
            code: ""
          },
          {
            name: "好评",
            code: "0"
          },
          {
            name: "中评",
            code: "1"
          },
          {
            name: "差评",
            code: "2"
          }
        ],
      },
      {
        show: true,
        type: "radio",
        label: "评价内容",
        name: "evaluationContent",
        code: "",
        list: [
          {
            name: "全部",
            code: ""
          },
          {
            name: "有内容",
            code: "1"
          },
          {
            name: "无内容",
            code: "2"
          }
        ],
      },

    ];
  }
  // 获取下拉列表
  getSelection(name, parentCode = null) {
    // 避免经营渠道,已上线渠道，活动渠道多次请求
    switch (name) {
      case 'region_code':
        // 获取门店信息
        this.http.getStorelist.request({})
          .subscribe((data) => {
            if (data['code'] === '0' && data['data']) {
              this.initStorelist = data['data'];
              this.storelist = JSON.parse(JSON.stringify(data['data']));
              this.queryList.forEach((item) => {
                if (item.name === name) {
                  item.list = JSON.parse(JSON.stringify(data['data'])).map((item1, index) => {
                    let obj = {
                      code: item1.code,
                      name: item1.codename
                    };
                    return obj;
                  });
                  item.list.unshift({
                    code: "",
                    name: "全部门店"
                  });
                }
              });
            }

          });
        break;
      case 'channel':
        // 获取渠道
        this.http.getChannels.request({})
          .subscribe((data) => {
            if (data['code'] === '0' && data['data']) {
              this.channels = data['rows'];
              this.initchannels = JSON.parse(JSON.stringify(data['data']['rows']));

              this.queryList.forEach((item) => {
                if (item.name === name) {
                  item.list = data['data']['rows'].map((item1) => {
                    let obj = {
                      code: item1.channel_keyword,
                      name: item1.name
                    };
                    return obj;
                  });
                  item.list.push({
                    code: "",
                    name: "请选择渠道"
                  });
                }
              });
            }

          });
        break;
    }
    // this.getbillorderconfig();




  }
  // 获取所有查询条件
  search($event) {
    console.log(this.queryList);
    for (const key in $event) {
      if ($event.hasOwnProperty(key)) {
        this.params.search[key] = $event[key];
      }
    }
    this.getevaluations();
  }

  // 接收翻页操作传过来的值，然后请求服务得到新数据
  childparams($event) {
    const childoption = $event;
    this.params.page_no = childoption.page_no;
    this.getevaluations();

  }

  // 回复评价
  writereply(item, showModal: TemplateRef<{}>) {
    let modal: NzModalRef = this.modalService.create({
      nzTitle: '回复评价',
      nzContent: showModal,
      nzOnOk: () => {
        return new Promise((resolve, reject) => {
          let params = {
            "channel_sheetno": item.channel_sheetno,
            "conlent": showModal['replyText'],
            "evaluat_sheetno": item.evaluat_sheetno,
            "channel_keyword": item.channel_keyword
          };
          this.http.replyEvaluation.request(params)
            .subscribe(data => {
              if (data['code'] === '0') {
                resolve(true);
              } else {
                this.notification.create('error', '温馨提示', data['msg']);
              }
            });
        });
      },
      nzOnCancel: () => { showModal['replyText'] = ""; modal.destroy(); }
    });

  }


  getevaluations() {
    this.http.getEvaluations.request(this.params)
      .subscribe(res => {
        // test 因为没有数据用假数据
        if (res['code'] === '0' && res['data']) {
          this.evaluations = res['data']['rows'];
          this.pageSize.count = res['data']['count'];
        }


      });
  }

  // 导出
  addexport() {
    let exportname = this.params.search.region_code + this.params.search.start_time + this.params.search.end_time + this.params.search.channel_keyword;

    const days = (new Date(this.params.search.end_time).getTime() - new Date(this.params.search.start_time).getTime()) / 1000 / 60 / 60 / 24;

    if (days > 30) {
      this.notification.create('warning', '温馨提示', '导出最多支持30天之内的数据!');
      return false;
    } else {
      const parame = {
        'path': '/bsp/bspreport/reportexport/getevaluations',
        'search': {
          reply_state: '',
          channel_keyword: '',
          region_code: '',
          start_time: '',
          end_time: '',
          grade: '',
          evaluationContent: ''
        },
        'desc': exportname + '评价管理',
        'export_columns': [
          { 'name': '门店名称', 'key': 'region_name' },
          { 'name': '门店编码', 'key': 'region_code' },
          { 'name': '渠道', 'key': 'channel_keyword' },
          { 'name': '渠道订单号', 'key': 'channel_sheetno' },
          { 'name': '子评价号', 'key': 'evaluat_sheetno' },
          { 'name': '时间', 'key': 'establish_time' },
          { 'name': '评论星级', 'key': 'sj_score' },
          { 'name': '评论内容', 'key': 'sj_content' },
          { 'name': '商家回复', 'key': 'sj_reply' },
          { 'name': '评分标签', 'key': 'sj_tags' },
          { 'name': '赞', 'key': 'WaresEvaluates.goodEvaluate' },
          { 'name': '踩', 'key': 'WaresEvaluates.badEvaluate' }
        ]

      };
      if (this.params.search.start_time !== '' && this.params.search.end_time !== '') {
        parame.search = this.params.search;
        this.http.addexport.request(parame)
          .subscribe(data => {
            console.log(data);
            this.notification.create('success', '温馨提示', data['msg']);
          });
      } else {
        this.notification.create('error', '温馨提示', ' 导出需要选择日期! ');
      }
    }
  }

  getdate(i) {
    this.types = i;
    this.params.page_no = 1;
    const datePipe = new DatePipe('en-US');
    const newDate = new Date;
    let preDate, preDate1;
    if (i === 1) {
      preDate = newDate.setDate(newDate.getDate());
      preDate1 = newDate.setDate(newDate.getDate() - 6);
    }
    if (i === 2) {
      preDate = newDate.setMonth(newDate.getMonth());
      preDate1 = newDate.setMonth(newDate.getMonth() - 1);
    }
    if (i === 3) {
      preDate = newDate.setMonth(newDate.getMonth());
      preDate1 = newDate.setMonth(newDate.getMonth() - 3);
    }
    this.queryList.forEach((item) => {
      if (item.name1 === 'start_time') {
        item.value = [new Date(preDate1), new Date(preDate)];
      }
    });
    this.searchbar.search();

  }




}
