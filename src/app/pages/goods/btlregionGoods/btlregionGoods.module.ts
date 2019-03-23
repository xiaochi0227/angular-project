import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShareModule } from 'src/app/share.module';
import { UploadModule } from 'src/app/sharecomponets/upload/upload.module';
import { BtlRegionGoods } from './btlregionGoods.component';

const routes: Routes = [
  { path: '', component: BtlRegionGoods }

];

@NgModule({
  imports: [
    UploadModule,
    ShareModule,
    RouterModule.forChild(routes)
  ],
  declarations: [BtlRegionGoods]
})
export class BtlregionGoodsModule { }
