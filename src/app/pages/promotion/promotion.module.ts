





import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from 'src/app/share.module'; // 常用模块
import { PromotionRoutingModule } from './promotion.routing.module';  // 导入路由模块

@NgModule({
  imports: [
    ShareModule,
    PromotionRoutingModule,
  ],
  declarations: [],
  bootstrap: []
})
export class PromotionModule { }  // 导出模块























// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { NgaModule } from '../../theme/nga.module';
// // import { moment } from 'MomentModule.;
// import { routing } from './promotion.routing';
// import { PromotionComponent } from './promotion.component';
// import { Fullsubtract, FullsubtractService } from './components/fullsubtract';
// import { Newactivity } from './components/fullsubtract/newactivity.component';
// import { CommodityAdd } from './components/fullsubtract/commodity-add.component';
// import { Affirmhd } from './components/fullsubtract/affirmhd.component';
// import { Singleitem, SingleitemService } from './components/singleitem';
// import { Newactivityd } from './components/singleitem/newactivityd.component';
// import { MTNewactivityd } from './components/singleitem/mtnewactivityd.component';
// import { Offlineitem , OfflineitemService } from './components/offlineitem';
// import { NgZorroAntdModule } from 'ng-zorro-antd';
// import { Affirmdhd } from './components/singleitem/affirmdhd.component';
// import { Ng2DatetimePickerModule } from 'ng2-datetime-picker';
// import { PromotionscontrolComponent, PromotionscontrolService } from './components/promotionscontrol';
// import { CostsharingreportComponent, CostsharingreportService } from './components/costsharingreport';
// import { PromotioneffectComponent, PromotioneffectService } from './components/promotioneffect';
// import { SingleitempromotionComponent, SingleitempromotionService } from './components/singleitempromotion';
// import { MarketingComponent, MarketingService } from './components/marketing';  // 促销中心页面
// import { GoodsDepreciateComponent, GoodsDepreciateService } from './components/goodsDepreciate';  // 商品降价主页面
// import { DetailsGoodsDepreciateComponent } from './components/goodsDepreciate/detailsGoodsDepreciate.component';  // 商品降价详情页面
// import { AddGoodsDepreciateComponent } from './components/goodsDepreciate/addGoodsDepreciate.component';  // 新增商品降价页面
// import { FullreductionActiveComponent, FullreductionActiveService } from './components/fullreductionActive';  // 满减活动主页面
// import { AddFullreductionActiveComponent } from './components/fullreductionActive/addFullreductionActive.component';  // 新增满减活动页面
// import { DetailsFullreductionActiveComponent } from './components/fullreductionActive/detailsFullreductionActive.component';  // 满减活动详情页面

// @NgModule({
//   imports: [
//     CommonModule,
//     FormsModule,
//     NgaModule,
//     routing,
//     Ng2DatetimePickerModule,
//     NgZorroAntdModule
//   ],
//   declarations: [
//     PromotionComponent,
//     Fullsubtract,
//     Newactivity,
//     CommodityAdd,
//     Affirmhd,
//     Singleitem,
//     Newactivityd,
//     MTNewactivityd,
//     Affirmdhd,
//     Offlineitem,
//     PromotionscontrolComponent,
//     CostsharingreportComponent,
//     PromotioneffectComponent,
//     SingleitempromotionComponent,
//     GoodsDepreciateComponent,
//     DetailsGoodsDepreciateComponent,
//     AddGoodsDepreciateComponent,
//     MarketingComponent,
//     FullreductionActiveComponent,
//     AddFullreductionActiveComponent,
//     DetailsFullreductionActiveComponent
//   ],
//   providers: [
//     FullsubtractService,
//     SingleitemService,
//     OfflineitemService,
//     PromotionscontrolService,
//     CostsharingreportService,
//     PromotioneffectService,
//     SingleitempromotionService,
//     GoodsDepreciateService,
//     MarketingService,
//     FullreductionActiveService
//   ]
// })
// export class PromotionModule { }
