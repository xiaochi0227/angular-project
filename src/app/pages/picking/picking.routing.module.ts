import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PickingComponent } from './picking.component';

const routes: Routes = [
  {
    path: '',
    component: PickingComponent,
    children: [
      // { path: 'pickerefficiency', loadChildren: './orderbriefing/orderbriefing.module#OrderbriefingModule' },
      { path: 'pickerefficiency', loadChildren: './pickefficiency/pickefficiency.module#PickefficiencyModule' },
      { path: 'memberinfo', loadChildren: './memberinfo/memberinfo.module#MemberinfoModule' },
      { path: 'memberclassify', loadChildren: './memberclassify/memberclassify.module#MemberclassifyModule' },
      { path: 'hangup', loadChildren: './hangup/hangup.module#HangupModule' }
    
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
  declarations: [PickingComponent]
})
export class PickingRoutingModule { }
