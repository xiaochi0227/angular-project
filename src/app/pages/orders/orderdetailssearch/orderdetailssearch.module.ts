import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShareModule } from 'src/app/share.module';
import { UploadModule } from 'src/app/sharecomponets/upload/upload.module';
import { OrderDetailsSearch } from './orderdetailssearch.component';

const routes: Routes = [
  { path: '', component: OrderDetailsSearch }

];

@NgModule({
  imports: [
    ShareModule,
    UploadModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OrderDetailsSearch]
})
export class OrderdetailssearchModule { }
