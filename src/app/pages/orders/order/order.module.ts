import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShareModule } from 'src/app/share.module';
import { UploadModule } from 'src/app/sharecomponets/upload/upload.module';
import { Order } from './order.component';
import { OrderCard } from './ordercard.component';

const routes: Routes = [
  { path: '', component: Order }

];

@NgModule({
  imports: [
    ShareModule,
    UploadModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: [
    OrderCard
  ],
  declarations: [Order, OrderCard]
})
export class OrderModule { }
