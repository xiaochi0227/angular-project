import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShareModule } from 'src/app/share.module';
import { UploadModule } from 'src/app/sharecomponets/upload/upload.module';
import { OrderReconciliation } from './orderreconciliation.component';

const routes: Routes = [
  { path: '', component: OrderReconciliation }

];

@NgModule({
  imports: [
    ShareModule,
    UploadModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OrderReconciliation]
})
export class OrderreconciliationModule { }
