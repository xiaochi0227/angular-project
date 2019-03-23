import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { OrderpushconfigComponent } from './orderpushconfig.component';

const routes: Routes = [
  { path: '', component: OrderpushconfigComponent }

];

@NgModule({
  imports: [
    CommonModule,
    NgZorroAntdModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OrderpushconfigComponent]
})
export class OrderpushconfigModule { }
