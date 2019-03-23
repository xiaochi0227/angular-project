import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { LoginResponse, API, LoginParameter, APIGroup, APIGroupResponse } from '../models';
import { Subject, of } from 'rxjs';
import { NGXLogger } from 'ngx-logger';
import { map } from 'rxjs/operators';
import { Utils } from '../utils/utils';
/**
 * http服务除了登录和获取API地址的接口其它都从服务器端获取
 *
 * @export
 */
@Injectable({
  providedIn: 'root'
})
export class HttpService {
  isinited = false;
  apiLogin: API;
  apiInitAPIS: API;
  apiTokenValidate: API;
  apiRefreshToken: API;
  apiGetOSSPolicy: API;
  apiMenus: API;
  getChannels: API;
  getorderstatusstore: API;
  addexport: API;
  getweekrankings: API;
  getFirstOnlineCategories: API;  // 获取商品分类
  getSubOnlineCategories: API;
  getStorelist: API;
  getwhiteList: API;
  getRegionchannel: API;
  onlineinput: API;
  delWhite: API;
  alluploadimgoss: API; // 门店商品--批量上传图片
  addBatchPictureDetails: API;
  getitemregions: API; // 获取门店商品列表
  setstatus: API; // 门店商品修改状态
  findItemInfos: API; // 门店商品--稽核
  updateChannel: API;  // 门店商品--经营渠道
  regionlogs: API;  // 门店管理--门店商品日志
  batchAllChannel: API; // 门店管理---批量设置经营渠道
  inventorychangelog: API; // 门店管理---查看库存日志
  getchannellogs: API; // 门店管理--查看渠道日志
  fillstock: API; // 门店管理--库存置满
  getpriceinv: API; // 门店管理--查看库存价格数据
  updateprice: API; // 门店管理--修改库存商品价格修改
  syncOfflineItemPrice: API; // 门店管理--同步线下价格
  syncOfflineItemStock: API; // 门店管理--同步线下价格
  syncOnlineItemPrice: API; // 门店管理--同步线下价格
  syncOnlineItemStock: API; // 门店管理--同步线下价格
  regionPriceStock: API; // 门店管理--门店商品价格库存导入
  goodStatus: API; // 门店管理--门店商品状态导入
  onlineChannelInput: API; // 门店管理--门店经营渠道导入
  importVipPrice: API; // 门店管理--会员价导入
  regionPluCode: API; // 门店管理--门店PLU码导入
  itemBaseCxInput: API; // 门店管理--促销商品导入
  getOrderPickers: API; //  拣货管理--拣货员信息
  addOrderPickers: API; //  拣货管理--新加拣货员信息
  updOrderPickers: API; //  拣货管理--修改拣货员信息
  queryPickerCategory: API; // 拣货管理--获取分类列表
  savePickerCategory: API; // 拣货管理--保存列表
  queryPickHangUpReason: API; // 拣货管理--获取挂起原因列表
  savePickHangUpReason: API;  // 拣货管理--保存挂起修改数据
  delPickHangUpReason: API; // 拣货管理--删除修改数据
  pickingHangUpResonSort: API; // 拣货管理--保存挂起页面的排序
  getsotresreport: API; //  财务对账--对账单首页
  getbillingdetails: API; // 财务对账--对账单详情
  getbillingDetail: API; // 财务对账--对账单详情--账单详情
  gettestsettlement: API;  // 财务对账--商家结算对账表
  getOrderListDetail: API;  // 财务对账--商家结算对账详情
  getEvaluations: API; // 评价管理--评价管理
  replyEvaluation: API; // 评价管理--回复评价
  getcoulent: API; // 评价管理--获取一开始设置的回复
  saveAutoReply: API; // 评价管理--保存自动回复
  getagreement: API; // 订单履约--功能设置初始页面
  setagreement: API; // 订单履约--功能设置保存接口
  agreementreport: API; // 订单履约--订单履约监控获取详细信息
  storeagreementreport: API; // 订单履约--门店履约统计
  getscopeactivitys: API; // 活动设置--活动列表
  addscopeactivitycategory: API; // 活动设置--新增活动分类
  addscopeactivitys: API; // 活动设置--新建活动
  getownchannel: API; // 活动设置--获取上线渠道
  getfllist: API; // 活动设置--获取活动分类列表
  onlineInput: API; // 活动设置--导入商品分类
  savesortorder: API; // 活动设置--保存分类
  offlineitem: API;  // 活动设置--提前下线
  delscopeactivity: API; // 活动设置--删除活动
  getpolicy: API; // 活动分类
  setselectcategory: API;
  getproblackList: API;
  channelblackInput: API;
  delblack: API;
  getsearchresults: API;
  getBillOrderConfig: API; //  财务对账--获取渠道配置信息
  getscopeactivitycategorys: API;
  getscopeactivityitems: API;
  getregions: API; // 基础设置-单个商品同步
  onegoodsadd: API; // 基础设置-添加商品
  onegoodsedit: API; // 基础设置-更新商品
  onegoodsprice: API; // 基础设置-更新商品价格
  onegoodsstock: API; // 基础设置-更新商品库存
  onegoodsonoff: API; // 基础设置-更新商品上下架状态
  getents: API; // 单个分类同步-获取企业列表
  enterpriseGetchannels: API; // 促销活动分摊报表--活动渠道
  moneyDistributionReport: API; // 促销活动分摊报表--分摊报表
  getshopswitchrecord: API; // 基础设置-当前门店营业状态--列表
  getshopswitchrecords: API; // 基础设置-门店开关店报表--列表
  getInvoicelist: API; // 门店库存管理-发票信息维护
  getswitchcompany: API; // 门店库存管理-启停用发票公司
  addInvoiceCompany: API;  // 门店库存管理-增加发票公司
  updateInvoiceCompany: API; // 门店库存管理-修改发票公司
  getInvoicedetail: API; // 门店库存管理-获取发票详情信息
  switchInvoice: API; // 门店库存管理-是否启用电子发票
  batchSwitch: API;  // 门店库存管理-批量修改电子发票信息
  goodsGetchannels: API; // 黑名单中---获取渠道
  saveItemCategory: API; // 商品管理--保存商品线上品类"
  saveSortOrder: API;
  setstatus1: API;
  setstatus2: API;
  setstatus3: API;
  setstatus4: API;
  getItemList: API;
  itemBaseStatus: API;
  getitembaseerplog: API;
  getautoshelfs: API;
  taskonoffinput: API;
  getitemregionstatus: API;
  addAutoshelf: API;
  entlist: API;
  getchannel: API;
  channels: API;
  entupdate: API;
  delImage: API;
  exportlist: API;
  download: API;
  dashboarddata: API;
  getsaleRanking: API;
  getStoreOrders: API;
  importlist: API;
  getItemBases: API;
  geItemLog: API;
  getsole: API;
  addItemFiles: API;
  getItemFiles: API;
  getImgesInfo: API;
  checkImages: API;
  deleteImg: API;
  showImg: API;
  getGoods: API;
  updateGoods: API;
  editDwzhxs: API;
  editjgck: API;
  updatejgck: API;
  alluploadimg: API;
  batchimportcsv: API;
  delsign: API;
  itemBaseImport: API;
  xsspflinput: API;
  itemStatusImport: API;
  dwzhxsImport: API;
  importMustSaleItem: API;
  importFreshItem: API;
  importFoodItem: API;
  importTaxItem: API;
  importSubTitel: API;
  importPsyq: API;
  updateBarcodeByItemcode: API;
  batchinvalid: API;
  getWptxImage: API;
  itembasechange: API;
  isGetWptxImage: API;
  offlineCategoryImport: API;
  findItems: API;
  saveSpceItem: API;
  findCategory: API;
  getitemfiles: API;
  delSpecItem: API;
  getuserinfos: API;
  changeuserstatus: API;
  roleList: API;
  saveuserinfos: API;
  edituserinfo: API;
  removeboundr: API;
  getentstores: API;
  updataUserInfo: API;
  newfirstclass: API;
  getchannelbyendid: API;
  getentlist: API;
  deleteUserInfo: API;
  getlongnameList: API;
  getrenameList: API;
  getbynamelist: API;
  updaterename: API;
  getitemwatchlist1: API;
  getitemwatchlist: API;
  queryStoreDelivery: API;
  findStoreDelivery: API;
  savepsfs: API;
  getsavepsfj: API;
  setStoreLocation: API;
  importStoreLocations: API;
  getischannels: API;
  getitemregionerp: API;
  getitemregionlogs: API;
  getItemRegionLog: API;
  queryBag: API;
  queryOnlineBag: API;
  importTag: API;
  promotiononline: API; // 单品直降-首页
  operation: API; // 单品直降-操作
  priceoffInfo: API;  // 单品直降-详情
  addStore: API;  // 单品直降-确认新增门店
  getAddStore: API; // 单品直降-新增后门店
  deletePushStore: API; // 单品直降-删除新增后门店
  searchCommodity: API; // 单品直降-查询商品
  addSearchCommodity: API;  // 单品直降-添加商品
  searchPushCommodity: API; // 单品直降-新增后商品
  deletePushCommodity: API; // 单品直降-批量删除商品"
  deleteCommodity: API; // 单品直降-单个删除商品
  compilePushPrice: API;  // 单品直降-批量修改折扣/活动价
  singlepromotelist: API; // 线下单品促销-促销列表
  updItemStateUrl: API; // 线下单品促销-单个修改商品状态
  updPromotionStateUrl: API;  // 线下单品促销-批量修改商品状态
  gettypesUrl: API; // 商品促销类型表-促销类型
  getpromotionslistsurl: API; // 商品促销类型表-促销列表
  storeDeliveryRange: API;
  StoreDeliveryRange: API;
  queryStoreCoordinate: API;
  queryStoreCost: API;
  findChannelStore: API;
  channelStoreyyStatus: API;
  channelStorejyStatus: API;
  channelStoreTime: API;
  getorderdetails: API;
  getchargeback: API;
  getreturnlist: API;
  afterSaleOrderApprove: API;
  confirmReceipt: API;
  getorders: API;
  getorderslog: API;
  getorderdetail: API;
  getorderstatus: API;
  cancelOrderApprove: API;
  cancelOrderReason: API;
  cancelorder: API;
  sjLaunchReturnOrder: API;
  orderReport: API;
  getOnlineCategories: API;
  olctgrinput: API;
  updatestockfull: API;
  getonlinecategorieslog: API;
  saveonlinecategory: API;
  savesortonlineorder: API;
  deldisableonlinecategory: API;
  editscopeactivitys: API;
  getownregion: API;
  getspecialscopeactivitys: API;
  selectcategory: API;
  activityitemcatinput: API;
  findStoreGroup: API;
  removeactivityitem: API;
  editactivityitem: API;
  editspecialscopeactivitys: API;
  getactivityitems: API;
  getactivitycategorys: API;
  addactivitycategory: API;
  activitycategorysinput: API;
  sortcategory: API;
  queryStoreGroup: API;
  findStore: API;
  saveStoreGroup: API;
  findDistributionStore: API;
  delStoreGroup: API;
  getlistchannels: API;
  getstorealist: API;
  getstores: API; // 门店列表（带城市）
  getstorecount: API; // 门店列表count（带城市）
  getstoreslog: API;
  storePhone: API;
  addstore: API;
  storeChannelInput: API;
  storeInput: API;
  editstore: API;
  updatestore: API;
  initstore: API;
  delchannel: API;
  queryStoreSetLog: API;
  getsaledayinfo: API;
  getsaledayrecon: API;
  getwriteoffday: API;
  getwriteoffdayField: API;
  getfinanceorderreport: API;
  getstocks: API; // 门店存库 - 门店库存列表
  updateStock: API; // 门店库存 - 保存修改库存共享率和安全库存
  getstockslog: API;  // 门店库存 - 库存日志
  safeStockImport: API;
  getmonthunsaleitem: API;
  getfreshstocks: API;  // 生鲜库存 - 生鲜列表
  getfreshstocksdetail: API;  // 生鲜库存 - 生鲜明细列表
  getwillsellstocks: API; // 必卖商品 - 必卖商品列表
  getwillsellstocksdetail: API; // 必卖商品 - 必卖商品明细列表
  getsaledetailmonth: API;
  getsaledetailtime: API;
  addDetailItemFiles: API;
  getDetailItemFiles: API;
  deleteDetailImg: API;
  getEntStorelist: API;
  getStoresReport: API;
  saveRate: API;
  getRate: API;
  getQYMenuInfo: API;
  insertRole: API;
  updateRole: API;
  delRole: API;


