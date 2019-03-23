import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShareModule } from 'src/app/share.module';
import { UploadModule } from 'src/app/sharecomponets/upload/upload.module';
import { MonthnoSalerepComponent } from './monthnosalerep.component';

const routes: Routes = [
  { path: '', component: MonthnoSalerepComponent }

];

@NgModule({
  imports: [
    ShareModule,
    UploadModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MonthnoSalerepComponent]
})
export class MonthnoSalerepModule { }
