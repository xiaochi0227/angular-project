
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  // { path: '', redirectTo: 'marketing', pathMatch: 'full' },
  // { path: 'marketing', loadChildren: './marketing/marketing.module#MarketingModule' } // 营销中心
  {
    path: '',
    children: [
      { path: 'marketing', loadChildren: './marketing/marketing.module#MarketingModule' },  // 营销中心
      { path: 'goodsDepreciate', loadChildren: './goodsDepreciate/goodsDepreciate.module#GoodsDepreciateModule' },  // 单品直降
      { path: 'offlineitem', loadChildren: './offlineitem/offlineitem.module#OfflineitemModule' },  // 线下单品促销
      { path: 'promotionscontrol', loadChildren: './promotionscontrol/promotionscontrol.module#PromotionscontrolModule' },  // 商品促销类型表
      { path: 'costsharingreport', loadChildren: './costsharingreport/costsharingreport.module#CostsharingreportModule' },  // 单品直降
    ]
  }
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ],
})
export class PromotionRoutingModule { } // 导出路由模块