  private _Oninit = new Subject<boolean>();
  constructor(private c: HttpClient, private logger: NGXLogger) {
    // 初始化登录接口
    this.apiLogin = new API(this.c, {
      code: 'apiLogin',
      method: 'post',
      url: environment.loginUrl,
    });
    // 初始化初始化API接口
    this.apiInitAPIS = new API(this.c, {
      code: 'apiInitAPIS',
      method: 'post',
      url: environment.apiUrl,
    });
  }
  // 订阅API初始化完成消息
  subscribeApiInit() {
    return this._Oninit.asObservable();
  }
  // 初始化API
  initAPIS() {
    let localAPIS = Utils.getAPIS();
    let parameter = {
      search: {
        app_code: environment.appcode,
        version: -1,
        env: environment.env
      }
    };
    if (localAPIS && localAPIS.version) {
      parameter.search.version = localAPIS.version;
    }
    return this.apiInitAPIS.request<APIGroupResponse>(parameter).pipe(map(apigr => {
      let count = 0;
      if (!apigr || apigr.code !== '0' && apigr.code !== '005007001') {
        alert('初始化接口失败');
      }
      if (apigr && apigr.code === '0') {
        localAPIS = apigr.data;
        Utils.setAPIS(localAPIS);
      }
      this.logger.debug(`初始化API信息成功!:\n version:${localAPIS.version}\n name:${localAPIS.name}\n num:${Object.keys(localAPIS.apis).length}`);
      for (const k in localAPIS.apis) {
        if (localAPIS.apis.hasOwnProperty(k)) {
          this[k] = new API(this.c, localAPIS.apis[k]);
          count++;
        }
      }
      this.isinited = true;
      return of(count);
    }));
  }
  // 下载文件
  downloadFile(filepath: string, filename: string) {
    return this.c.get(filepath, { responseType: 'blob' })
      .subscribe(data => {
        const link = document.createElement('a');
        link.setAttribute('href', window.URL.createObjectURL(data));
        link.setAttribute('download', filename + '.zip');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      );
  }
}
