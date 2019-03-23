import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ShareModule } from 'src/app/share.module';
import { SortablejsModule } from 'angular-sortablejs';

import { HangupComponent } from './hangup.component';
import { DragDirective } from 'src/app/directives/drag.directive';
const routes: Routes = [
  { path: '', component: HangupComponent }

];
@NgModule({
  declarations: [HangupComponent, DragDirective],
  imports: [
    ShareModule,
    CommonModule,
    SortablejsModule,
    RouterModule.forChild(routes)
  ]
})
export class HangupModule { }
