import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShareModule } from 'src/app/share.module';
import { UploadModule } from 'src/app/sharecomponets/upload/upload.module';
import { PersonalityclassdetailComponent } from './personalityclassdetail.component';

const routes: Routes = [
  { path: '', component: PersonalityclassdetailComponent }
];

@NgModule({
  imports: [
    ShareModule,
    UploadModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PersonalityclassdetailComponent]
})
export class PersonalityclassdetailModule { }
