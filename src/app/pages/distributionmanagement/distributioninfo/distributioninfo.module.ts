import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShareModule } from 'src/app/share.module';
import { DistributioninfoComponent } from './distributioninfo.component';

const routes: Routes = [
  { path: '', component: DistributioninfoComponent }

];

@NgModule({
  imports: [
    ShareModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DistributioninfoComponent]
})
export class DistributioninfoModule { }
