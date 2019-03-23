import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MemberinfoComponent } from './memberinfo.component';
import { ShareModule } from 'src/app/share.module';
import { SearchbarModule } from 'src/app/sharecomponets/search-bar/search-bar.module';
import { AddmemberinfoComponent } from './addmemberinfo.component';




const routes: Routes = [
  { path: '', component: MemberinfoComponent },
  { path: 'addmemberinfo', component: AddmemberinfoComponent },

];

@NgModule({
  imports: [
    CommonModule,
    ShareModule,
    SearchbarModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MemberinfoComponent, AddmemberinfoComponent]
})
export class MemberinfoModule { }
