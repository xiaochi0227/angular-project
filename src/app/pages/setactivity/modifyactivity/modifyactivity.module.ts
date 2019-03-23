import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShareModule } from 'src/app/share.module';
import { ModifyactivityComponent } from './modifyactivity.component';
const routes: Routes = [
  { path: '', component: ModifyactivityComponent }

];
@NgModule({
  declarations: [ModifyactivityComponent],
  imports: [
    ShareModule,
    RouterModule.forChild(routes)
  ]
})
export class ModifyactivityModule { }
