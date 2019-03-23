import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShareModule } from 'src/app/share.module';
import { UploadModule } from 'src/app/sharecomponets/upload/upload.module';
import { DaySaleRep } from './daysalerep.component';

const routes: Routes = [
  { path: '', component: DaySaleRep }

];

@NgModule({
  imports: [
    ShareModule,
    UploadModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DaySaleRep]
})
export class DaysalerepModule { }
