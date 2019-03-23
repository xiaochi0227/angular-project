import { Component, OnInit, TemplateRef } from '@angular/core';
import { BaseParams } from '../../../utils/base.list.params';
import { Authbts, Whetherdisplay } from '../../../validates/validates';
import { HttpService } from '../../../http/http.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { PublicService } from '../../../services/public.service';
import { UploadResult } from 'src/app/sharecomponets/upload/upload.component';

@Component({
    templateUrl: './storeinventory.html',
    styleUrls: ['./storeinventory.less']
})
export class StoreInventoryComponent implements OnInit {
    paras: BaseParams = {
        search: {
            region_code: '',
            region_name: '',
            item_code: '',
            item_name: '',
            barcode: '',
            ltzero: '',
            channel_keyword: '',
            online_sup_code: '',
            online_cat_code: ''
        },
        page_no: 1,
        page_size: 50
    };
    btns: any;
    dcdcsvwj: Boolean = true;
    spaqkcdr: Boolean = true;
    xzmb: Boolean = true;
    new_results: any;
    policy: any;
    templeteobj: any;
    channelss: any[];
    firstCategories: any;
    subCategories: any;
    cow: number;
    stocks: any;
    stockCount: any =
        {
            totalPage: 0,
            count: 0
        };
    changecount: any = 0;
    stores: any;
    results: any;
    totaldiv12: Boolean = false;
    inventorychangelogs: any;

    constructor(private http: HttpService, private notification: NzNotificationService, private publicService: PublicService) {
    }
    ngOnInit(): void {
        this.btns = Authbts('库存管理', '门店库存');
        // console.log(this.btns);
        this.dcdcsvwj = Whetherdisplay(this.btns, '导出到CSV文件');
        this.spaqkcdr = Whetherdisplay(this.btns, '商品安全库存导入');
        this.xzmb = Whetherdisplay(this.btns, '下载模板');
        this.getchannelss();
        // 获取线上一级分类
        // this.storeInventoryService.getFirstOnlineCategories()
        //     .then(categories => {
        //         this.firstCategories = categories;
        //     });
        this.http.getFirstOnlineCategories.request({ parent: 0 })
            .subscribe(categories => {
                this.firstCategories = categories;
            });
        // 获取门店列表
        // this.storeInventoryService.getStorelist()
        //     .then(stores => {
        //         this.stores = stores;
        //         if (stores[0]) {
        //             this.paras.search.region_code = stores[0].code;
        //         }
        //         this.getStocks(this.paras);
        //     });
        this.http.getStorelist.request()
            .subscribe(stores => {
                this.stores = stores;
                if (stores[0]) {
                    this.paras.search.region_code = stores[0].code;
                }
                this.getStocks(this.paras);
            });
    }

    // 获取渠道
    getchannelss(): void {
        // this.storeInventoryService.getchannels()
        //     .then(channels => {
        //         this.channelss = channels.rows;
        //     });
        this.http.getChannels.request()
            .subscribe(channels => {
                this.channelss = channels['rows'];
            });
    }

    searchcode($event) {
        this.paras.search.region_code = $event;
    }
    // 输入条件查询方法
    search(paramsoption) {
        paramsoption.page_no = 1;
        this.getStocks(paramsoption);
    }
    // 接收翻页操作传过来的值，然后请求服务得到新数据
    childparams($event) {
        let childoption = $event;
        this.paras.page_no = childoption.page_no;
        this.cow = (childoption.page_no - 1) * childoption.page_size;
        this.getStocks(childoption);

    }
    getStocks(paras) {
        this.cow = (paras.page_no - 1) * paras.page_size;
        // this.storeInventoryService.getStocks(paras)
        //     .then(stocks => {
        //         this.stocks = stocks;
        //         this.stockCount.count = stocks.count;
        //         this.changecount = stocks.count;
        //     });
        this.http.getstocks.request(paras)
            .subscribe(stocks => {
                this.stocks = stocks;
                this.stockCount.count = stocks['data'].count;
                this.changecount = stocks['data'].count;
            });

    }

