import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountComponent } from './account.component';

const routes: Routes = [
  {
    path: '',
    component: AccountComponent,
    children: [
      { path: 'entinfo', loadChildren: './entinfo/entinfo.module#EntinfoModule' },
      { path: 'taskconfig', loadChildren: './taskconfig/taskconfig.module#TaskconfigModule' },
      { path: 'importlist', loadChildren: './importlist/importlist.module#ImportlistModule' },
      { path: 'userrights', loadChildren: './userrights/userrights.module#UserrightsModule' },
      { path: 'entstoregrouping', loadChildren: './entstoregrouping/entsgrouping.module#EntsgroupingModule' },
      { path: 'invoice', loadChildren: './invoice/invoice.module#InvoiceModule' },
      // { path: 'classifysynchro', loadChildren: './classifysynchro/classifysynchro.module#ClassifysynchroModule' }


    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AccountRoutingModule { }
