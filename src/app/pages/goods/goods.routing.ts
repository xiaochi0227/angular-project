import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { GoodsComponent } from './goods.component';

const routes: Routes = [
  {
    path: '',
    component: GoodsComponent,
    children: [
      { path: 'basicGoods', loadChildren: './basicGoods/basicGoods.module#BasicGoodsModule' },
      { path: 'prowhitelist', loadChildren: './prowhitelist/prowhitelist.module#ProwhitelistModule' },
      { path: 'btlbasicGoods', loadChildren: './btlbasicGoods/btlbasicGoods.module#BtlbasicGoodsModule' },
      { path: 'problacklist', loadChildren: './problacklist/problacklist.module#ProblacklistModule' },
      { path: 'regionGoods', loadChildren: './regiongoods/regiongoods.module#RegiongoodsModule' },
      { path: 'autoshelf', loadChildren: './autoshelf/autoshelf.module#AutoshelfModule' },
      { path: 'unusualgoods', loadChildren: './unusualgoods/unusualgoods.module#UnusualModule' },
      { path: 'goodslist', loadChildren: './goodslist/goodslist.module#GoodslistModule' },
      { path: 'btlregionGoods', loadChildren: './btlregionGoods/btlregionGoods.module#BtlregionGoodsModule' },
      { path: 'shoppingbag', loadChildren: './shoppingbag/shoppingbag.module#ShoppingbagModule' },
      { path: 'personalityclass', loadChildren: './personalityclass/personalityclass.module#PersonalityclassModule' },
      { path: 'personalityclassdetail', loadChildren: './personalityclass/personalityclassdetail.module#PersonalityclassdetailModule' },
      { path: 'manageclass', loadChildren: './personalityclass/manageclass.module#ManageclassModule' }
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
  declarations: [GoodsComponent]
})
export class GoodsRoutingModule { }
