
import { Component, OnInit, Injector } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NGXLogger } from 'ngx-logger'; // 控制台输出 this.logger
import { Authbts, Whetherdisplay, GMTToStr } from './../../../validates/validates';
import { HttpService } from 'src/app/http/http.service';    // 导入所用接口
import { NzMessageService } from 'ng-zorro-antd';   // 全局提示
import { NzModalRef, NzModalService } from 'ng-zorro-antd'; // 对话框
import { BreadcrumbService } from 'src/app/services/breadcrumb.service';    // 面包屑导航
import { resolve } from 'url';


@Component({
    selector: 'app-addgoodsdepreciate',
    templateUrl: './addGoodsDepreciate.component.html',
    styleUrls: ['./goodsDepreciate.component.less']
})
export class AddGoodsDepreciateComponent implements OnInit {

    // 获取接口服务
    constructor(public router: Router, private route: ActivatedRoute, private logger: NGXLogger,
        private http: HttpService, private breadcrumbService: BreadcrumbService, private injector: Injector, private message: NzMessageService,
        public activatedRoute: ActivatedRoute, private modalService: NzModalService) {
        this.activatedRoute.data.subscribe(res => {
            console.log(res);
            this.breadcrumbService.sendMessage(
                [
                    {
                        name: "单品直降",
                        url: "promotion/goodsDepreciate/addGoodsDepreciate;isTitle=1"
                    }, {
                        name: "新增单品直降",
                        url: this.router.url
                    },
                ]);
        });
    }




    // 页面
    pages: any = {
        current: 0,   // 步骤条
        activityGoods: '1'   // 页面
    };


    // 按钮加载状态
    isLoading: any = {
        one: false,
        two: false,
        three: false
    };


    // 渠道
    channel: any = [];
    checkedJDDJ: Boolean = false;   // 京东
    checkedMTWM: Boolean = false;   // 美团


    // 美团选择框判断
    MTWMchoose: any = {
        imposeNumber: true,  // 美团每日限购数量选择框
        imposeStore: true,   // 美团每日活动库存选择框
        radioValueCustom: '0',    // 美团限购数量选择不限
        radioValueStore: '0'    // 美团活动库存选择不限
    };


    // 活动规则页面-需传参数
    goodSubmit: any = {     // 提交时需传参数
        pd_code: '',    // 活动id
        auditor: 'ceshi',   // 作者
        pd_name: '',    // 活动名称
        begin_date: '', // 开始时间
        end_date: '',   // 结束时间
        promotion_channel: {},  // 渠道
        regions: [], // 门店
        source_type: "1"    // 判断为导入或手动添加（去掉）
    };
    JDDJ: any = {
        user_type: 0,    // 促销人群，0-不限，1-新用户
        limitCount: 0,   // 限购件数，0-不限
        limitDevice: 0,  // 设备限购，0-不限，1-限购（去掉）
        limitPin: 0, // 账号限购，0-不限，1-限购（去掉）
        limitDaily: 0    // 按日限购，0-不限，1-限购
    };
    MTWM: any = {
        user_type: 0,    // 促销人群，0-不限，1-新用户
        limitCount: '',   // 每单限购：1 只能是正整数或-1 2 最大为10
        day_limit: '',    // 当日活动库存：只能是正整数或-1
    };


    // 时间控件
    chooseTime: any = {
        current_time: [], // 所选时间
        nowDate: new Date(),   // 当前时间
        disabledRangeTime: '', // 不可选择的时间
        disabledDate: ''  // 不可选择的日期
    };


    // 校验规则
    Ruls: any = {
        isPd_name: false, // 活动名称框
        isJDLimitCount: false,    // 京东限购数量框
        isMTLimitCount: false,    // 美团限购数量框
        isMTday_limit: false // 美团活动库存框
    };


    // 新增门店对话框
    addStore: any = {
        valueIndex: '0',  // 门店下拉选择
        value: '',   // 门店输入框
        placeholder: '请输入门店编码，多项用英文逗号隔开',  // 门店输入框placeholder
        data_Set: [], // 门店列表
        allChecked: false,   // 门店全选按钮
        indeterminate: false,    // 门店全选按钮状态
        num: 0,  // 所选门店数
        PageIndex: 1,   // 页码
        Pagesize: 20,   // 每页数量
        count: 0    // 数据总量
    };


    // 查询门店所需参数
    store_params: any = {
        code: '',
        name: '',
        city: '',
        status: '1',
        channel: ''
    };


    // 促销门店列表
    storeList: any = {
        data_Set: [], // 门店列表
        allChecked: false,   // 门店全选按钮
        indeterminate: false,    // 门店全选按钮状态
        num: 0,  // 所选门店数
        count: 0    // 数据总量
    };


    // 删除促销门店所需参数
    deleteStore_params: any = {
        regions: [],    // 门店
        pd_code: ''    // 活动id
    };


    // 商品分类
    online: any = {
        onlinelist_one: [], // 一级分类列表
        onlinelist_two: [], // 二级分类列表
        isDisable: true, // 是否禁用二级分类
    };
    select_one: any; // 一级分类code
    select_two: any; // 二级分类code


    // 新增商品对话框
    addCommodity: any = {
        valueIndex: '0',  // 门店下拉选择
        value: '',   // 门店输入框
        placeholder: '请输入商品编码，多项用英文逗号隔开',  // 门店输入框placeholder
        data_Set: [], // 商品列表
        allChecked: false,   // 商品全选按钮
        indeterminate: false,    // 商品全选按钮状态
        num: 0,  // 所选商品数
        PageIndex: 1,   // 页码
        Pagesize: 20,   // 每页数量
        count: 0,    // 数据总量
        regions: [] // 所添加的门店数据
    };


    // 查询商品所需参数
    commodity_params: any = {};


    // 添加商品所需参数
    addCommody_params: any = {
        search: {
            regions: [],    // 门店
            pd_code: '',    // 活动id
            region_items: []    // 商品
        },
        sort: "region_code",
        sortDirKey: "ASC",
        page_no: 1, // （去掉）
        page_size: 20   // （去掉）
    };


    // 促销商品列表
    commodityList: any = {
        data_Set: [], // 商品列表
        allChecked: false,   // 商品全选按钮
        indeterminate: false,    // 商品全选按钮状态
        num: 0,  // 所选商品数
        count: 0,    // 数据总量
        region_items: [],    // 选中数据
        discount: '',   // 折扣
        price: '',   // 活动价
        isShowFile: false,  // 是否显示上传样式
        agree: false    // 商家协议check
    };


    // 查询促销商品所需参数
    searchCommodity: any = {
        search: {
            pd_code: '',
            region_code: '',
            region_name: '',
            item_code: '',
            item_name: ''
        },
        sort: 'region_code',
        sortDirKey: 'ASC'
    };

    ngOnInit() {

        //         // window.localStorage.removeItem('temp');
        //         // 接收参数
        //         this.route.params.forEach((paramsInfo: Params) => {
        //             // console.log(paramsInfo);
        //             this.pd_code = paramsInfo.pd_code;
        //             this.paramsInfo = paramsInfo;

        //             if (paramsInfo.isTitle === '2') {   // 编辑界面
        //                 this.continue = false;

        //                 // 活动规则
        //                 const opt = {
        //                     promotion_channel: paramsInfo.promotion_channel,
        //                     pd_code: paramsInfo.pd_code
        //                 };
        //                 this.goodsDepreciateService.editInfo(opt)
        //                     .then(res => {
        //                         // console.log(res);

        //                         if (res.code === 0) {

        //                             // const begin_date = res.data.begin_date;
        //                             // this._startDate = new Date(parseInt(begin_date, 10) + 0);
        //                             // // console.log(this._startDate);
        //                             // this._endDate = new Date(parseInt(res.data.end_date, 10) + 0);
        //                             // // console.log(this._endDate);
        //                             // this.goodSubmit = {
        //                             //     pd_name: res.data.pd_name,    // 活动名称
        //                             //     begin_date: GMTToStr(this._startDate) + ' 00:00:00',
        //                             //     end_date: GMTToStr(this._endDate) + ' 23:59:59'
        //                             // };
        //                             // let data = new Date(time + 8 * 3600 * 1000);
        //                             // data.toJSON().substr(0, 19)

        //                             this.promotion_channel.source_type = res.data.source_type;
        //                             this.a = new Date(res.data.begin_date);

        //                             this.b = new Date(res.data.end_date);
        //                             this.goodSubmit = {
        //                                 pd_name: res.data.pd_name,    // 活动名称
        //                                 begin_date: this.a,
        //                                 end_date: this.b
        //                             };

        //                             this.current_time = [this.a, this.b];

        //                             // console.log(this.current_time);
        //                             if (res.data.promotion_channel === 'JDDJ') {
        //                                 this.checkedJDDJ = true;   // 京东选择框
        //                                 this.JDDJ.limitDaily = res.data.limitDaily;
        //                                 this.JDDJ.user_type = res.data.user_type;
        //                                 if (res.data.rule) {
        //                                     if (res.data.rule.limitPin) {
        //                                         this.JDDJaccount = true;   // 京东按每个账号选择框
        //                                         this.JDDJ.limitPin = Number(res.data.rule.limitPin);
        //                                     } else {
        //                                         this.JDDJ.limitPin = 0;
        //                                     }

        //                                     if (res.data.rule.limitDevice) {
        //                                         this.JDDJfacility = true;  // 京东按每个设备选择框
        //                                         this.JDDJ.limitDevice = Number(res.data.rule.limitDevice);
        //                                     } else {
        //                                         this.JDDJ.limitDevice = 0;
        //                                     }
        //                                     this.JDDJ.limitCount = res.data.rule.limitCount;    // 限购件数，0-不限

        //                                 } else {
        //                                     this.JDDJ = {
        //                                         user_type: 0,    // 促销人群，0-不限，1-新用户
        //                                         limitCount: 0,   // 限购件数，0-不限
        //                                         limitDevice: 0,  // 设备限购，0-不限，1-限购
        //                                         limitPin: 0, // 账号限购，0-不限，1-限购
        //                                         limitDaily: 0    // 按日限购，0-不限，1-限购
        //                                     };
        //                                 }

        //                                 this.promotion_channel.JDDJ = this.JDDJ;

        //                             } else {
        //                                 this.checkedMTWM = true;   // 美团外卖选择框

        //                                 this.MTWM.user_type = res.data.user_type;
        //                                 if (res.data.rule) {
        //                                     if (res.data.rule.day_limit !== -1) {
        //                                         this.imposeStore = true;
        //                                         this.radioValueStore = '1';
        //                                         this.MTWM.day_limit = res.data.rule.day_limit;
        //                                     } else {
        //                                         this.radioValueStore = '0';
        //                                         this.MTWM.day_limit = '';
        //                                     }

        //                                     if (res.data.rule.limitCount !== -1) {
        //                                         this.imposeNumber = true;
        //                                         this.radioValueCustom = '1';
        //                                         this.MTWM.limitCount = res.data.rule.limitCount;
        //                                     } else {
        //                                         this.radioValueCustom = '0';
        //                                         this.MTWM.limitCount = '';
        //                                     }

        //                                 } else {
        //                                     this.MTWM = {
        //                                         user_type: 0,    // 促销人群，0-不限，1-新用户
        //                                         limitCount: '',   // 每单限购：1 只能是正整数或-1 2 最大为10
        //                                         day_limit: '',    // 当日活动库存：只能是正整数或-1
        //                                     };
        //                                 }

        //                                 this.promotion_channel.MTWM = this.MTWM;
        //                             }
        //                         } else {
        //                             alert(res.msg);
        //                         }
        //                     });

        //                 // this.getAddStorelist();
        //                 // this.getAddCommodity(this.searchValue.region_code, this.searchValue.region_name,
        //                 //     this.searchValue.item_code, this.searchValue.item_name);
        //             } else {    // 新增页面

        //                 this.continue = true;
        //                 // this._startDate = new Date(Date.now() + 0);
        //                 // this._endDate = new Date(Date.now() + 0);
        //                 // this.goodSubmit.begin_date = GMTToStr(this._startDate) + ' 00:00:00';
        //                 // this.goodSubmit.end_date = GMTToStr(this._endDate) + ' 23:59:59';
        //             }
        //             // const paramsCode = paramsInfo['code'];
        //             // console.log(paramsCode);

        //         });

        //         this.onSelectParent();  // 分类
        //         this.SearchStore(); // 门店
        //         this.storeCount();  // 门店count
        // this.current_time = ['2019-03-06 00:00', '2019-03-06 23:59'];

        // this.isSearchStore();   // 获取门店
        // this.isStoreCount(); // 获取门店count
        this.isOnline(0);
    }






