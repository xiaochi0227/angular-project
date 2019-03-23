import { Component, OnInit } from '@angular/core';
import { BaseParams } from '../../../utils/base.list.params';
import { HttpService } from '../../../http/http.service';
import { Authbts, Whetherdisplay } from '../../../validates/validates';
import { NzNotificationService } from 'ng-zorro-antd';
import { NzModalRef, NzModalService } from 'ng-zorro-antd'; // 对话框

@Component({
    templateUrl: './freshinventory.html',
    styleUrls: ['./freshinventory.less']

})
export class FreshinventoryComponent implements OnInit {
    // 生鲜列表
    freshinventorys: any = []; // 生鲜列表
    params: BaseParams = {
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

    // 生鲜明细
    mdlists: any = [];   // 生鲜明细列表
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


    constructor(private http: HttpService, private notification: NzNotificationService, private modalService: NzModalService) { }

    ngOnInit(): void {
        this.getStorelist();
        this.getfreshlists();
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


    // 生鲜列表
    getfreshlists() {
        this.http.getfreshstocks.request(this.params)
            .subscribe(res => {
                if (res['code'] === '0') {
                    this.freshinventorys = res['data'].rows;
                    this.pageSize.count = res['data'].count;
                }
            });
    }


    // 生鲜明细列表
    getfreshstocksdetail() {
        this.par.page_no = this.stockCount.PageIndex;
        this.par.page_size = this.stockCount.Pagesize;
        this.http.getfreshstocksdetail.request(this.par)
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
                this.getfreshlists();
                break;

            default:
                this.stockCount.PageIndex = 1;
                this.stockCount.Pagesize = 50;
                this.getfreshstocksdetail();
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
        this.getfreshlists();
    }


    // 查看
    getcommoditys(component, data) {
        const modal: NzModalRef = this.modalService.create({
            nzTitle: '生鲜商品明细',
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
            this.getfreshstocksdetail();
        });
    }


    // 翻页
    pageOver() {
        this.getfreshstocksdetail();
    }

    // 导出
    addexport() {

        let exportname: any, startdate: any, enddate: any, channel: any;
        exportname = this.params.search.region_code;
        const parame = {
            'path': '/test-export-bsp/stock/getfreshstocksdetail',
            'search': {
                region_code: this.params.search.region_code,
                item_code: '',
                item_name: '',
                barcode: ''
            },
            'desc': exportname + '生鲜商品',
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
            .subscribe(res => {
                if (res['status']) {
                  this.notification.create('success', '温馨提示', res['msg']);
                } else {
                    this.notification.create('error', '温馨提示', '添加失败，请重试！');
                }
            });
    }
}