    // 重置查询按钮
    Reset() {
        this.paras.search.item_code = '',
            this.paras.search.item_name = '',
            this.paras.search.barcode = '',
            this.paras.search.ltzero = '',
            this.paras.search.channel_keyword = '',
            this.paras.search.online_sup_code = '',
            this.paras.search.online_cat_code = '';

        // this.Child.clearshowtextvalue()
    }
    gettemplate(templete) {
        this.templeteobj = templete;
    }
    addexport() {

        let exportname: any, region_code: any, item_name: any, channel_keyword: any;
        if (this.paras.search.region_code) { region_code = this.paras.search.region_code + '-'; } else { region_code = ''; }
        if (this.paras.search.item_name) { item_name = this.paras.search.item_name + '-'; } else { item_name = ''; }
        if (this.paras.search.channel_keyword) { channel_keyword = this.paras.search.channel_keyword + '-'; } else { channel_keyword = ''; }
        exportname = region_code + item_name + channel_keyword;
        let parame = {
            'path': '/test-export-bsp/stock/getstocks',
            'search': {},
            'desc': exportname + '门店库存',
            'sort': 'code',
            'sortDirKey': 'DESC',
            'export_columns': [
                { 'name': '门店编码', 'key': 'region_code' },
                { 'name': '门店名称', 'key': 'region_name' },
                { 'name': '商品编码', 'key': 'item_code' },
                { 'name': '商品条码', 'key': 'barcode' },
                { 'name': '商品名称', 'key': 'item_name' },
                { 'name': '线下库存', 'key': 'erp_qty' },
                { 'name': '可用库存', 'key': 'available_qty' }
            ]

        };
        parame.search = this.paras.search;
        // this.storeInventoryService.addexport(parame)
        //     .then(row => {
        //         if (row) {
        //             alert(row.msg);
        //         } else {
        //             alert('添加失败,请重试！');
        //         }
        //     });
        this.http.addexport.request(parame)
            .subscribe(row => {
                if (row) {
                    // alert(row.msg);
                  this.notification.create('success', '温馨提示', row['msg']);
                } else {
                  this.notification.create('error', '温馨提示', '添加失败,请重试！');
                }
            });
    }
    // 导入提示
    createBasicNotification(template: TemplateRef<{}>): void {
        this.notification.template(template, { nzDuration: 0 });
    }
    // 商品安全库存导入


    spaqkcimport = (result: UploadResult): void => {
        const sucopt = {
            filename: result.fileName,
            key: result.key,
            local_url: result.localUrl,
            remote_url: result.remoteUrl
        };
        this.http.safeStockImport.request(sucopt)
            .subscribe(data => {
                if (data) {
                    this.results = data;
                    this.createBasicNotification(this.templeteobj);
                }
            });
    }

    // 获取二级分类
    getSubOnlineCategories(code: any) {
        this.subCategories = [];
        // this.storeInventoryService.getSubOnlineCategories(code)
        //     .then(categories => {
        //         this.subCategories = categories;
        //     });
        this.http.getSubOnlineCategories.request(code)
            .subscribe(categories => {
                this.subCategories = categories;
            });
    }


    // 更新库存共享率
    updateStock(stock: any) {


        // this.storeInventoryService.updateStock(stock)
        //     .then(tip => {
        //         alert(tip.msg)
        //     });
        this.http.updateStock.request(stock)
            .subscribe(tip => {
                this.notification.create('success', '温馨提示', tip['msg']);

            });

    }

    closediv12() {
        this.totaldiv12 = false;
    }
    //  库存变化日志
    inventorychangelog(stock: any) {
        this.http.inventorychangelog.request(stock)
            .subscribe(inventorychangelog => {
                if (inventorychangelog['code'] === false) {
                    // alert(inventorychangelog.msg);
                  this.notification.create('success', '温馨提示', inventorychangelog['msg']);
                } else {
                    this.inventorychangelogs = inventorychangelog;
                    this.totaldiv12 = true;
                }
            });
    }


    // 更新库存
    updateStockFull(stock: any) {
        // this.storeInventoryService.updateStockFull(stock)
        //     .then(tip => {
        //         alert(tip.msg)
        //     });
        this.http.updatestockfull.request(stock)
            .subscribe(tip => {
              this.notification.create('success', '温馨提示', tip['msg']);
            });

    }
    importtip: boolean = false;
    closeimportip() {
        this.importtip = false;
    }

    // download(filename: string): void {
    //     this.storeInventoryService.download(filename)
    //         .then(data => {
    //             let link = document.createElement('a');
    //             link.setAttribute('href', window.URL.createObjectURL(data));
    //             link.setAttribute('download', filename + '.xlsx');
    //             link.style.visibility = 'hidden';
    //             document.body.appendChild(link);
    //             link.click();
    //             document.body.removeChild(link);
    //         }
    //         );
    // }
    download(filename: string): void {
        this.publicService.publicdownload(filename);
    }


}

