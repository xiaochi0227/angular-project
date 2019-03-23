import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvoiceComponent } from './invoice.component';
import { ShareModule } from 'src/app/share.module'; // 常用模块
import { UploadModule } from 'src/app/sharecomponets/upload/upload.module';


const routes: Routes = [
  {
    path: '', component: InvoiceComponent
  }

];
@NgModule({
  declarations: [InvoiceComponent],
  imports: [
    ShareModule,
    UploadModule,
    RouterModule.forChild(routes)
  ]
})
export class InvoiceModule { }
