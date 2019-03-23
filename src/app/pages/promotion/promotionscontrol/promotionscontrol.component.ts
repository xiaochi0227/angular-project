import { Component, OnInit, Injector } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Authbts, Whetherdisplay, GMTToStr } from './../../../validates/validates';
import { HttpService } from 'src/app/http/http.service';    // 导入所用接口
import { BreadcrumbService } from 'src/app/services/breadcrumb.service';    // 面包屑导航
@Component({
    selector: 'app-promotionscontrol',
    templateUrl: './promotionscontrol.html',
    styleUrls: ['./promotionscontrol.less']
})
export class PromotionscontrolComponent implements OnInit {


    // 获取接口服务
    constructor(public router: Router, private http: HttpService, public activatedRoute: ActivatedRoute) { }
    // 请求参数
    params: any = {
        search: {
            channel: '',
            item_code: '',
            region_code: '',
            barcode: '',
            promotion_type: ''
        },
        page_size: 20,
        page_no: 1,
        sort: 'timestamp',
        sortDirKey: 'desc'
    };
    pageSize =
        {
            totalPage: 0,
            count: 0
        };
    cow = 0; // 序号
    region_name: string;
    changecount: any = 0;
    // @ViewChild(SearchSelect)
    // private Child: SearchSelect;
    isVisible = false;
    promotionslists: any;
    stores: any;    // 门店
    channels: any;    // 渠道
    types: any;   // 类型
    hidesearch: Boolean = false;
    j = 0;
    userrightsentid: any;
    // constructor(private router: Router, private promotionscontrolService: PromotionscontrolService) {
    // }
    ngOnInit(): void {
        //     const localuser = window.localStorage.getItem('userinfo');
        //     this.userrightsentid = JSON.parse(localuser).ent_id;
        // 获取门店
        this.http.getStorelist.request()
            .subscribe(stores => {
                this.stores = stores;
            });

        // 获取渠道
        this.http.getChannels.request({ 'ebls_split': true })
            .subscribe(channels => {
                console.log(channels);
                this.channels = channels['rows'];
            });

        // 获取类型
        this.http.gettypesUrl.request()
            .subscribe(res => {
                this.types = res;
            });

        this.getpromotionslists(this.params);
    }


    // 展开更多
    togglesearch(event) {
        this.j++;
        if (this.j % 2 !== 0) {
            this.hidesearch = true;
            event.target.value = '收起↑';
        } else {
            this.hidesearch = false;
            event.target.value = '展开更多↓';
        }
    }


    // 列表接口
    getpromotionslists(params) {
        this.http.getpromotionslistsurl.request(params)
            .subscribe(res => {
                this.promotionslists = res['rows'];
                this.pageSize.count = res['count'];
            });
    }

    // // 接收翻页操作传过来的值，然后请求服务得到新数据
    // childparams($event) {
    //     const childoption = $event;
    //     this.params.page_no = childoption.page_no;
    //     this.cow = (childoption.page_no - 1) * childoption.page_size;
    //     this.getpromotionslists(childoption);
    // }
    // searchcode($event) {
    //     this.params.search.region_code = $event;

    // }
    // 查询
    searchInfo() {
        this.params.page_no = 1;
        this.getpromotionslists(this.params);
    }


    // 重置
    Reset() {
        this.params.search = {
            channel: '',
            item_code: '',
            region_code: '',
            barcode: '',
            promotion_type: ''
        };
        // this.Child.showtextvalue = '';
    }


    // 接收翻页操作传过来的值，然后请求服务得到新数据
    childparams($event) {
        const childoption = $event;
        this.params.page_no = childoption.page_no;
        this.cow = (childoption.page_no - 1) * childoption.page_size;
        this.getpromotionslists(this.params);
    }
    // showModal = () => {
    //     this.isVisible = true;
    // }

    // handleOk = (e) => {
    //     this.isVisible = false;

    // }
    // handleCancel(): void {
    //     this.isVisible = false;
    // }
    // promotionauditlists: any;
    // selectedpromotionaudit:any;
    // auditmsg: any;
    audit(data) {

    }
    //     this.selectedpromotionaudit = auditparams;
    //     const auditopt = {
    //         ent_id: String(this.userrightsentid),
    //         storecode: auditparams.region_code,
    //         item_code: auditparams.item_code,
    //         barcode: auditparams.barcode,
    //         channel: auditparams.channel.join(','),
    //         promotion_type: auditparams.promotion_type
    //     };
    //     this.promotionscontrolService.getpromotionsaudit(auditopt)
    //         .then(res => {
    //             console.log(res);
    //             if (res.data) {
    //                 this.promotionauditlists = res.data;
    //                 this.showModal();
    //             }
    //             if (res.msg) {
    //                 this.auditmsg = res.msg;
    //             } else {
    //                 this.auditmsg = false;
    //             }

    //         });
    // }

}
