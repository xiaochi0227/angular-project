import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShareModule } from 'src/app/share.module';
import { ManageclassComponent } from './manageclass.component';
import { SortablejsModule } from 'angular-sortablejs';
import { UploadModule } from 'src/app/sharecomponets/upload/upload.module';
const routes: Routes = [
  { path: '', component: ManageclassComponent }

];
@NgModule({
  declarations: [ManageclassComponent],
  imports: [
    ShareModule,
    SortablejsModule,
    UploadModule,
    RouterModule.forChild(routes)
  ]
})
export class ManageclassModule { }
