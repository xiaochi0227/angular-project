import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SetactivityComponent } from './setactivity.component';

const routes: Routes = [
  {
    path: '',
    component: SetactivityComponent,
    children: [
      { path: 'newactivity', loadChildren: './newactivity/newactivity.module#NewactivityModule' },
      // { path: 'modifyactivity', loadChildren: './modifyactivity/modifyactivity.module#ModifyactivityModule' },
      // { path: 'manageclass', loadChildren: './manageclass/manageclass.module#ManageclassModule' },
      // {path: 'activitylist', loadChildren: './activitylist/activitylist.module#ActivitylistModule'}
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
  declarations: [SetactivityComponent]
})
export class SetactivityRoutingModule { }
