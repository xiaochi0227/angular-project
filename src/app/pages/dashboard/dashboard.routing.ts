import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'entsysadmin', pathMatch: 'full' },
      { path: 'entsysadmin', loadChildren: './entsysadmin/entsysadmin.module#EntsysadminModule' },
      { path: 'storemanager', loadChildren: './storemanager/storemanager.module#StoremanagerModule' }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ],
  declarations: [DashboardComponent]
})
export class DashboardRoutingModule { }