    // 活动规则页面
    // 下一步/上一步按钮/继续创建/活动列表
    onBtnNext(i) {

        switch (i) {
            case '1':   // 下一步

                if (this.channel.length === 0 || this.goodSubmit.pd_name === '' || this.chooseTime.current_time.length === 0) {
                    this.message.error(`请将表单填写完整`, { nzDuration: 2000 });

                } else if (this.JDDJ.limitDaily === 1 && (this.JDDJ.limitCount === '' || this.Ruls.isJDLimitCount)) {
                    this.message.error(`请将京东限购数量格式填写正确`, { nzDuration: 2000 });

                } else if (this.MTWMchoose.imposeNumber && this.MTWMchoose.radioValueCustom === 1) {
                    if (this.MTWM.limitCount === '' || this.Ruls.isMTLimitCount) {
                        this.message.error(`请将美团限购数量格式填写正确`, { nzDuration: 2000 });
                    }

                } else if (this.MTWMchoose.imposeStore && this.MTWMchoose.radioValueStore === 1) {
                    if (this.MTWM.day_limit === '' || this.Ruls.isMTday_limit) {
                        this.message.error(`请将美团活动库存数量格式填写正确`, { nzDuration: 2000 });
                    }

                } else {
                    this.pages = {
                        current: 1,
                        activityGoods: '2'
                    };
                    console.log(this.goodSubmit);
                }
                break;


            case '2':   // 上一步
                this.pages = {
                    current: 0,
                    activityGoods: '1'
                };
                break;

            default:
                break;
        }

    }


    // 渠道选择/京东限购选择/美团限购选择/美团库存选择
    onChoose(i, $event) {

        switch (i) {
            case '1':   // 渠道选择
                this.checkedJDDJ = $event.indexOf('JDDJ') !== -1 ? true : false;
                this.checkedMTWM = $event.indexOf('MTWM') !== -1 ? true : false;

                if ($event.indexOf('JDDJ') !== -1) {
                    this.goodSubmit.promotion_channel.JDDJ = this.JDDJ;

                } else {
                    delete this.goodSubmit.promotion_channel.JDDJ;
                }

                if ($event.indexOf('MTWM') !== -1) {
                    this.goodSubmit.promotion_channel.MTWM = this.MTWM;

                } else {
                    delete this.goodSubmit.promotion_channel.MTWM;
                }
                break;


            case '2':   // 京东限购选择
                if ($event === 0) {
                    this.Ruls.isJDLimitCount = false;
                    this.JDDJ.limitCount = 0;
                } else {
                    this.JDDJ.limitCount = '';
                }
                break;


            case '3':   // 美团限购选择
                if ($event === '0') {
                    this.Ruls.isMTLimitCount = false;
                    this.MTWM.limitCount = '';
                } else {
                    this.MTWM.limitCount = '';
                }
                break;


            default:    // 美团活动选择
                if ($event === '0') {
                    this.Ruls.isMTday_limit = false;
                    this.MTWM.day_limit = '';
                } else {
                    this.MTWM.day_limit = '';
                }
                break;
        }

    }


    // 活动规则输入框校验
    onChangeActive(i, $event) {

        const res = /^[1-9]\d*$/;
        switch (i) {
            case '1':   // 活动名称
                this.Ruls.isPd_name = $event.length > 20 ? true : false;
                break;


            case '2':   // 京东限购数量
                this.Ruls.isJDLimitCount = !res.test($event) ? true : false;
                break;


            case '3':   // 美团限购数量
                this.Ruls.isMTLimitCount = !res.test($event) ? true : false;
                break;


            default:    // 美团活动库存
                this.Ruls.isMTday_limit = !res.test($event) ? true : false;
                break;
        }
    }


    // 日历控件操作
    onCalendarChange(i, $event) {
        // console.log($event);
        switch (i) {
            case '1':   // 日期改变
                this.goodSubmit.begin_date = $event[0];
                this.goodSubmit.end_date = $event[1];
                break;


            case '2':   // 确定按钮

                break;


            default:    // 打开或关闭日历
                break;
        }

        // console.log($event[0].getDate());
        // console.log(this.nowDate.getDate());
        // console.log(this.current_time);

        // if (this.nowDate.getDate() === $event[0].getDate()) {
        //     this.current_time[0] = new Date($event[0].getTime() + 1000 * 60 * 60);
        //     console.log(this.current_time[0]);
        // }
        // if (this.nowDate.getDate() < $event[0].getDate()) { // 开始时间小于选中时间

        //     let year = $event[0].getFullYear();
        //     let month = $event[0].getMonth() + 1;
        //     let date = $event[0].getDate();
        //     month = month > 9 ? month : '0' + month;
        //     date = date > 9 ? date : '0' + date;
        //     this.current_time[0] = `${year}-${month}-${date} 00:00`;
        //     console.log(this.current_time[0]);
        //     this.current_time = [this.current_time[0], this.current_time[0]];
        // }
    }












    // 添加门店商品页面

    // TODO:仅保存/保存并提交
    onSave(i) {

        switch (i) {
            case '1':   // 活动规则页面保存
                this.isLoading.one = true;

                setTimeout(() => {
                    this.isLoading.one = false;
                    this.message.success(`保存成功`, { nzDuration: 2000 });
                }, 1000);
                break;


            case '2':   // 活动商品页面保存
                if (this.storeList.data_Set.length === 0 || this.commodityList.data_Set.length === 0) {
                    this.message.error(`请将活动列表补充完整`, { nzDuration: 2000 });

                } else {
                    // console.log(this.commodityList.data_Set.every(item => item.price)); // false
                    const filterList = this.commodityList.data_Set.filter(item => item.price >= item.sale_price || !item.price);
                    // console.log(filterList);
                    if (filterList.length !== 0) {
                        this.message.error(`您有单个或多个商品的活动价规则不正确，请重新填写`, { nzDuration: 2000 });

                        this.commodityList.data_Set.forEach((data, index, arr) => {
                            if (!arr[index].price || arr[index].price >= arr[index].sale_price) {
                                arr[index].borderColor = '#f00';
                            }
                        });

                    } else {
                        // this.isLoading.two = true;
                        console.log('save');
                    }
                }
                break;


            default:
                // this.isLoading.three = true;

                // setTimeout(() => {
                //     this.isLoading.three = false;
                //     this.message.success(`保存成功`, { nzDuration: 2000 });
                // }, 1000);

                this.pages = {
                    current: 2,
                    activityGoods: '3'
                };

                break;
        }

    }


    // FIXME 新增门店/新增商品/批量设置折扣/批量设置活动价/批量导入/商家协议
    onAddModal(i, component) {

        switch (i) {
            case '1':   // 新增门店
                const modal: NzModalRef = this.modalService.create({
                    nzTitle: '新增门店',
                    nzContent: component,
                    nzWidth: '700',
                    nzStyle: { top: `50px` },
                    nzOnOk: () => {
                        if (this.goodSubmit.regions.length === 0) {
                            this.message.error(`请选择门店`, { nzDuration: 2000 });
                            return false;

                        } else {
                            // console.log(this.goodSubmit.regions);
                            this.isaddStore();
                        }
                    }
                });
                modal.afterOpen.subscribe(() => {   // 打开对话框回调
                    // 清除缓存
                    this.addStore.value = '';
                    this.onSearchStore('1');
                });
                break;


            case '2':   // 新增商品
                const modal_one: NzModalRef = this.modalService.create({
                    nzTitle: '新增商品',
                    nzContent: component,
                    nzWidth: '820',
                    nzStyle: { top: `50px` },
                    nzOnOk: () => {
                        if (this.addCommody_params.search.region_items.length === 0) {
                            this.message.error(`请选择商品`, { nzDuration: 2000 });
                            return false;

                        } else {

                            this.isaddCommodity();
                        }
                    }
                });
                break;


            case '3':   // 批量设置折扣
                const modal_two: NzModalRef = this.modalService.create({
                    nzTitle: '批量设置折扣',
                    nzContent: component,
                    nzWidth: '520',
                    nzStyle: { top: `50px` },
                    nzOnOk: () => {
                        const resel_num = /^((0\.[1-9]{1})|(([1-9]{1})(\.\d{1})?))$/;

                        if (!resel_num.test(this.commodityList.discount)) {
                            this.message.error(`注：只能为1-10之间的整数或保留小数点后一位的数字`, { nzDuration: 2000 });
                            return false;

                        } else {
                            this.commodityList.region_items = this.commodityList.region_items.map(({ _id, sale_price }) => {
                                return { _id, sale_price, discount: Number(this.commodityList.discount) };
                            });
                            // console.log(this.commodityList.region_items);
                            this.iscompilePushPrice();
                        }
                    }
                });
                modal.afterOpen.subscribe(() => {   // 打开对话框回调
                    // 清除缓存
                    this.commodityList.discount = '';
                });
                break;


            case '4':   // 批量设置活动价
                const modal_three: NzModalRef = this.modalService.create({
                    nzTitle: '批量设置活动价',
                    nzContent: component,
                    nzWidth: '520',
                    nzStyle: { top: `50px` },
                    nzOnOk: () => {
                        const resel_num = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/;

                        if (!resel_num.test(this.commodityList.price)) {
                            this.message.error(`注：只能为整数或保留小数点后两位的数字`, { nzDuration: 2000 });
                            return false;

                        } else {
                            this.commodityList.region_items = this.commodityList.region_items.map(({ _id }) => {
                                return { _id, price: Number(this.commodityList.price) };
                            });

                            this.iscompilePushPrice();
                        }
                    }
                });
                modal.afterOpen.subscribe(() => {   // 打开对话框回调
                    // 清除缓存
                    this.commodityList.price = '';
                });
                break;


            case '5':   // 批量导入商品
                this.commodityList.isShowFile = true;
                break;


            default:    // 商家协议
                const modal_four: NzModalRef = this.modalService.create({
                    nzTitle: '商家自营销协议',
                    nzContent: `<h3>请参考各平台自营销协议</h3>`,
                    nzWidth: '520',
                    nzStyle: { top: `50px` },
                    nzFooter: null
                });
                break;
        }

    }


