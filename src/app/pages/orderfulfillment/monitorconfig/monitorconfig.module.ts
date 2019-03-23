import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShareModule } from 'src/app/share.module';
import { MonitorconfigComponent } from './monitorconfig.component';

const routes: Routes = [
  { path: '', component: MonitorconfigComponent }
];

@NgModule({
  declarations: [MonitorconfigComponent],
  imports: [
    ShareModule,
    RouterModule.forChild(routes)
  ]
})
export class MonitorconfigModule { }
