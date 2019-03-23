import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MemberclassifyComponent } from './memberclassify.component';
import { ShareModule } from 'src/app/share.module';
import { SortablejsModule } from 'angular-sortablejs';
const routes: Routes = [
  { path: '', component: MemberclassifyComponent }

];

@NgModule({
  imports: [
    ShareModule,
    CommonModule,
    SortablejsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MemberclassifyComponent]
})
export class MemberclassifyModule { }
