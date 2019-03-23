import { Component, OnInit } from '@angular/core';
import { BaseParams } from '../../../utils/base.list.params';
import { HttpService } from '../../../http/http.service';
import { Authbts } from '../../../validates/validates';
import { NzNotificationService } from 'ng-zorro-antd';
import { NzModalRef, NzModalService } from 'ng-zorro-antd'; // 对话框


@Component({
    templateUrl: './willsellventory.html',
    styleUrls: ['./../freshinventory/freshinventory.less', './willsellventory.less']

})
export class WillsellventoryComponent implements OnInit {
    // 必卖商品列表
    willselllist: any = [];
    params: any = {
        search: {
            region_code: '',
            region_name: '',
            ltzero: '',
            channel_keyword: '',
            online_sup_code: '',
            online_cat_code: '',
        },
        page_no: 1,
        page_size: 50
    };
    public pageSize: any = {
        totalPage: 0,
        count: 0
    };

    // 必卖商品明细列表
    mdlists: any = [];
    par: any = {
        search: {
            region_code: '',
            region_name: '',
            item_code: '',
            item_name: '',
            barcode: ''
        },
        page_no: 1,
        page_size: 50
    };
    stockCount: any = {
        PageIndex: 1,
        Pagesize: 50,
        count: 0
    };

    stores: any;    // 门店


    constructor(private http: HttpService, private notification: NzNotificationService, private modalService: NzModalService) {
    }
    ngOnInit(): void {
        this.getStorelist();
        this.getWillsellstocks();
    }


    // 获取门店列表
    getStorelist() {
        this.http.getStorelist.request()
            .subscribe(res => {
                if (res['code'] === '0') {
                    this.stores = res['data'];
                }
            });
    }


    // 必卖商品列表
    getWillsellstocks() {
        this.http.getwillsellstocks .request(this.params)
            .subscribe(res => {
                if (res['code'] === '0') {
                    this.willselllist = res['data'].rows;
                    this.pageSize.count = res['data'].count;
                }
            });
    }


    // 必卖商品明细列表
    getWillsellstocksdetail() {
        this.par.page_no = this.stockCount.PageIndex;
        this.par.page_size = this.stockCount.Pagesize;
        this.http.getwillsellstocksdetail.request(this.par)
            .subscribe(res => {
                if (res['code'] === '0') {
                    this.mdlists = res['data'].rows;
                    this.stockCount.count = res['data'].count;
                }
            });
    }


    // 查询
    search(i) {
        switch (i) {
            case '1':
                this.params.page_no = 1;
                this.getWillsellstocks();
                break;

            default:
                this.stockCount.PageIndex = 1;
                this.stockCount.Pagesize = 50;
                this.getWillsellstocksdetail();
                break;
        }
    }


    // 重置按钮
    Reset(i) {
        switch (i) {
            case '1':
                this.params.search.region_code = '';
                break;

            default:
                break;
        }
    }


    // 接收翻页操作传过来的值，然后请求服务得到新数据
    childparams($event) {
        const childoption = $event;
        this.params.page_no = childoption.page_no;
        this.getWillsellstocks();
    }


    // 查看
    getcommoditys(component, data) {
        const modal: NzModalRef = this.modalService.create({
            nzTitle: '门店必卖商品明细',
            nzContent: component,
            nzWidth: '820',
            nzFooter: null,
            nzStyle: { top: '50px' }
            // nzOnOk: () => {}
        });
        modal.afterOpen.subscribe(() => {   // 打开对话框回调
            // console.log(data);
            this.stockCount.PageIndex = 1;
            this.stockCount.Pagesize = 50;
            this.par.search = {
                region_code: data.region_code,
                region_name: '',
                item_code: '',
                item_name: '',
                barcode: ''
            };
            this.getWillsellstocksdetail();
        });
    }


    // 翻页
    pageOver() {
        this.getWillsellstocksdetail();
    }


    // 导出
    addexport() {

        let exportname: any, startdate: any, enddate: any, channel: any;
        exportname = this.params.search.region_code;
        const parame = {
            'path': '/bsp/bspstock/stock/getwillsellstocksdetail',
            'search': {
                region_code: this.params.search.region_code,
                item_code: '',
                item_name: '',
                barcode: ''
            },
            'desc': exportname + '门店必卖商品',
            'sort': 'total',
            'sortDirKey': 'DESC',
            'export_columns': [
                { 'name': '门店编码', 'key': 'region_code' },
                { 'name': '门店名称', 'key': 'region_name' },
                { 'name': '商品编码', 'key': 'item_code' },
                { 'name': '商品条码', 'key': 'barcode' },
                { 'name': '商品名称', 'key': 'item_name' },
                { 'name': '线下库存', 'key': 'erp_qtys' },
                { 'name': '可用库存', 'key': 'available_qty' }
            ]

        };

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

