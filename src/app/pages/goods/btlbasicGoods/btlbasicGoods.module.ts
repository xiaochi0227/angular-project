import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShareModule } from 'src/app/share.module';
import { BtlBasicGoodsComponent } from './btlbasicGoods.component';

const routes: Routes = [
  { path: '', component: BtlBasicGoodsComponent }

];

@NgModule({
  imports: [
    ShareModule,
    RouterModule.forChild(routes)
  ],
  declarations: [BtlBasicGoodsComponent]
})
export class BtlbasicGoodsModule { }





