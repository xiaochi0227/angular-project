import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShareModule } from 'src/app/share.module';
import { NewactivityComponent } from './newactivity.component';
import { UploadModule } from 'src/app/sharecomponets/upload/upload.module';

const routes: Routes = [
  {
    path: '', component: NewactivityComponent,
    data: {
      breadcrumb: '新增活动',
    }
  }
];

@NgModule({
  declarations: [NewactivityComponent],
  imports: [
    ShareModule,
    UploadModule,
    RouterModule.forChild(routes)
  ]
})
export class NewactivityModule { }
