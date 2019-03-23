import { NgModule } from '@angular/core';
import { TaskconfigComponent } from './taskconfig.component';
import { ShareModule } from 'src/app/share.module';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{
  path: '', component: TaskconfigComponent,
}];

@NgModule({
  imports: [
    ShareModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TaskconfigComponent]
})
export class TaskconfigModule { }