    // 查询门店/查询商品/查询促销商品/重置促销商品
    onSearchStore(i) {

        switch (i) {
            case '1':   // 查询门店

                // 清除缓存
                this.addStore.PageIndex = 1;
                this.addStore.Pagesize = 20;
                this.goodSubmit.regions = [];
                this.addStore.allChecked = false;
                this.addStore.indeterminate = false;
                this.addStore.num = 0;

                // 查询条件
                if (this.addStore.valueIndex === '0') {
                    this.store_params.code = this.addStore.value;
                    this.store_params.name = '';
                } else {
                    this.store_params.name = this.addStore.value;
                    this.store_params.code = '';
                }

                // 查询接口
                this.isSearchStore();
                this.isStoreCount();
                break;


            case '2':   // 查询商品

                // 清除缓存
                this.addCommodity.PageIndex = 1;
                this.addCommodity.Pagesize = 20;
                this.addCommodity.allChecked = false;
                this.addCommodity.indeterminate = false;
                this.addCommodity.num = 0;

                // 查询条件
                this.storeList.data_Set.forEach(data => {
                    this.addCommodity.regions.push(data.region_code);
                });

                if (this.addCommodity.valueIndex === '0') { // 商品编码
                    this.commodity_params = {
                        search: {
                            regions: this.addCommodity.regions,
                            item_code: this.addCommodity.value,
                            pd_code: this.goodSubmit.pd_code
                        },
                        page_no: this.addCommodity.PageIndex,
                        page_size: this.addCommodity.Pagesize,
                        sort: 'region_code',
                        sortDirKey: 'ASC'
                    };
                    this.issearchCommodity();

                } else if (this.addCommodity.valueIndex === '1') {  // 商品条码
                    this.commodity_params = {
                        search: {
                            regions: this.addCommodity.regions,
                            barcode: this.addCommodity.value,
                            pd_code: this.goodSubmit.pd_code
                        },
                        page_no: this.addCommodity.PageIndex,
                        page_size: this.addCommodity.Pagesize,
                        sort: 'region_code',
                        sortDirKey: 'ASC'
                    };
                    this.issearchCommodity();

                } else if (this.addCommodity.valueIndex === '2') {  // 商品名称
                    this.commodity_params = {
                        search: {
                            regions: this.addCommodity.regions,
                            item_name: this.addCommodity.value,
                            pd_code: this.goodSubmit.pd_code
                        },
                        page_no: this.addCommodity.PageIndex,
                        page_size: this.addCommodity.Pagesize,
                        sort: 'region_code',
                        sortDirKey: 'ASC'
                    };
                    this.issearchCommodity();

                } else {    // 商品分类
                    if (!this.select_one) {
                        this.message.error(`请先选择分类`, { nzDuration: 2000 });

                    } else {
                        this.commodity_params = {
                            search: {
                                regions: this.addCommodity.regions,
                                online_sup_code: this.select_one,  // 一级
                                online_cat_code: this.select_two, // 二级
                                pd_code: this.goodSubmit.pd_code
                            },
                            page_no: this.addCommodity.PageIndex,
                            page_size: this.addCommodity.Pagesize,
                            sort: 'region_code',
                            sortDirKey: 'ASC'
                        };
                        if (this.online.onlinelist_two[0].index === 100) {
                            this.commodity_params.search.online_sup_code = '0';
                        }
                        // 查询接口
                        this.issearchCommodity();
                    }

                }
                break;


            case '3':   // 查询促销商品
                // 查询条件
                console.log(this.searchCommodity);

                // 查询接口
                this.issearchPushCommodity();
                break;


            default:    // 重置促销商品
                this.searchCommodity.search.region_code = '';
                this.searchCommodity.search.region_name = '';
                this.searchCommodity.search.item_code = '';
                this.searchCommodity.search.item_name = '';
                break;
        }
    }


    // 全选按钮
    checkAll(i, $event) {

        switch (i) {
            case '1':   // 新增门店
                this.checkAll_addStore($event);
                break;


            case '2':   // 促销门店
                this.checkAll_storeList($event);
                break;


            case '3':   // 新增商品
                this.checkAll_addCommodity($event);
                break;


            default:    // 促销商品
                this.checkAll_commodityList($event);
                break;
        }
    }


    // 多选按钮
    checkMultiple(i, $event?, data?) {

        switch (i) {
            case '1':   // 新增门店
                this.checkMultiple_addStore($event, data);
                break;


            case '2':   // 促销门店
                this.checkMultiple_storeList();
                break;


            case '3':   // 新增商品
                this.checkMultiple_addCommodity($event, data);
                break;


            default:    // 促销商品
                this.checkMultiple_commodityList();
                break;
        }
    }


    // 翻页回调
    pageOver(i) {

        switch (i) {
            case '1':   // 新增门店
                this.pageOver_addStore();
                break;

            default:    // 新增商品
                this.pageOver_addCommodity();
                break;
        }
    }


    // 批量删除门店/商品/单个删除门店/商品
    onPushDelete(i, data?) {

        switch (i) {
            case '1':   // 批量删除门店
                this.deleteStore_params.pd_code = this.goodSubmit.pd_code;
                this.isDeleteStore();
                break;


            case '2':   // 单个删除门店
                this.deleteStore_params = {
                    regions: [data],
                    pd_code: this.goodSubmit.pd_code
                };
                this.isDeleteStore();
                break;


            case '3':   // 批量删除商品
                this.commodityList.region_items = this.commodityList.region_items.map(({ _id }) => {
                    return { _id };
                });
                this.isdeletePushCommodity();
                break;


            default:    // 单个删除商品
                this.isdeleteCommodity(data._id);
                break;
        }
    }


    // 门店/商品/商品分类下拉
    onSelect(i, $event) {

        switch (i) {
            case '1':   // 门店下拉
                // 清除缓存
                this.addStore.value = '';  // 输入框内容

                this.addStore.placeholder = $event === '0' ? '请输入门店编码，多项用英文逗号隔开' : '请输入门店名称，多项用英文逗号隔开';
                break;


            case '2':   // 商品下拉
                // 清除缓存
                this.addCommodity.value = '';

                if ($event === '0') {
                    this.addCommodity.placeholder = '请输入商品编码，多项用英文逗号隔开';

                } else if ($event === '1') {
                    this.addCommodity.placeholder = '请输入商品条码，多项用英文逗号隔开';

                } else if ($event === '2') {
                    this.addCommodity.placeholder = '请输入商品名称，多项用英文逗号隔开';

                }
                break;


            default:    // 商品分类下拉
                this.isOnline($event);
                break;
        }
    }


    // 修改商品活动价
    onChangePrice($event, data) {

        const res = /(^[1-9]{1}[0-9]*$)|(^[0-9]*\.[0-9]{1,2}$)/;    // 大于0的整数或保留两位数的小数
        if ($event >= data.sale_price || !res.test($event)) {
            data.borderColor = '#f00';
            data.isSave = false;
            this.message.error(`请正确填写活动价格式，且不可大于或等于原价`, { nzDuration: 2000 });

        } else {
            data.borderColor = '';
            data.isSave = true;
        }
    }


    // 批量上传/查看失败记录/清空失败记录
    onUpload(i) {

        switch (i) {
            case '1':   // 上传

                break;


            case '2':   // 查看失败记录

                break;


            default:    // 清空失败记录
                break;
        }
    }


    // 批量上传
    promotionimport(file: HTMLInputElement): void {

        //         // console.log(file.files[0]);
        //         // console.log(file.files[0].name);    // 文件名
        //         // console.log(file.files[0].size);    // 字节
        //         const form = new FormData();
        //         // console.log(file);
        //         this.fileName = file.files[0].name;
        //         form.append('file', file.files[0], file.files[0].name);
        //         // console.log(form);

        //         const data = {
        //             pd_code: this.pd_code,
        //             auditor: 'ceshi',   // 创建者
        //             pd_name: this.goodSubmit.pd_name,    // 活动名称
        //             begin_date: this.goodSubmit.begin_date,  // 开始时间
        //             end_date: this.goodSubmit.end_date, // 结束时间
        //             promotion_channel: this.promotion_channel,
        //             source_type: this.promotion_channel.source_type,
        //         };

        //         if (file.files[0].name.indexOf('.xlsx') === -1) {
        //             alert('请导入正确的 Excel 文件');
        //             // this.fileName = ''
        //         } else {
        //             this.goodsDepreciateService.uploading(form, data)
        //                 .then(res => {
        //                     console.log(res);

        //                     if (res.code === 0) {
        //                         alert(res.msg);

        //                         this.pd_code = res.data.pd_code;
        //                         this.region_count = res.data.region_count;

        //                         if (res.data.item_msg && res.data.item_msg.length !== 0) {
        //                             let str = '';
        //                             res.data.item_msg.forEach(item => str += item + '\r\n');
        //                             // console.log(str);
        //                             alert(str);
        //                         }

        //                         // 商品列表接口
        //                         this.getAddCommodity(this.searchValue.region_code, this.searchValue.region_name,
        //                             this.searchValue.item_code, this.searchValue.item_name);

        //                         file.value = '';    // 清除input上传文件缓存
        //                     } else {
        //                         alert(res.msg);
        //                         file.value = '';
        //                     }
        //                 });
        //         }

    }














    // 新增门店全选按钮
    checkAll_addStore(value) {

        this.addStore.indeterminate = false;

        if (value) {
            this.addStore.data_Set.forEach(data => {
                data.checked = true;

                this.goodSubmit.regions.push({
                    region_code: data.code,
                    region_name: data.name,
                    city: data.city
                });

            });
        } else {
            this.addStore.data_Set.forEach(data => {
                data.checked = false;

                for (let i = 0; i < this.goodSubmit.regions.length; i++) {

                    if (data.code === this.goodSubmit.regions[i].region_code) {
                        this.goodSubmit.regions.splice(i, 1);

                    }
                }

            });
        }

        // 去重
        const obj = {};
        this.goodSubmit.regions = this.goodSubmit.regions.reduce(function (pre, cur) {

            if (!obj[cur.region_code]) {
                obj[cur.region_code] = true;
                pre.push(cur);
            }
            return pre;
        }, []);


        this.addStore.num = this.goodSubmit.regions.length;

    }


    // 新增门店多选按钮
    checkMultiple_addStore(event = null, data = null) {

        const allChecked = this.addStore.data_Set.every(value => value.checked === true);
        const allUnChecked = this.addStore.data_Set.every(value => !value.checked);

        if (this.addStore.data_Set.length === 0) {
            this.addStore.allChecked = false;
        } else {
            this.addStore.allChecked = allChecked;
        }

        this.addStore.indeterminate = (!allChecked) && (!allUnChecked);

        if (event) {
            this.goodSubmit.regions.push({
                region_code: data.code,
                region_name: data.name,
                city: data.city
            });
        } else {
            for (let i = 0; i < this.goodSubmit.regions.length; i++) {

                if (data.code === this.goodSubmit.regions[i].region_code) {
                    this.goodSubmit.regions.splice(i, 1);

                }
            }
        }
        this.addStore.num = this.goodSubmit.regions.length;
    }



    // 新增门店翻页回调
    pageOver_addStore() {
        this.isSearchStore();
    }


    // 促销门店全选按钮
    checkAll_storeList(value) {

        if (value) {
            this.storeList.data_Set.forEach(data => {
                data.checked = true;
            });

        } else {
            this.storeList.data_Set.forEach(data => {
                data.checked = false;
            });
        }
        this.checkMultiple_storeList();
    }


    // 促销门店多选按钮
    checkMultiple_storeList() {

        const allChecked = this.storeList.data_Set.every(value => value.checked === true);
        const allUnChecked = this.storeList.data_Set.every(value => !value.checked);

        if (this.storeList.data_Set.length === 0) {
            this.storeList.allChecked = false;
        } else {
            this.storeList.allChecked = allChecked;
        }

        this.storeList.indeterminate = (!allChecked) && (!allUnChecked);

        const storeList = this.storeList.data_Set.filter(value => value.checked);   // 过滤

        this.deleteStore_params.regions = [];
        for (const tmp of storeList) {
            this.deleteStore_params.regions.push(tmp.region_code);
        }

        this.storeList.num = this.deleteStore_params.regions.length;

    }


    // 新增商品全选按钮
    checkAll_addCommodity(value) {

        this.addCommodity.indeterminate = false;

        if (value) {
            this.addCommodity.data_Set.forEach(data => {
                data.checked = true;

                this.addCommody_params.search.region_items.push({
                    barcode: data.barcode,
                    item_code: data.item_code,
                });

            });
        } else {
            this.addCommodity.data_Set.forEach(data => {
                data.checked = false;

                for (let i = 0; i < this.addCommody_params.search.region_items.length; i++) {

                    if (data.barcode === this.addCommody_params.search.region_items[i].barcode
                        && data.item_code === this.addCommody_params.search.region_items[i].item_code) {

                        this.addCommody_params.search.region_items.splice(i, 1);

                    }
                }

            });
        }

        // 去重
        const obj = {};
        this.addCommody_params.search.region_items = this.addCommody_params.search.region_items.reduce(function (pre, cur) {

            if (!obj[cur.barcode] && !obj[cur.item_code]) {
                obj[cur.item_code] = true;
                pre.push(cur);
            }
            return pre;
        }, []);

        this.addCommodity.num = this.addCommody_params.search.region_items.length;

    }


    // 新增商品多选按钮
    checkMultiple_addCommodity(event = null, data = null) {

        const allChecked = this.addCommodity.data_Set.every(value => value.checked === true);
        const allUnChecked = this.addCommodity.data_Set.every(value => !value.checked);

        if (this.addCommodity.data_Set.length === 0) {
            this.addCommodity.allChecked = false;
        } else {
            this.addCommodity.allChecked = allChecked;
        }

        this.addCommodity.indeterminate = (!allChecked) && (!allUnChecked);

        if (event) {
            this.addCommody_params.search.region_items.push({
                barcode: data.barcode,
                item_code: data.item_code,
            });

        } else {
            for (let i = 0; i < this.addCommody_params.search.region_items.length; i++) {

                if (data.barcode === this.addCommody_params.search.region_items[i].barcode
                    && data.item_code === this.addCommody_params.search.region_items[i].item_code) {

                    this.addCommody_params.search.region_items.splice(i, 1);

                }
            }
        }
        this.addCommodity.num = this.addCommody_params.search.region_items.length;
    }


