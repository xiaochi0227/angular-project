import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CostsharingreportComponent } from './costsharingreport.component';
import { ShareModule } from 'src/app/share.module'; // 常用模块
import { SearchbarModule } from 'src/app/sharecomponets/search-bar/search-bar.module';

const routes: Routes = [
  {
    path: '', component: CostsharingreportComponent
  }

];
@NgModule({
  declarations: [CostsharingreportComponent],
  imports: [
    ShareModule,
    SearchbarModule,
    RouterModule.forChild(routes)
  ]
})
export class CostsharingreportModule { }
