import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { OrdersComponent } from './orders.component';

const routes: Routes = [
  {
    path: '',
    component: OrdersComponent,
    children: [
      { path: 'orderbriefing', loadChildren: './orderbriefing/orderbriefing.module#OrderbriefingModule' },
      { path: 'weeksalesrankings', loadChildren: './weeksalesrankings/weeksalerankings.module#WeeksalerankingModule' },
      { path: 'orderdetailssearch', loadChildren: './orderdetailssearch/orderdetailssearch.module#OrderdetailssearchModule' },
      { path: 'returnlist', loadChildren: './returnlist/returnlist.module#ReturnlistModule' },
      { path: 'order', loadChildren: './order/order.module#OrderModule' },
      { path: 'orderreconciliation', loadChildren: './orderreconciliation/orderreconciliation.module#OrderreconciliationModule' },
      { path: 'daysalerep', loadChildren: './daysalerep/daysalerep.module#DaysalerepModule' },
      { path: 'dailysalesrecon', loadChildren: './dailysalesrecon/dailysalesrecon.module#DailySalesReconModule' },
      { path: 'writebriefing', loadChildren: './writebriefing/writebriefing.module#WritebriefingModule' },
      { path: 'financereport', loadChildren: './financereport/financereport.module#FinancereportModule' },
      { path: 'monthnosalerep', loadChildren: './monthnosalerep/monthnosalerep.module#MonthnoSalerepModule' },
      { path: 'categorysalesrep', loadChildren: './categorysalesrep/categorysalesrep.module#CategorysalesrepModule' }
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
  declarations: [OrdersComponent]
})
export class OrdersRoutingModule { }