    // 新增商品翻页回调
    pageOver_addCommodity() {

        this.commodity_params.page_no = this.addCommodity.PageIndex;
        this.commodity_params.page_size = this.addCommodity.Pagesize;

        this.issearchCommodity();
    }


    // 促销门店全选按钮
    checkAll_commodityList(value) {

        if (value) {
            this.commodityList.data_Set.forEach(data => {
                data.checked = true;
            });

        } else {
            this.commodityList.data_Set.forEach(data => {
                data.checked = false;
            });
        }
        this.checkMultiple_commodityList();
    }


    // 促销门店多选按钮
    checkMultiple_commodityList() {

        const allChecked = this.commodityList.data_Set.every(value => value.checked === true);
        const allUnChecked = this.commodityList.data_Set.every(value => !value.checked);

        if (this.commodityList.data_Set.length === 0) {
            this.commodityList.allChecked = false;
        } else {
            this.commodityList.allChecked = allChecked;
        }

        this.commodityList.indeterminate = (!allChecked) && (!allUnChecked);

        const commodityList = this.commodityList.data_Set.filter(value => value.checked);   // 过滤

        this.commodityList.region_items = [];
        for (const tmp of commodityList) {
            this.commodityList.region_items.push(tmp);
        }

        this.commodityList.num = this.commodityList.region_items.length;

    }











    // 公共接口
    // 查询门店接口
    isSearchStore() {
        // console.log(this.storeValueInput);

        const opt = {
            search: this.store_params,
            page_no: this.addStore.PageIndex,
            page_size: this.addStore.Pagesize,
            sort: 'code',
            sortDirKey: 'ASC'
        };

        this.http.getorderdetails.request(opt)
            .subscribe(res => {

                this.addStore.data_Set = res['rows'];

                for (let i = 0; i < this.addStore.data_Set.length; i++) {

                    for (let j = 0; j < this.goodSubmit.regions.length; j++) {

                        if (this.addStore.data_Set[i].code === this.goodSubmit.regions[j].region_code) {

                            this.addStore.data_Set[i].checked = true;
                        }

                    }
                }
            });

    }


    // 查询门店count接口
    isStoreCount() {

        const opt = {
            search: this.store_params,
        };

        this.http.getstorecount.request(opt)
            .subscribe(res => {

                this.addStore.count = res['count'];
            });
    }


    // 确认新增门店
    isaddStore() {

        this.http.addStore.request(this.goodSubmit)
            .subscribe(res => {

                this.goodSubmit.pd_code = res['pd_code'];

                if (res['code'] === 0) {

                    if (res['msg'].constructor === Array) {
                        let str = '';
                        res['msg'].forEach(item => str += item + '<br>');

                        const modal: NzModalRef = this.modalService.error({
                            nzTitle: '冲突提示：',
                            nzContent: `<h3>${str}</h3>`,
                            nzWidth: '450',
                            nzStyle: { top: `50px` },
                        });

                    }

                    this.isStoreList();

                } else {

                    this.message.error(res['msg'], { nzDuration: 2000 });
                }
            });

    }


    // 新增后的门店
    isStoreList() {

        this.http.getAddStore.request({ search: { pd_code: this.goodSubmit.pd_code }, page_no: 1, page_size: 20 })
            .subscribe(res => {

                if (res['code'] === 0) {
                    this.storeList.data_Set = res['data'].stores;
                    this.storeList.count = res['data'].count;

                    // 清除缓存
                    this.storeList.allChecked = false;
                    this.storeList.indeterminate = false;
                    this.storeList.num = 0;

                } else {
                    // this.message.error(res['msg'], { nzDuration: 2000 });
                }
            });

    }


    // 批量/单个删除门店
    isDeleteStore() {

        const modal: NzModalRef = this.modalService.warning({
            nzTitle: '门店删除提示：',
            nzContent: '<h3>是否删除所选门店？</h3>',
            nzWidth: '450',
            nzStyle: { top: `50px` },
            nzCancelText: '否',
            nzOkText: '是',
            nzOnOk: () => {
                this.http.deletePushStore.request(this.deleteStore_params)
                    .subscribe(res => {

                        if (res['code'] === 0) {

                            this.isStoreList();

                            // 清除缓存
                            this.storeList.allChecked = false;
                            this.storeList.indeterminate = false;
                            this.storeList.num = 0;
                            this.deleteStore_params.regions = [];

                            this.issearchPushCommodity();

                        } else {
                            this.message.error(res['msg'], { nzDuration: 2000 });
                        }
                    });
            },
            // nzOnCancel: () => {
            //     // 清除缓存
            //     this.deleteStore_params.regions = [];
            // }
        });

    }


    // 商品分类
    isOnline(value) {
        this.http.getFirstOnlineCategories.request({ parent: value })
            .subscribe(res => {

                if (value === 0) {  // 一级分类
                    this.online.onlinelist_one = res;

                } else {    // 二级分类

                    this.online.onlinelist_two = res;

                    if (res['length'] !== 0) {
                        this.select_two = this.online.onlinelist_two[0].code;  // 二级分类默认为第一个
                        this.online.isDisable = false;

                    } else {

                        this.online.onlinelist_two.push({
                            code: this.select_one,
                            name: '暂无二级分类',
                            index: 100
                        });
                        this.select_two = this.online.onlinelist_two[0].code;
                        this.online.isDisable = true;
                    }
                }

            });
    }


    // 查询商品
    issearchCommodity() {

        this.http.searchCommodity.request(this.commodity_params)
            .subscribe(res => {

                if (res['code'] === 0) {
                    // 清除缓存
                    this.addCommodity.regions = [];

                    this.addCommodity.data_Set = res['data'].region_items;
                    this.addCommodity.count = res['data'].count;


                    for (let i = 0; i < this.addCommodity.data_Set.length; i++) {

                        for (let j = 0; j < this.addCommody_params.search.region_items.length; j++) {

                            if (this.addCommodity.data_Set[i].barcode === this.addCommody_params.search.region_items[j].barcode &&
                                this.addCommodity.data_Set[i].item_code === this.addCommody_params.search.region_items[j].item_code) {


                                this.addCommodity.data_Set[i].checked = true;
                            }

                        }
                    }

                } else {
                    this.message.error(res['msg'], { nzDuration: 2000 });

                    // 清除缓存
                    this.addCommodity.regions = [];
                }
            });
    }


    // 添加商品
    isaddCommodity() {

        // 添加条件
        this.addCommody_params.search.pd_code = this.goodSubmit.pd_code;
        this.storeList.data_Set.forEach(data => {
            this.addCommody_params.search.regions.push(data.region_code);
        });

        this.http.addSearchCommodity.request(this.addCommody_params)
            .subscribe(res => {

                if (res['code'] === 0) {
                    // 清除缓存
                    this.addCommody_params.search.regions = [];
                    this.searchCommodity.search.region_code = '';
                    this.searchCommodity.search.region_name = '';
                    this.searchCommodity.search.item_code = '';
                    this.searchCommodity.search.item_name = '';

                    this.issearchPushCommodity();

                } else {
                    this.message.error(res['msg'], { nzDuration: 2000 });

                    // 清除缓存
                    this.addCommody_params.search.regions = [];
                }
            });
    }


    // 新增后的商品
    issearchPushCommodity() {

        this.searchCommodity.search.pd_code = this.goodSubmit.pd_code;

        this.http.searchPushCommodity.request(this.searchCommodity)
            .subscribe(res => {

                if (res['code'] === 0) {
                    this.commodityList.data_Set = res['data'].items;
                    this.commodityList.count = res['data'].count;


                    for (const tmp of this.commodityList.data_Set) {
                        tmp.borderColor = '';
                        tmp.isSave = true;
                    }

                    // 清除缓存
                    this.commodityList.allChecked = false;
                    this.commodityList.indeterminate = false;
                    this.commodityList.num = 0;

                    console.log(this.commodityList.data_Set);

                } else {
                    this.message.error(res['msg'], { nzDuration: 2000 });
                }
            });
    }


    // 批量删除商品
    isdeletePushCommodity() {

        const modal: NzModalRef = this.modalService.warning({
            nzTitle: '商品删除提示：',
            nzContent: '<h3>是否删除所选中的商品？</h3>',
            nzWidth: '450',
            nzStyle: { top: `50px` },
            nzCancelText: '否',
            nzOkText: '是',
            nzOnOk: () => {
                this.http.deletePushCommodity.request({ data: this.commodityList.region_items })
                    .subscribe(res => {

                        if (res['code'] === 0) {
                            // 清除缓存
                            this.commodityList.region_items = [];

                            this.issearchPushCommodity();

                        } else {
                            this.message.error(res['msg'], { nzDuration: 2000 });
                        }
                    });
            },
            // nzOnCancel: () => {
            //     // 清除缓存
            //     this.commodityList.region_items = [];
            // }
        });
    }


    // 单个删除商品
    isdeleteCommodity(id) {

        const modal: NzModalRef = this.modalService.warning({
            nzTitle: '商品删除提示：',
            nzContent: '<h3>是否删除此商品？</h3>',
            nzWidth: '450',
            nzStyle: { top: `50px` },
            nzCancelText: '否',
            nzOkText: '是',
            nzOnOk: () => {
                this.http.deleteCommodity.request({ _id: id })
                    .subscribe(res => {
                        if (res['code'] === 0) {
                            // 清除缓存
                            // this.commodityList.region_items = [];

                            this.issearchPushCommodity();

                        } else {
                            this.message.error(res['msg'], { nzDuration: 2000 });
                        }
                    });
            },
            // nzOnCancel: () => {
            //     // 清除缓存
            //     this.commodityList.region_items = [];
            // }
        });

    }


    // 批量设置或活动价/折扣
    iscompilePushPrice() {
        this.http.compilePushPrice.request({ data: this.commodityList.region_items })
            .subscribe(res => {
                if (res['code'] === 0) {
                    // 清除缓存
                    this.commodityList.region_items = [];

                    this.issearchPushCommodity();

                } else {
                    this.message.error(res['msg'], { nzDuration: 2000 });
                }
            });
    }


    // 保存
    isSave() {
        this.http.operation.request()
            .subscribe(res => {
                // const opt = {
                //     pd_code: this.pd_code,
                //     data_status: '1',
                //     promotion_channel: this.promotion_channel,
                //     auditor: 'ceshi',   // 创建者
                //     pd_name: this.goodSubmit.pd_name,    // 活动名称
                //     begin_date: this.goodSubmit.begin_date,  // 开始时间
                //     end_date: this.goodSubmit.end_date, // 结束时间
                // };

                // this.goodsDepreciateService.saveInfo(opt)
                //     .then(res => {
                //         console.log(res);

                //         if (res.code === 0) {
                //             // this.current = 2;   // 步骤条
                //             // this.activityGoods = '4'; // 完成页面

                //             if (res.data.item_msg.length !== 0) {
                //                 let str = '';
                //                 res.data.item_msg.forEach(item => str += item + '\r\n');
                //                 // console.log(str);
                //                 alert(str);
                //             } else {
                //                 this.current = 2;   // 步骤条
                //                 this.activityGoods = '4'; // 完成页面
                //             }
                //         } else {
                //             alert(res.msg);
                //         }
                //     });
            });
    }







    //     // ---------------------------------------------------- 保存提交按钮 -----------------------------------------------------

    //     // 仅保存按钮
    //     onSave() {
    //         // alert('保存成功');
    //         // this._message.create('success', '保存成功');

    //         if (this.additionBody === '1') {    // 手动添加
    //             if (this._dataSet.length === 0 || this.dataSet_Commodity.length === 0) {

    //                 alert('请先将列表信息补充完整');
    //             } else {

    //                 // console.log(this.dataSet_Commodity);
    //                 // console.log(this.dataSet_Commodity.every(value => !value.isSave))

