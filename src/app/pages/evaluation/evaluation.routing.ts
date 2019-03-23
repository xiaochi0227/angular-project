import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { EvaluationComponent } from './evaluation.component';




const routes: Routes = [
  {
    path: '',
    component: EvaluationComponent,
    children: [
      { path: 'evaluationlist', loadChildren: './evaluationlist/evaluationlist.module#EvaluationlistModule' },
      { path: 'autoreply', loadChildren: './autoreply/autoreply.module#AutoreplyModule' }

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
  declarations: [EvaluationComponent]
})
export class EvaluationRoutingModule { }
