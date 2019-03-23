import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { OrderfullfillmentComponent } from './orderfulfillment.component';

const routes: Routes = [
  {
    path: '',
    component: OrderfullfillmentComponent,
    children: [
      { path: 'functionsetting', loadChildren: './functionsetting/functionsetting.module#FunctionsettingModule' },
      { path: 'performancemonitoring', loadChildren: './performancemonitoring/performancemonitoring.module#PerformancemonitoringModule' },
      { path: 'storeperformance', loadChildren: './storeperformance/storeperformance.module#StoreperformanceModule' },
      { path: 'monitorconfig', loadChildren: './monitorconfig/monitorconfig.module#MonitorconfigModule' }
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
  declarations: [OrderfullfillmentComponent]
})
export class OrderfullfillmentRoutingModule { }