    //                 if (!this.dataSet_Commodity.every(value => value.price)) {

    //                     alert('您有单个或多个商品的活动价为空，请填写');
    //                 } else if (this.dataSet_Commodity.filter(item => item.price >= item.sale_price).length !== 0) {

    //                     alert('您有单个或多个商品的活动价大于或等于原价，请重新填写');
    //                 } else if (!this.dataSet_Commodity.every(value => value.isSave)) {

    //                     alert('请先保存所修改的活动价');
    //                 } else {
    //                     // console.log('好');

    //                     const opt = {
    //                         pd_code: this.pd_code,
    //                         data_status: '1',
    //                         promotion_channel: this.promotion_channel,
    //                         auditor: 'ceshi',   // 创建者
    //                         pd_name: this.goodSubmit.pd_name,    // 活动名称
    //                         begin_date: this.goodSubmit.begin_date,  // 开始时间
    //                         end_date: this.goodSubmit.end_date, // 结束时间
    //                     };

    //                     this.goodsDepreciateService.saveInfo(opt)
    //                         .then(res => {
    //                             console.log(res);

    //                             if (res.code === 0) {
    //                                 // this.current = 2;   // 步骤条
    //                                 // this.activityGoods = '4'; // 完成页面

    //                                 if (res.data.item_msg.length !== 0) {
    //                                     let str = '';
    //                                     res.data.item_msg.forEach(item => str += item + '\r\n');
    //                                     // console.log(str);
    //                                     alert(str);
    //                                 } else {
    //                                     this.current = 2;   // 步骤条
    //                                     this.activityGoods = '4'; // 完成页面
    //                                 }
    //                             } else {
    //                                 alert(res.msg);
    //                             }
    //                         });
    //                 }

    //             }
    //         } else {    // 批量导入
    //             if (this.dataSet_Commodity.length === 0) {
    //                 alert('请先将列表信息补充完整');
    //             } else {
    //                 // console.log(this.dataSet_Commodity);
    //                 if (!this.dataSet_Commodity.every(value => value.price)) {

    //                     alert('您有单个或多个商品的活动价为空，请填写');
    //                 } else if (this.dataSet_Commodity.filter(item => item.price >= item.sale_price).length !== 0) {

    //                     alert('您有单个或多个商品的活动价大于或等于原价，请重新填写');
    //                 } else if (!this.dataSet_Commodity.every(value => value.isSave)) {

    //                     alert('请先保存所修改的活动价');
    //                 } else {
    //                     const opt = {
    //                         pd_code: this.pd_code,
    //                         data_status: '1',
    //                         promotion_channel: this.promotion_channel,
    //                         auditor: 'ceshi',   // 创建者
    //                         pd_name: this.goodSubmit.pd_name,    // 活动名称
    //                         begin_date: this.goodSubmit.begin_date,  // 开始时间
    //                         end_date: this.goodSubmit.end_date, // 结束时间
    //                     };

    //                     this.goodsDepreciateService.saveInfo(opt)
    //                         .then(res => {
    //                             console.log(res);

    //                             if (res.code === 0) {
    //                                 // this.current = 2;   // 步骤条
    //                                 // this.activityGoods = '4'; // 完成页面

    //                                 if (res.data.item_msg.length !== 0) {
    //                                     let str = '';
    //                                     res.data.item_msg.forEach(item => str += item + '\r\n');
    //                                     // console.log(str);
    //                                     alert(str);
    //                                 } else {
    //                                     this.current = 2;   // 步骤条
    //                                     this.activityGoods = '4'; // 完成页面
    //                                 }
    //                             } else {
    //                                 alert(res.msg);
    //                             }
    //                         });
    //                 }
    //             }
    //         }


    //         // 本地存储数据
    //         // const StoreList = JSON.stringify(this._dataSet);
    //         // window.localStorage.setItem('temp', StoreList);
    //     }

    //     // 保存并提交按钮
    //     onSaveSubmit() {

    //         if (this.additionBody === '1') {
    //             if (this._dataSet.length === 0 || this.dataSet_Commodity.length === 0) {
    //                 alert('请先将列表信息补充完整');
    //             } else {

    //                 if (!this.dataSet_Commodity.every(value => value.price)) {

    //                     alert('您有单个或多个商品的活动价为空，请填写');
    //                 } else if (this.dataSet_Commodity.filter(item => item.price >= item.sale_price).length !== 0) {

    //                     alert('您有单个或多个商品的活动价大于或等于原价，请重新填写');
    //                 } else if (!this.dataSet_Commodity.every(value => value.isSave)) {

    //                     alert('请先保存所修改的活动价');
    //                 } else {
    //                     const opt = {
    //                         pd_code: this.pd_code,
    //                         data_status: '2',
    //                         promotion_channel: this.promotion_channel,
    //                         auditor: 'ceshi',   // 创建者
    //                         pd_name: this.goodSubmit.pd_name,    // 活动名称
    //                         begin_date: this.goodSubmit.begin_date,  // 开始时间
    //                         end_date: this.goodSubmit.end_date, // 结束时间
    //                     };

    //                     this.goodsDepreciateService.saveInfo(opt)
    //                         .then(res => {
    //                             console.log(res);

    //                             if (res.code === 0) {
    //                                 // this.current = 2;   // 步骤条
    //                                 // this.activityGoods = '4'; // 完成页面

    //                                 if (res.data.item_msg.length !== 0) {
    //                                     let str = '';
    //                                     res.data.item_msg.forEach(item => str += item + '\r\n');
    //                                     // console.log(str);
    //                                     alert(str);
    //                                 } else {
    //                                     this.current = 2;   // 步骤条
    //                                     this.activityGoods = '4'; // 完成页面
    //                                 }
    //                             } else {
    //                                 alert(res.msg);
    //                             }
    //                         });

    //                 }
    //             }
    //         } else {
    //             if (this.dataSet_Commodity.length === 0) {
    //                 alert('请先将列表信息补充完整');
    //             } else {

    //                 if (!this.dataSet_Commodity.every(value => value.price)) {

    //                     alert('您有单个或多个商品的活动价为空，请填写');
    //                 } else if (this.dataSet_Commodity.filter(item => item.price >= item.sale_price).length !== 0) {

    //                     alert('您有单个或多个商品的活动价大于或等于原价，请重新填写');
    //                 } else if (!this.dataSet_Commodity.every(value => value.isSave)) {

    //                     alert('请先保存所修改的活动价');
    //                 } else {
    //                     const opt = {
    //                         pd_code: this.pd_code,
    //                         data_status: '2',
    //                         promotion_channel: this.promotion_channel,
    //                         auditor: 'ceshi',   // 创建者
    //                         pd_name: this.goodSubmit.pd_name,    // 活动名称
    //                         begin_date: this.goodSubmit.begin_date,  // 开始时间
    //                         end_date: this.goodSubmit.end_date, // 结束时间
    //                     };

    //                     this.goodsDepreciateService.saveInfo(opt)
    //                         .then(res => {
    //                             console.log(res);

    //                             if (res.code === 0) {
    //                                 // this.current = 2;   // 步骤条
    //                                 // this.activityGoods = '4'; // 完成页面

    //                                 if (res.data.item_msg.length !== 0) {
    //                                     let str = '';
    //                                     res.data.item_msg.forEach(item => str += item + '\r\n');
    //                                     // console.log(str);
    //                                     alert(str);
    //                                 } else {
    //                                     this.current = 2;   // 步骤条
    //                                     this.activityGoods = '4'; // 完成页面
    //                                 }
    //                             } else {
    //                                 alert(res.msg);
    //                             }
    //                         });

    //                 }
    //             }
    //         }


    //     }








    //     // ------------------------------------------- 确定/取消对话框 -----------------------------------------------------------------

    //     // 新增门店确定对话框按钮
    //     handleOk() {

    //         if (this.settingTitle === '新增门店') {

    //             // console.log('新增门店');

    //             // console.log(this.addStoreList);


    //             const opt = {
    //                 pd_code: this.pd_code,
    //                 auditor: 'ceshi',   // 创建者
    //                 pd_name: this.goodSubmit.pd_name,    // 活动名称
    //                 begin_date: this.goodSubmit.begin_date,  // 开始时间
    //                 end_date: this.goodSubmit.end_date, // 结束时间
    //                 promotion_channel: this.promotion_channel,
    //                 source_type: this.promotion_channel.source_type,
    //                 regions: this.addStoreList
    //             };
    //             // console.log(opt);



    //             this.goodsDepreciateService.addStore(opt)
    //                 .then(res => {

    //                     if (res.code === 0) {

    //                         this.pd_code = res.pd_code;
    //                         this.nzCount_addStore = res.count;
    //                         if (res.msg !== '添加门店成功') {
    //                             if (res.msg.constructor === Array) {
    //                                 let str = '';
    //                                 res.msg.forEach(item => str += item + '\r\n');
    //                                 // console.log(str);
    //                                 alert(str);
    //                             }
    //                         }
    //                         this.getAddStorelist();

    //                     } else {

    //                         alert(res.msg);

    //                         this.getAddStorelist();
    //                     }

    //                 });

    //             this.isSettingVisible = false;




    //         } else if (this.settingTitle === '新增商品') {
    //             // console.log('新增商品');

    //             // console.log(this.addCommodityList);

    //             const opt = {
    //                 search: {
    //                     regions: this.commodityStorelist,
    //                     pd_code: this.pd_code,
    //                     region_items: this.addCommodityList
    //                 },
    //                 page_no: this.nzPageIndex_commody,
    //                 page_size: this.nzPagesize_commody,
    //                 sort: 'region_code',
    //                 sortDirKey: 'ASC'
    //             };

    //             this.goodsDepreciateService.addSearchCommodity(opt)
    //                 .then(res => {
    //                     // console.log(res);

    //                     if (res.code === 0) {
    //                         this.dataSet_Commodity = res.data.items;
    //                         this.nzCount_commody = res.data.count;

    //                         // for (const tmp of this.dataSet_Commodity) {
    //                         //     tmp.btnfous = true;
    //                         // }
    //                     } else {
    //                         alert(res.msg);
    //                     }

    //                 });

    //             this.isSettingVisible = false;





    //         } else if (this.settingTitle === '批量设置折扣') {
    //             // console.log('批量设置折扣');
    //             const resel_num = /^((0\.[1-9]{1})|(([1-9]{1})(\.\d{1})?))$/ ;

    //             if (!resel_num.test(this.discount)) {
    //                 alert('请正确输入折扣的格式：只能为1-10之间的整数或保留小数点后一位的数字');

    //             } else {

    //                 const commodityList = this.dataSet_Commodity.filter(value => value.checked);

    //                 for (const tmp of commodityList) {
    //                     this.commodityCode.push({
    //                         discount: Number(this.discount),
    //                         _id: tmp._id,
    //                         sale_price: tmp.sale_price
    //                     });
    //                 }
    //                 // console.log(this.commodityCode);

    //                 const opt = {
    //                     data: this.commodityCode
    //                 };

    //                 this.goodsDepreciateService.compilePushPrice(opt)
    //                     .then(res => {
    //                         console.log(res);

    //                         if (res.code === 0) {
    //                             alert('批量设置折扣成功');

    //                             this.getAddCommodity(this.searchValue.region_code, this.searchValue.region_name,
    //                                 this.searchValue.item_code, this.searchValue.item_name);

    //                             this.allChecked_Commodity = false;
    //                         } else {
    //                             alert(res.msg);
    //                         }
    //                     });

    //                 this.isSettingVisible = false;

    //             }




    //         } else if (this.settingTitle === '批量设置活动价') {
    //             // console.log('批量设置活动价');
    //             const resel_num = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/;
    //             const commodityList = this.dataSet_Commodity.filter(value => value.checked);

    //             if (!resel_num.test(this.price)) {
    //                 alert('请正确输入活动价的格式：只能为整数或保留小数点后两位的数字');

    //             } else {

    //                 for (const tmp of commodityList) {
    //                     this.commodityCode.push({
    //                         price: Number(this.price),
    //                         _id: tmp._id
    //                     });
    //                 }
    //                 // console.log(this.commodityCode);

    //                 const opt = {
    //                     data: this.commodityCode
    //                 };

