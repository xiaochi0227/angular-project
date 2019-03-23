import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShareModule } from 'src/app/share.module';
import { UploadModule } from 'src/app/sharecomponets/upload/upload.module';
import { BasicGoodsComponent } from './basicGoods.component';
import { GoodsuploadimgComponent } from './uploadimg/uploadimg.component';

const routes: Routes = [
  { path: '', component: BasicGoodsComponent }

];

@NgModule({
  imports: [
    UploadModule,
    ShareModule,
    RouterModule.forChild(routes)
  ],
  declarations: [BasicGoodsComponent, GoodsuploadimgComponent]
})
export class BasicGoodsModule { }
