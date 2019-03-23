import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { JurisdictionComponent } from './jurisdiction.component';

const routes: Routes = [
  {
    path: '',
    component: JurisdictionComponent,
    children: [
      { path: 'roleallocation', loadChildren: './roleallocation/roleallocation.module#RoleallocationModule' },
      { path: 'addrole', loadChildren: './addrole/addrole.module#AddroleModule' },
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
  declarations: [JurisdictionComponent]
})
export class JurisdictionRoutingModule { }
