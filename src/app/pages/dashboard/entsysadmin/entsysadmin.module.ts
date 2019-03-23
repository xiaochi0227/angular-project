import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShareModule } from 'src/app/share.module';
import { UploadModule } from 'src/app/sharecomponets/upload/upload.module';
import { EntsysAdminComponent } from './entsysadmin.component';
import { PieChartComponent } from './pieChart/pieChart.component';

const routes: Routes = [
  { path: '', component: EntsysAdminComponent }

];

@NgModule({
  imports: [
    UploadModule,
    ShareModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EntsysAdminComponent, PieChartComponent]
})
export class EntsysadminModule { }
