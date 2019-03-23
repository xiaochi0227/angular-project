import { NgModule } from '@angular/core';
import { UserrightsComponent } from './userrights.component';
import { ShareModule } from 'src/app/share.module';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{
  path: '', component: UserrightsComponent,
}];

@NgModule({
  imports: [
    ShareModule,
    RouterModule.forChild(routes)
  ],
  declarations: [UserrightsComponent]
})
export class UserrightsModule { }
