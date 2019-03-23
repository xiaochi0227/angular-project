import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FinanceComponent } from './finance.component';


const routes: Routes = [
  {
    path: '',
    component: FinanceComponent,
    children: [
      { path: 'statement', loadChildren: './statement/statement.module#StatementModule' },
      { path: 'billingdetails', loadChildren: './billingdetails/billingdetails.module#BillingdetailsModule' },
      { path: 'billingstatementjkl', loadChildren: './billingstatementjkl/billingstatementjkl.module#BillingstatementjklModule' }

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
  declarations: [FinanceComponent]
})
export class FinanceRoutingModule { }
