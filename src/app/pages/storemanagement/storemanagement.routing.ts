import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
// import { GoodsComponent } from './goods.component';
import { StoremanagementComponent } from './storemanagement.component';

const routes: Routes = [
  {
    path: '',
    component: StoremanagementComponent,
    children: [
        { path: 'storebusinessset', loadChildren: './storebusinessset/storebusinessset.module#StorebusinesssetModule' },
        { path: 'storedistributionset', loadChildren: './storedistributionset/storedistributionset.module#StoredistributionsetModule'  },
        { path: 'shippingfeescope', loadChildren: './shippingfeescope/shippingfeescope.module#ShippingfeescopeModule' }
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
  declarations: [StoremanagementComponent]
})
export class StoremanagementRoutingModule { }
