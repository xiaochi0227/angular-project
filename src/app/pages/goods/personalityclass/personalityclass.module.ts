import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShareModule } from 'src/app/share.module';
import { UploadModule } from 'src/app/sharecomponets/upload/upload.module';
import { PersonalityclassComponent } from './personalityclass.component';
import { PersonalityclassdetailComponent } from './personalityclassdetail.component';
import { ManageclassComponent } from '../../setactivity/manageclass/manageclass.component';
import { SearchbarModule } from 'src/app/sharecomponets/search-bar/search-bar.module';

const routes: Routes = [
  { path: '', component: PersonalityclassComponent }
];

@NgModule({
  imports: [
    ShareModule,
    UploadModule,
    SearchbarModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PersonalityclassComponent]
})
export class PersonalityclassModule { }