    //                 this.goodsDepreciateService.compilePushPrice(opt)
    //                     .then(res => {
    //                         console.log(res);

    //                         if (res.code === 0) {
    //                             // alert('批量设置活动价成功');
    //                             alert(res.msg);

    //                             this.getAddCommodity(this.searchValue.region_code, this.searchValue.region_name,
    //                                 this.searchValue.item_code, this.searchValue.item_name);

    //                             this.allChecked_Commodity = false;
    //                             this.indeterminate_Commodity = false;
    //                         } else {
    //                             alert(res.msg);
    //                         }
    //                     });

    //                 this.isSettingVisible = false;

    //             }

    //         }


    //         // this.isSettingVisible = false;
    //         // 去除弹窗中的缓存 hxy
    //         // console.log(this.settingTitle);
    //         if (this.settingTitle === '新增门店') {
    //             this.addStoreList = [];
    //             this.storeList.forEach(item => item.checked = false);
    //             this.storeListNum = 0;
    //             this.allChecked_StoreList = false;
    //             this.indeterminate_StoreList = false;
    //         } else if (this.settingTitle === '新增商品') {
    //             this.addCommodityList = [];
    //             this.commodityList.forEach(item => item.checked = false);
    //             this.commodityListNum = 0;
    //             this.allChecked_CommodityList = false;
    //             this.indeterminate_CommodityList = false;
    //         }


    //         this.commodityStorelist = [];
    //         this.commodityCode = [];
    //     }







    //     // ----------------------------------------------- 门店商品上传 -------------------------------------------------------

    //     region_count: any;  // 门店数量
    //     // 门店商品导入
    //     promotionimport(file: HTMLInputElement): void {

    //         // console.log(file.files[0]);
    //         // console.log(file.files[0].name);    // 文件名
    //         // console.log(file.files[0].size);    // 字节
    //         const form = new FormData();
    //         // console.log(file);
    //         this.fileName = file.files[0].name;
    //         form.append('file', file.files[0], file.files[0].name);
    //         // console.log(form);

    //         const data = {
    //             pd_code: this.pd_code,
    //             auditor: 'ceshi',   // 创建者
    //             pd_name: this.goodSubmit.pd_name,    // 活动名称
    //             begin_date: this.goodSubmit.begin_date,  // 开始时间
    //             end_date: this.goodSubmit.end_date, // 结束时间
    //             promotion_channel: this.promotion_channel,
    //             source_type: this.promotion_channel.source_type,
    //         };

    //         if (file.files[0].name.indexOf('.xlsx') === -1) {
    //             alert('请导入正确的 Excel 文件');
    //             // this.fileName = ''
    //         } else {
    //             this.goodsDepreciateService.uploading(form, data)
    //                 .then(res => {
    //                     console.log(res);

    //                     if (res.code === 0) {
    //                         alert(res.msg);

    //                         this.pd_code = res.data.pd_code;
    //                         this.region_count = res.data.region_count;

    //                         if (res.data.item_msg && res.data.item_msg.length !== 0) {
    //                             let str = '';
    //                             res.data.item_msg.forEach(item => str += item + '\r\n');
    //                             // console.log(str);
    //                             alert(str);
    //                         }

    //                         // 商品列表接口
    //                         this.getAddCommodity(this.searchValue.region_code, this.searchValue.region_name,
    //                             this.searchValue.item_code, this.searchValue.item_name);

    //                         file.value = '';    // 清除input上传文件缓存
    //                     } else {
    //                         alert(res.msg);
    //                         file.value = '';
    //                     }
    //                 });
    //         }

    //     }







    //     // --------------------------------------------------- 新增门店对话框 -------------------------------------------------
    //     // 门店下拉框
    //     onSelectStore() {
    //         // console.log(this.storeValue);
    //         this.storeValueInput = '';  // 输入框内容
    //         this.storeValueInput = '';  // 输入框内容
    //         this.allChecked_StoreList = false;
    //         this.indeterminate_StoreList = false;

    //         if (this.storeValue === '0') {
    //             this.placeholderStore = '请输入门店编码，多项用英文逗号隔开';
    //         } else if (this.storeValue === '1') {
    //             this.placeholderStore = '请输入门店名称，多项用英文逗号隔开';
    //         }
    //     }

    //     // 门店查询
    //     onSearchStore() {

    //         this.nzPageIndex_store = 1;
    //         this.SearchStore();
    //         this.storeCount();
    //     }

    //     // 门店全选按钮
    //     checkAll_StoreList(value) {

    //         if (value) {
    //             this.storeList.forEach(data => {
    //                 data.checked = true;

    //                 this.addStoreList.push({
    //                     region_code: data.code,
    //                     region_name: data.name,
    //                     city: data.city
    //                 });

    //             });
    //         } else {
    //             this.storeList.forEach(data => {
    //                 data.checked = false;

    //                 for (let i = 0; i < this.addStoreList.length; i++) {
    //                     // console.log(data);
    //                     // console.log(this.addStoreList[i]);
    //                     if (data.code === this.addStoreList[i].region_code) {
    //                         this.addStoreList.splice(i, 1);

    //                     }
    //                 }

    //             });
    //         }
    //         // this.refreshStatus_StoreList(value);
    //         this.storeListNum = this.addStoreList.length;

    //     }

    //     // 门店多选按钮，翻页按钮，当前页
    //     refreshStatus_StoreList(event = null, data = null) {

    //         const allChecked = this.storeList.every(value => value.checked === true);
    //         const allUnChecked = this.storeList.every(value => !value.checked);

    //         if (this.storeList.length === 0) {
    //             this.allChecked_StoreList = false;
    //         } else {
    //             this.allChecked_StoreList = allChecked;
    //         }

    //         this.indeterminate_StoreList = (!allChecked) && (!allUnChecked);
    //         if (event) {
    //             this.addStoreList.push({
    //                 region_code: data.code,
    //                 region_name: data.name,
    //                 city: data.city
    //             });
    //         } else {
    //             for (let i = 0; i < this.addStoreList.length; i++) {
    //                 // console.log(data);
    //                 // console.log(this.addStoreList[i]);
    //                 if (data.code === this.addStoreList[i].region_code) {
    //                     this.addStoreList.splice(i, 1);

    //                 }
    //             }
    //         }
    //         this.storeListNum = this.addStoreList.length;


    //     }



    //     // 翻页回调
    //     refreshStatus_StoreList_Index($event) {
    //         // this.nzPageIndex_store = $event;

    //         this.SearchStore();
    //         // this.addStoreList = [];
    //         // this.storeListNum = 0;
    //         // this.allChecked_StoreList = false;
    //         // this.indeterminate_StoreList = false;

    //     }








    //     // ---------------------------------------------------------- 新增商品对话框 -------------------------------------------
    //     // 商品下拉框
    //     onSelectCommodity() {
    //         // console.log(this.commodityValue);

    //         this.commodityValueInput_barcode = '';  // 输入框内容
    //         this.commodityValueInput_code = '';
    //         this.commodityValueInput_name = '';
    //         this.onlineleveSelect = '';
    //         this.onlineSelect = '';
    //         this.allChecked_CommodityList = false;
    //         this.indeterminate_CommodityList = false;
    //         this.commodityList = [];

    //         if (this.commodityValue === '0') {
    //             this.placeholderCommodity = '请输入商品编码，多项用英文逗号隔开';

    //         } else if (this.commodityValue === '3') {
    //             this.placeholderCommodity = '请输入商品条码，多项用英文逗号隔开';

    //         } else if (this.commodityValue === '4') {
    //             this.placeholderCommodity = '请输入商品名称，多项用英文逗号隔开';

    //         }
    //     }

    //     // 一级分类
    //     onSelectonline(params) {

    //         const opt = {
    //             parent: params
    //         };
    //         this.goodsDepreciateService.onlineList(opt)
    //             .then(res => {
    //                 console.log(res);
    //                 if (res.length !== 0) {
    //                     this.onlinelevelist = res;
    //                     this.onlineleveSelect = this.onlinelevelist[0].code;
    //                     this.isOnlineDis = false;
    //                     this.background = '';
    //                     this.onlineTitle = '请选择二级分类';
    //                     this.opacity = '1';
    //                 } else {
    //                     this.onlinelevelist = res;
    //                     this.onlinelevelist.push({
    //                         code: this.onlineSelect,
    //                         name: '暂无商品分类'
    //                     });
    //                     this.onlineleveSelect = this.onlinelevelist[0].code;
    //                     this.onlineSelect = '0';
    //                     this.isOnlineDis = true;
    //                     this.background = '#eee';
    //                     this.onlineTitle = '暂无商品分类';
    //                     this.opacity = '0.6';
    //                 }
    //             });
    //     }

    //     // 商品查询按钮
    //     onSearchCommodity() {
    //         this.nzPageIndex = 1;
    //         this.SearchCommodity();
    //     }

    //     // 商品全选按钮
    //     checkAll_CommodityList(value) {


    //         if (value) {
    //             this.commodityList.forEach(data => {
    //                 data.checked = true;
    //                 this.addCommodityList.push({
    //                     barcode: data.barcode,
    //                     item_code: data.item_code
    //                 });
    //             });
    //         } else {
    //             this.commodityList.forEach(data => {
    //                 data.checked = false;
    //                 for (let i = 0; i < this.addCommodityList.length; i++) {
    //                     if (data.barcode === this.addCommodityList[i].barcode) {
    //                         this.addCommodityList.splice(i, 1);

    //                     }
    //                 }
    //             });
    //         }
    //         this.commodityListNum = this.addCommodityList.length;
    //         // console.log(this.addCommodityList);
    //     }

    //     // 商品多选按钮，翻页按钮
    //     refreshStatus_CommodityList(event = null, data = null) {

    //         // console.log();
    //         const allChecked = this.commodityList.every(value => value.checked === true);
    //         const allUnChecked = this.commodityList.every(value => !value.checked);

    //         if (this.commodityList.length === 0) {
    //             this.allChecked_CommodityList = false;
    //         } else {
    //             this.allChecked_CommodityList = allChecked;
    //         }

    //         this.indeterminate_CommodityList = (!allChecked) && (!allUnChecked);
    //         // this.commodityListNum = this.commodityList.filter(value => value.checked).length;

    //         // const storeList = this.commodityList.filter(value => value.checked);
    //         // console.log(storeList);
    //         // this.addCommodityList = [];
    //         // for (const tmp of storeList) {
    //         //     this.addCommodityList.push({
    //         //         barcode: tmp.barcode,
    //         //         item_code: tmp.item_code
    //         //     });
    //         // }

    //         if (event) {
    //             this.addCommodityList.push({
    //                 barcode: data.barcode,
    //                 item_code: data.item_code
    //             });
    //         } else {
    //             for (let i = 0; i < this.addCommodityList.length; i++) {
    //                 // console.log(data);
    //                 // console.log(this.addStoreList[i]);
    //                 if (data.barcode === this.addCommodityList[i].barcode) {
    //                     this.addCommodityList.splice(i, 1);

    //                 }
    //             }
    //         }
    //         this.commodityListNum = this.addCommodityList.length;
    //         // console.log(this.addCommodityList);


    //     }


    //     // 当前页码变化回调
    //     refreshStatus_CommodityList_Index($event) {
    //         // console.log($event);    // 当前点击的页数
    //         // console.log(this.addCommodityList);
    //         this.SearchCommodity();
    //         // this.addCommodityList = [];
    //         // this.commodityListNum = 0;
    //         // this.allChecked_CommodityList = false;
    //         // this.indeterminate_CommodityList = false;

    //     }



















    //     // --------------------------------------------------------商品列表 ------------------------------------------------------
    //     // 商品全选按钮
    //     checkAll_Commodity(value) {

    //         if (value) {
    //             this.dataSet_Commodity.forEach(data => {
    //                 data.checked = true;
    //                 // console.log(data);
    //             });
    //         } else {
    //             this.dataSet_Commodity.forEach(data => {
    //                 data.checked = false;
    //             });
    //         }
    //         this.refreshStatus_Commodity();
    //     }

    //     // 商品多选按钮，翻页按钮
    //     refreshStatus_Commodity() {

    //         const allChecked = this.dataSet_Commodity.every(value => value.checked === true);
    //         const allUnChecked = this.dataSet_Commodity.every(value => !value.checked);

