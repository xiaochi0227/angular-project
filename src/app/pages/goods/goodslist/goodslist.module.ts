import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShareModule } from 'src/app/share.module';
import { UploadModule } from 'src/app/sharecomponets/upload/upload.module';
import { GoodsList } from './goodslist.component';

const routes: Routes = [
  { path: '', component: GoodsList }

];

@NgModule({
  imports: [
    ShareModule,
    UploadModule,
    RouterModule.forChild(routes)
  ],
  declarations: [GoodsList]
})
export class GoodslistModule { }
