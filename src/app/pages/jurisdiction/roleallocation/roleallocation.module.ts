import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShareModule } from 'src/app/share.module';
import { RoleallocationComponent } from './roleallocation.component';

const routes: Routes = [
  {
    path: '', component: RoleallocationComponent
  }

];

@NgModule({
  imports: [
    ShareModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RoleallocationComponent]
})
export class RoleallocationModule { }