    //         if (this.dataSet_Commodity.length === 0) {
    //             this.allChecked_Commodity = false;
    //         } else {
    //             this.allChecked_Commodity = allChecked;
    //         }

    //         this.indeterminate_Commodity = (!allChecked) && (!allUnChecked);
    //         this.commodityNum = this.dataSet_Commodity.filter(value => value.checked).length;

    //         // const commodityList = this.dataSet_Commodity.filter(value => value.checked);
    //         this.commodityCode = [];

    //         // for (const tmp of commodityList) {
    //         //     this.commodityCode.push({
    //         //         _id: tmp._id
    //         //     });
    //         // }
    //     }

    //     // 翻页回调
    //     refreshStatus_Commodity_Index($event) {

    //         this.commodityNum = 0;
    //         this.allChecked_Commodity = false;
    //         this.indeterminate_Commodity = false;
    //         this.commodityCode = [];

    //         this.getAddCommodity(this.searchValue.region_code, this.searchValue.region_name,
    //             this.searchValue.item_code, this.searchValue.item_name);

    //     }





    //     // 用户点击页码事件
    //     refreshStatus_Commodity_Click($event) {
    //         // console.log($event);    // 点击的页数
    //         // console.log(this.nzPageIndex_commody);  // 当前页数
    //         const page_no = this.nzPageIndex_commody;
    //         if (!this.dataSet_Commodity.every(value => value.price)) {

    //             // console.log($event);
    //             // console.log(this.nzPageIndex_commody);

    //             alert('您在当前页有单个或多个商品的活动价为空，请填写');
    //             setTimeout(() => {
    //                 this.nzPageIndex_commody = page_no;
    //                 // console.log(this.nzPageIndex_commody);
    //             }, 0);


    //         } else if (this.dataSet_Commodity.filter(item => item.price >= item.sale_price).length !== 0) {

    //             alert('您在当前页有单个或多个商品的活动价大于原价，请重新填写');
    //             setTimeout(() => {
    //                 this.nzPageIndex_commody = page_no;
    //             }, 0);

    //         } else if (!this.dataSet_Commodity.every(value => value.isSave)) {

    //             alert('请先保存当前页所修改的活动价');
    //             setTimeout(() => {
    //                 this.nzPageIndex_commody = page_no;
    //             }, 0);

    //         } else {
    //             this.nzPageIndex_commody = $event;
    //             this.commodityNum = 0;
    //             this.allChecked_Commodity = false;
    //             this.indeterminate_Commodity = false;
    //             this.commodityCode = [];

    //             this.getAddCommodity(this.searchValue.region_code, this.searchValue.region_name,
    //                 this.searchValue.item_code, this.searchValue.item_name);

    //         }



    //     }

    //     // 新增商品
    //     onCommodity() {
    //         // console.log(this.nzPageIndex_commody);  // 当前页数
    //         // console.log('新增商品');
    //         // console.log(this._dataSet);
    //         // this.addCommodityList = [];
    //         this.searchValue = {    // 查询商品字段
    //             region_code: '',
    //             region_name: '',
    //             item_code: '',
    //             item_name: ''
    //         };
    //         for (const tmp of this._dataSet) {
    //             this.commodityStorelist.push(tmp.region_code);
    //         }
    //         // console.log(this.commodityStorelist);

    //         if (this.additionBody === '1') {
    //             if (this._dataSet.length === 0) {
    //                 alert('请优先添加门店');
    //             } else {
    //                 this.settingTitle = '新增商品';
    //                 this.isSettingVisible = true;
    //                 // if (this.commodityValueInput === '') {
    //                 //     this.commodityValue = '0';
    //                 //     this.placeholderCommodity = '请输入商品名称，多项用英文逗号隔开';
    //                 // }
    //             }
    //         }
    //         //  else {
    //         //     if (this.fileName.indexOf('.xlsx') === -1) {
    //         //         alert('请优先上传文件');
    //         //     } else {
    //         //         this.settingTitle = '新增商品';
    //         //         this.isSettingVisible = true;
    //         //         // if (this.commodityValueInput === '') {
    //         //         //     this.commodityValue = '0';
    //         //         //     this.placeholderCommodity = '请输入商品名称，多项用英文逗号隔开';
    //         //         // }
    //         //     }
    //         // }

    //     }

    //     // 批量删除商品
    //     onPushDelete_Commodity() {

    //         const commodityList = this.dataSet_Commodity.filter(value => value.checked);
    //         // this.commodityCode = [];

    //         for (const tmp of commodityList) {
    //             this.commodityCode.push({
    //                 _id: tmp._id
    //             });
    //         }

    //         if (this.commodityCode.length === 0) {
    //             alert('至少要勾选一件商品');
    //         } else {
    //             if (window.confirm('是否要批量删除所选中的商品？')) {
    //                 // console.log('确定');

    //                 const opt = {
    //                     data: this.commodityCode
    //                 };
    //                 this.goodsDepreciateService.deletePushCommodity(opt)
    //                     .then(res => {
    //                         console.log(res);

    //                         if (res.code === 0) {

    //                             this.getAddCommodity(this.searchValue.region_code, this.searchValue.region_name,
    //                                 this.searchValue.item_code, this.searchValue.item_name);

    //                             this.allChecked_Commodity = false;
    //                             this.indeterminate_Commodity = false;
    //                         } else {
    //                             alert(res.msg);
    //                         }
    //                     });
    //             } else {
    //                 console.log('取消');
    //             }
    //         }
    //     }

    //     // 商品查询按钮
    //     searchInfo() {
    //         // console.log(this.searchValue);
    //         this.nzPageIndex_commody = 1;
    //         this.getAddCommodity(this.searchValue.region_code, this.searchValue.region_name,
    //             this.searchValue.item_code, this.searchValue.item_name);
    //     }

    //     // 商品重置按钮
    //     Reset() {
    //         this.searchValue = {
    //             region_code: '',
    //             region_name: '',
    //             item_code: '',
    //             item_name: ''
    //         };
    //     }

    //     // 活动价失焦
    //     // onBlurInput(item) {
    //     //     if (item.price) {

    //     //     }
    //     // }
    //     borderColor: any;
    //     onChangePrice(item, $event) {
    //         // console.log($event);
    //         // console.log(item.price);
    //         if ($event) {
    //             item.borderColor = '#f00';
    //             item.isSave = false;
    //         } else if ($event === item.price) {
    //             item.borderColor = '#d9d9d9';
    //         }

    //     }

    //     // 保存商品活动价修改
    //     onSave_Commodity(item) {
    //         // console.log('保存商品');
    //         // console.log(item.price);
    //         // console.log(item._id);

    //         const resel = /^\d+(\.\d+)?$/;
    //         const resel_num = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/;

    //         if (!item.price) {
    //             alert('活动价不能为空');
    //         } else if (item.price >= item.sale_price) {
    //             alert('活动价不能大于等于原价');
    //             item.price = '';
    //         } else if (!resel_num.test(item.price)) {
    //             alert('请输入正确的格式');
    //             item.price = '';
    //         }
    //         // else if (!resel_num.test(item.price)) {
    //         //     alert('小数点后不能多于两位数字');
    //         //     item.price = '';
    //         // }
    //         else {
    //             // console.log('保存商品');
    //             // console.log(item.price);
    //             // console.log(item._id);
    //             const opt = {
    //                 price: item.price,
    //                 _id: item._id
    //             };
    //             this.goodsDepreciateService.compilePrice(opt)
    //                 .then(res => {
    //                     console.log(res);

    //                     if (res.code === 0) {
    //                         // alert(res.msg);
    //                         // this.getAddCommodity(this.searchValue.region_code, this.searchValue.region_name,
    //                         //     this.searchValue.item_code, this.searchValue.item_name);
    //                         item.borderColor = '#d9d9d9';

    //                         item.isSave = true;
    //                     } else {
    //                         alert(res.msg);

    //                         item.isSave = false;
    //                     }
    //                 });
    //         }
    //     }

    //     // 取消商品活动价修改
    //     onCancel_Commodity(item) {
    //         // console.log('取消商品');

    //         if (window.confirm('是否要取消此商品？')) {
    //             // console.log('确定');
    //             const resel = /^\d+(\.\d+)?$/;
    //             const resel_num = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/;

    //             if (!item.price) {
    //                 alert('活动价不能为空');
    //             } else if (item.price >= item.sale_price) {
    //                 alert('活动价不能大于等于原价');
    //                 item.price = '';
    //             } else if (!resel_num.test(item.price)) {
    //                 alert('请输入正确的格式');
    //                 item.price = '';
    //             } else {
    //                 // console.log('保存商品');
    //                 // console.log(item.price);
    //                 // console.log(item._id);
    //                 const opt = {
    //                     price: '',
    //                     _id: item._id
    //                 };
    //                 this.goodsDepreciateService.compilePrice(opt)
    //                     .then(res => {
    //                         console.log(res);

    //                         if (res.code === 0) {
    //                             alert(res.msg);
    //                             // this.getAddCommodity(this.searchValue.region_code, this.searchValue.region_name,
    //                             //     this.searchValue.item_code, this.searchValue.item_name);
    //                             item.price = '';

    //                             item.isSave = true;
    //                         } else {
    //                             alert(res.msg);

    //                             item.isSave = false;
    //                         }
    //                     });
    //             }

    //         } else {
    //             console.log('取消');
    //         }

    //     }

    //     // 删除商品
    //     onDelete_Commodity(item) {
    //         // console.log(item);

    //         if (window.confirm('是否要删除此商品？')) {
    //             // console.log('确定');

    //             const opt = {
    //                 _id: item._id
    //             };

    //             this.goodsDepreciateService.deleteCommodity(opt)
    //                 .then(res => {
    //                     // console.log(res);

    //                     if (res.code === 0) {

    //                         this.getAddCommodity(this.searchValue.region_code, this.searchValue.region_name,
    //                             this.searchValue.item_code, this.searchValue.item_name);

    //                     } else {
    //                         alert(res.msg);
    //                     }
    //                 });

    //         } else {
    //             console.log('取消');
    //         }

    //     }

    //     // 批量设置折扣
    //     onDiscount() {
    //         // console.log('批量设置折扣');
    //         this.discount = '';
    //         const commodityList = this.dataSet_Commodity.filter(value => value.checked);

    //         if (commodityList.length === 0) {
    //             alert('至少要勾选一件商品');
    //         } else {
    //             this.settingTitle = '批量设置折扣';
    //             this.isSettingVisible = true;
    //         }
    //     }

    //     // 批量设置活动价
    //     onActivityPrice() {
    //         // console.log('批量设置活动价');
    //         this.price = '';
    //         const commodityList = this.dataSet_Commodity.filter(value => value.checked);

    //         if (commodityList.length === 0) {
    //             alert('至少要勾选一件商品');
    //         } else {
    //             this.settingTitle = '批量设置活动价';
    //             this.isSettingVisible = true;
    //         }
    //     }







    //     // --------------------------------------------------------------- 页面按钮操作 ----------------------------------------

    //     // 活动规则下一步按钮
    // onBtnNext() {

    //         this.pm_time2 = new Date().getTime();   // 当前时间


    //         if (this.paramsInfo.isTitle === '1') {  // 新增界面

    //             // console.log(this.goodSubmit);   // 要传的值
    //             // console.log(this.current_time); // 输入框的值

    //             if (this.goodSubmit.pd_name === '' || this.current_time.length === 0) {

    //                 alert('带 * 号为必填项，不能为空');
    //             } else if (this.goodSubmit.pd_name.length > 20) {

    //                 alert('活动名称长度不能超过20个字符');
    //             } else if (!this.checkedJDDJ && !this.checkedMTWM) {

    //                 alert('请至少选择一个渠道');
    //             } else if (this.JDDJ.limitDaily === 1 && this.JDDJ.limitCount === '') {

    //                 alert('京东到家限购数量不能为空');
    //             } else if (this.checkedMTWM && this.radioValueCustom === '1' && this.MTWM.limitCount === '') {

    //                 alert('美团外卖限购数量不能为空');
    //             } else if (this.checkedMTWM && this.radioValueStore === '1' && this.MTWM.day_limit === '') {

    //                 alert('美团外卖活动库存不能为空');
    //             }
    //             // else if (this.current_time[0] === null) {

