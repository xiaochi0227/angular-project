import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from './pages.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'exception', loadChildren: './exceptionpage/exceptionpage.module#ExceptionModule' },
      { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' },
      // { path: 'businessoverview', loadChildren: './dashboard/businessoverview/businessoverview.module#BusinessoverviewModule', },
      // { path: 'clients/appinfo', loadChildren: './clients/appinfo/appinfo.module#AppinfoModule' },
      // { path: 'clients/apis', loadChildren: './clients/apis/apis.module#ApisModule' },
      { path: 'orders', loadChildren: './orders/orders.module#OrdersModule', },
      { path: 'account', loadChildren: './account/account.module#AccountModule', },
      { path: 'picking', loadChildren: './picking/picking.module#PickingModule', },
      { path: 'goods', loadChildren: './goods/goods.module#GoodsModule', },
      { path: 'finance', loadChildren: './finance/finance.module#FinanceModule', },
      { path: 'reconciliation', loadChildren: './reconciliation/reconciliation.module#ReconciliationModule' },
      { path: 'distributionmanagement', loadChildren: './distributionmanagement/distributionmanagement.module#DistributionmanagementModule', },
      { path: 'storemanagement', loadChildren: './storemanagement/storemanagement.module#StoremanagementModule', },
      { path: 'evaluation', loadChildren: './evaluation/evaluation.module#EvaluationModule' },
      { path: 'orderfulfillment', loadChildren: './orderfulfillment/orderfulfillment.module#OrderfulfillmentModule' },
      { path: 'setactivity', loadChildren: './setactivity/setactivity.module#SetactivityModule' },
      { path: 'promotion', loadChildren: './promotion/promotion.routing.module#PromotionRoutingModule' }, // 促销活动
      { path: 'orderfulfillment', loadChildren: './orderfulfillment/orderfulfillment.module#OrderfulfillmentModule' },
      { path: 'maindata', loadChildren: './maindata/maindata.module#MaindataModule' },
      { path: 'jurisdiction', loadChildren: './jurisdiction/jurisdiction.module#JurisdictionModule' },


    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class PagesRoutingModule { }
