import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReconciliationComponent } from './reconciliation.component';



const routes: Routes = [
  {
    path: '',
    component: ReconciliationComponent,
    children: [
      { path: 'testsettlement', loadChildren: './testsettlement/testsettlement.module#testsettlementModule' }
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
  declarations: [ReconciliationComponent]
})
export class ReconciliationRoutingModule { }
