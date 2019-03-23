import { Component, OnInit, } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
// import { PickerefficiencyService } from './pickerefficiency.service';
import { DatePipe } from '@angular/common';
import { Authbts, Whetherdisplay, GMTToStr } from './../../../validates/validates';
import { HttpService } from 'src/app/http/http.service';
import { NzNotificationService } from 'ng-zorro-antd';
@Component({
    templateUrl: './pickefficiency.html',
    styleUrls: ['./pickefficiency.less']
})
export class PickefficiencyComponent implements OnInit {
    // 请求参数
    params: any = {
        search: {
            pickername: '',
            startdate: '',
            enddate: '',
            region_code: ''
        },
        page_size: 20,
        page_no: 1
    };
    pageSize =
        {
            totalPage: 0,
            count: 0
        };
    cow = 0; // 序号
    changecount: any = 0;
    region_name: any;
    stores: any;
    _startDate = null;
    _endDate = null;
    results: Boolean = true;
    list: any = { };

    // selectedValue: any;
  constructor(private route: ActivatedRoute, private http: HttpService, private notification: NzNotificationService) {
    this.notification.config({
      nzPlacement: 'topRight'
    });
  }
    ngOnInit(): void {

        this.getStorelist();
        this._startDate = new Date(Date.now());
        this._endDate = new Date(Date.now());
        this.params.search.startdate = GMTToStr(this._startDate);
        this.params.search.enddate = GMTToStr(this._endDate);
        this.getsearchresults();
    }
    getsearchresults() {
        if (String(this.params.search.startdate).length === 10) {
            this.params.search.startdate = String(this.params.search.startdate) + ' 00:00:00';

        }
        if (String(this.params.search.enddate).length === 10) {
            this.params.search.enddate = String(this.params.search.enddate) + ' 23:59:59';

        }
        // console.log(params);

        this.http.getsearchresults.request()
            .subscribe(res => {
                // this.results = res.data;
                // this.pageSize.count = res.data.count;
                // this.changecount = res.data.count;
                // console.log(res);
                this.results = res['data'];
                this.pageSize.count = res['data'].count;
                this.changecount = res['data'].count;
                console.log(res);
            });
    }
    // 输入条件查询方法
    // search() {
    //     // paramsoption.page_no = 1;
    //     this.getsearchresults();
    // }
    Reset() {
        this._startDate = new Date(Date.now() - 3600 * 24 * 1000);
        this._endDate = new Date(Date.now() - 3600 * 24 * 1000);
        this.params.search.startdate = GMTToStr(this._startDate);
        this.params.search.enddate = GMTToStr(this._endDate);
        this.params.search.pickername = '';
        this.params.search.region_code = '';
        this.region_name = '';
    }
    // 接收翻页操作传过来的值，然后请求服务得到新数据
    childparams($event) {
        const childoption = $event;
        this.params.page_no = childoption.page_no;
        this.cow = (childoption.page_no - 1) * childoption.page_size;
        this.getsearchresults();
    }
    // 获取门店列表
    getStorelist() {
        this.http.getStorelist.request(this.list)
            .subscribe(stores => {
                // const tmp = [{ code: '', codename: '全部门店' }].concat(stores);
                // this.stores = tmp;
                // const tmp = { code: '', codename: '全部门店' };
                this.stores = stores;
                console.log(stores);
                // this.stores.push(tmp);
            });
    }
    // 门店列表选择
    searchcode($event) {
        this.params.search.region_code = $event;
    }
    // 门店列表选择显示编码加名称
    searchname($event) {
        this.region_name = $event;
    }


    startchange(event) {
        this._startDate = event;
        this.params.search.startdate = GMTToStr(event) + ' 00:00:00';
    }
    endchange(event) {
        this._endDate = event;
        this.params.search.enddate = GMTToStr(event) + ' 23:59:59';
    }

    // 导出
    addexport() {
        let datePipe = new DatePipe('en-US');
        let stime = new Date(datePipe.transform(this.params.search.startdate, 'yyyy-MM-dd'));
        let ntime = new Date(datePipe.transform(this.params.search.enddate, 'yyyy-MM-dd'));
        let days = (Date.parse(ntime.toDateString()) - Date.parse(stime.toDateString())) / 1000 / 60 / 60 / 24;
        if (days > 30) {
            this.notification.create('error', '温馨提示', '日期范围应在一个月之内');
            return false;
        } else {
            let exportname: any;
            let datePipe = new DatePipe('en-US');
            let start_date = datePipe.transform(this.params.search.startdate, 'yyyy-MM-dd 00:00:00');
            let end_date = datePipe.transform(this.params.search.enddate, 'yyyy-MM-dd 23:59:59');
            exportname = String(start_date).substr(0, 10) + '到' + String(end_date).substr(0, 10);
            console.log(exportname);
            let parame = {
                'path': '/test-api/order/v1/picktotal',
                'search': {},
                'desc': exportname + '拣货员效率',
                'sort': 'total',
                'sortDirKey': 'DESC',
                'export_columns': [
                    { 'name': '编号', 'key': 'code' },
                    { 'name': '姓名', 'key': 'name' },
                    { 'name': '拣货次数', 'key': 'all_count' },
                    { 'name': '拣货超时次数', 'key': 'over_count' },
                    { 'name': '超时次数占比', 'key': 'ratio' },
                    { 'name': '超时总时长', 'key': 'over_time' },
                    { 'name': '最长超时时长', 'key': 'max_time' },
                    { 'name': '平均超时时长', 'key': 'average_time' },
                    { 'name': '日期', 'key': 'summary_date' },
                    { 'name': '所属门店编码', 'key': 'region_code' },
                    { 'name': '所属门店名称', 'key': 'region_name' },
                    { 'name': '门店联系方式', 'key': 'phone' }
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
    }
}