    //             //     alert('请必须选择时间');
    //             // }
    //             else {

    //                 for (let i = 0; i < this.current_time.length; i++) {
    //                     this.goodSubmit.begin_date = this.current_time[0];
    //                     this.goodSubmit.end_date = this.current_time[1];
    //                 }

    //                 this.pm_time = this.goodSubmit.begin_date.getTime();    // 开始时间
    //                 this.pm_time3 = this.goodSubmit.end_date.getTime(); // 结束时间

    //                 if (this.pm_time > this.pm_time3) {

    //                     alert('开始时间，不能大于结束时间');
    //                 } else if (this.pm_time - this.pm_time2 < 3600000) {

    //                     alert('开始时间，必须大于当前时间一小时');
    //                 } else {
    //                     this.current = 1;   // 步骤条
    //                     this.activityGoods = '2';  // 导入按钮页面

    //                     // console.log(this.goodSubmit);
    //                 }

    //             }






    //         } else {    // 编辑界面

    //             // console.log(this.goodSubmit);   // 要传的值
    //             // console.log(this.current_time); // 输入框的值

    //             if (this.goodSubmit.pd_name === '') {

    //                 alert('带 * 号为必填项，不能为空');
    //             } else if (this.goodSubmit.pd_name.length > 20) {

    //                 alert('活动名称长度不能超过20个字符');
    //             } else if (!this.checkedJDDJ && !this.checkedMTWM) {

    //                 alert('请至少选择一个渠道');
    //             } else if (this.JDDJ.limitDaily === 1 && this.JDDJ.limitCount === '') {

    //                 alert('京东到家限购数量不能为空');
    //             } else if (this.checkedMTWM && this.radioValueCustom === '1' && this.MTWM.limitCount === '') {

    //                 alert('美团外卖限购数量不能为空');
    //             } else if (this.checkedMTWM && this.radioValueStore === '1' && this.MTWM.day_limit === '') {

    //                 alert('美团外卖活动库存不能为空');
    //             }
    //             // else if (this.current_time[0] === null) {

    //             //     alert('请必须选择时间');
    //             // }
    //             else {
    //                 // console.log(this.current_time);
    //                 // console.log(this.pm_time2);
    //                 // console.log(this.goodSubmit.begin_date);


    //                 if (this.current_time[0] !== this.goodSubmit.begin_date) {
    //                     // console.log(this.current_time[0].getTime());
    //                     if (this.current_time[0].getTime() > this.current_time[1].getTime()) {

    //                         alert('开始时间，不能大于结束时间');
    //                     } else if (this.current_time[0].getTime() - this.pm_time2 < 3600000) {

    //                         alert('开始时间，必须大于当前时间一小时');
    //                     } else {
    //                         for (let i = 0; i < this.current_time.length; i++) {
    //                             this.goodSubmit.begin_date = this.current_time[0];
    //                             this.goodSubmit.end_date = this.current_time[1];
    //                         }

    //                         this.current = 1;   // 步骤条
    //                         this.activityGoods = '3';  // 导入按钮页面


    //                         this.checkedAgree = true;  // 是否同意协议
    //                         this.nzPageIndex_commody = 1;
    //                         this.nzPagesize_commody = 10;
    //                         this.getAddCommodity(this.searchValue.region_code, this.searchValue.region_name,
    //                             this.searchValue.item_code, this.searchValue.item_name);

    //                         if (this.paramsInfo.source_type === '1') {   // 手动添加页面
    //                             this.additionBody = '1';   // 手动添加页面
    //                             this.nzPageIndex_addStore = 1;
    //                             this.nzPagesize_addStore = 10;
    //                             this.getAddStorelist();
    //                         } else {
    //                             this.additionBody = '2';   // 批量导入页面
    //                         }
    //                     }

    //                 } else {
    //                     if (this.current_time[0].getTime() > this.current_time[1].getTime()) {

    //                         alert('开始时间，不能大于结束时间');
    //                     } else if (this.current_time[0].getTime() - this.pm_time2 < 3600000) {

    //                         alert('开始时间，必须大于当前时间一小时');
    //                     } else {
    //                         this.current = 1;   // 步骤条
    //                         this.activityGoods = '3';  // 导入按钮页面

    //                         this.checkedAgree = true;  // 是否同意协议
    //                         this.nzPageIndex_commody = 1;
    //                         this.nzPagesize_commody = 10;
    //                         this.getAddCommodity(this.searchValue.region_code, this.searchValue.region_name,
    //                             this.searchValue.item_code, this.searchValue.item_name);

    //                         if (this.paramsInfo.source_type === '1') {   // 手动添加页面
    //                             this.additionBody = '1';   // 手动添加页面
    //                             this.nzPageIndex_addStore = 1;
    //                             this.nzPagesize_addStore = 10;
    //                             this.getAddStorelist();
    //                         } else {
    //                             this.additionBody = '2';   // 批量导入页面
    //                         }
    //                     }

    //                 }

    //             }
    //         }


    //         // console.log(this.goodSubmit);   // 要传的值
    //         // console.log(this.promotion_channel.JDDJ);    // 渠道选择
    //         // console.log(this.promotion_channel.MTWM);

    //         // console.log(this.current_time); // 输入框的值


    // }

    //     // 手动添加按钮
    //     onAddition() {
    //         this.activityGoods = '3'; // 活动商品页面
    //         this.additionBody = '1';   // 手动添加页面

    //         this.promotion_channel.source_type = '1';


    //         // if (this.paramsInfo.isTitle === '2') {  // 编辑界面
    //         //     this.checkedAgree = true;  // 是否同意协议
    //         //     this.nzPageIndex_addStore = 1;
    //         //     this.nzPagesize_addStore = 10;
    //         //     this.nzPageIndex_commody = 1;
    //         //     this.nzPagesize_commody = 10;
    //         //     this.getAddStorelist();
    //         //     this.getAddCommodity(this.searchValue.region_code, this.searchValue.region_name,
    //         //         this.searchValue.item_code, this.searchValue.item_name);
    //         // }


    //     }

    //     // 批量导入按钮
    //     onTolead() {
    //         this.activityGoods = '3'; // 活动商品页面
    //         this.additionBody = '2';   // 批量导入页面

    //         this.promotion_channel.source_type = '2';

    //         // if (this.paramsInfo.isTitle === '2') {  // 编辑界面
    //         //     this.checkedAgree = true;  // 是否同意协议
    //         //     this.nzPageIndex_commody = 1;
    //         //     this.nzPagesize_commody = 10;
    //         //     this.getAddCommodity(this.searchValue.region_code, this.searchValue.region_name,
    //         //         this.searchValue.item_code, this.searchValue.item_name);
    //         // }

    //     }

    //     // 返回按钮
    //     onReturn() {
    //         this.activityGoods = '2'; // 导入按钮页面
    //     }

    //     // 继续创建按钮
    //     onStick() {
    //         this.current = 0;   // 步骤条
    //         this.activityGoods = '1'; // 活动规则页面

    //         this._dataSet = [];     // 门店数据
    //         this.dataSet_Commodity = [];   // 商品数据
    //         this.addStoreList = [];
    //         this.addCommodityList = [];

    //         this.current_time = [];
    //         // 活动规则页面-需传参数
    //         this.goodSubmit = {     // 提交时需传参数
    //             pd_name: '',    // 活动名称
    //             begin_date: '', // 开始时间
    //             end_date: '',   // 结束时间
    //         };
    //         this.promotion_channel = {
    //             source_type: ''
    //         };    // 需要同步的渠道

    //         this.checkedJDDJ = false;
    //         this.checkedMTWM = false;
    //         this.checkedAgree = false;

    //         // console.log(this.addCommodityList);

    //     }

    //     // 查看活动按钮
    //     onExamine() {
    //         this.router.navigate(['/pages/promotion/goodsDepreciate']);
    //     }

    //     // 活动名称事件
    //     // 日期控件
    //     onCurrentTime() {
    //         console.log(this.current_time);
    //     }








    // -------------------------------------------------------- 京东到家选择内容 ---------------------------------------------

    // 京东选择框
    // updateACheckedJDDJ($event) {

    // if ($event) {
    //     this.promotion_channel.JDDJ = this.JDDJ;
    //     this.JDDJ.limitDaily = 0;
    // } else {
    //     delete this.promotion_channel.JDDJ;
    //     this.JDDJ.limitDaily = 0;
    // }
    // }



    //     // 按每个账号选择框
    //     accountJDDJ() {
    //         // console.log(this.JDDJaccount);
    //         if (this.JDDJaccount) {
    //             this.JDDJ.limitPin = 1;
    //         } else {
    //             this.JDDJ.limitPin = 0;
    //         }
    //     }

    //     // 按每个设备选择框
    //     facilityJDDJ() {
    //         // console.log(this.JDDJfacility);
    //         if (this.JDDJfacility) {
    //             this.JDDJ.limitDevice = 1;
    //         } else {
    //             this.JDDJ.limitDevice = 0;
    //         }
    //     }



    //     // 全部用户
    //     onAllUserJDDJ() {
    //         // console.log(this.JDDJ.user_type);
    //     }

    // 失焦事件
    // onBlurJDDJlimitcount() {
    // const res = /^[1-9]\d*$/;
    // if (!res.test(this.JDDJ.limitCount)) {

    //     alert('京东到家限购数量必须为大于0的整数');
    //     this.JDDJ.limitCount = '';
    // }
    // }








    // ------------------------------------------------------- 美团外卖选择内容 ---------------------------------------------

    // 美团选择框
    // updateACheckedMTWM($event) {
    // console.log(this.checkedMTWM);
    // this.imposeNumber = true;  // 美团每日限购数量选择框
    // this.imposeStore = true;   // 美团每日活动库存选择框

    // if ($event) {
    //     this.promotion_channel.MTWM = this.MTWM;
    // } else {
    //     delete this.promotion_channel.MTWM;
    // }

    // }


    //     // 限购数量不限/自定义选择框


    //     // 活动库存不限/自定义选择框
    //     onCustom() {
    //         // console.log(this.radioValueStore);
    //         if (this.radioValueStore === '0') {
    //             this.MTWM.day_limit = '';
    //         } else {
    //             this.MTWM.day_limit = '';
    //         }
    //     }

    //     // 限购输入框
    //     onMTWMlimitCount() {
    //         this.MTWM.limitCount = Number(this.MTWM.limitCount);
    //     }

    //     // 活动库存输入框
    //     onMTWMday_limit() {
    //         this.MTWM.day_limit = Number(this.MTWM.day_limit);
    //     }

    //     // 全部用户/门店新客
    //     onAllUserMTWM() {
    //         // console.log(this.radioValue);
    //     }

    //     // 限购数量失焦
    //     onBlurMTWMimitcount() {
    //         const res = /^[1-9]\d*$/;
    //         if (!res.test(this.MTWM.limitCount)) {
    //             alert('美团外卖限购数量必须为大于0小于10的整数');
    //             this.MTWM.limitCount = '';

    //         } else if (this.MTWM.limitCount > 9) {
    //             alert('美团外卖限购数量必须为大于0小于10的整数');
    //             this.MTWM.limitCount = '';
    //         }
    //     }

    //     // 活动库存失焦
    //     onBlurMTWMday_limit() {
    //         const res = /^[1-9]\d*$/;
    //         if (!res.test(this.MTWM.day_limit)) {

    //             alert('美团外卖活动库存必须为大于0的整数');
    //             this.MTWM.day_limit = '';
    //         }
    //     }








    //     // 协议内容/按钮
    //     // 协议对话框
    //     onAgree() {
    //         this.isVisible = true;
    //     }



    //     // 公共事件
    //     // 日期选择
    //     // startchange(event) {
    //     //     console.log(event);
    //     //     this._startDate = event;
    //     //     this.goodSubmit.begin_date = GMTToStr(event) + ' 00:00:00';
    //     // }
    //     // endchange(event) {
    //     //     // console.log(event);
    //     //     this._endDate = event;
    //     //     this.goodSubmit.end_date = GMTToStr(event) + ' 23:59:59';
    //     // }





    //     // 返回
    //     goback() {
    //         this.router.navigate(['/pages/promotion/goodsDepreciate']);
    //     }



}
