import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShareModule } from 'src/app/share.module';
import { UploadModule } from 'src/app/sharecomponets/upload/upload.module';
import { OnlineCategory } from './onlinecategory.component';
import { SortablejsModule } from 'angular-sortablejs';
const routes: Routes = [
  { path: '', component: OnlineCategory }

];

@NgModule({
  imports: [
    ShareModule,
    UploadModule,
    SortablejsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OnlineCategory]
})
export class OnlineCategoryModule { }
