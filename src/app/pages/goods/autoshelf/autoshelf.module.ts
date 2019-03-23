import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShareModule } from 'src/app/share.module';
import { AutoShelfComponent } from './autoshelf.component';
import { UploadModule } from 'src/app/sharecomponets/upload/upload.module';

const routes: Routes = [
  { path: '', component: AutoShelfComponent }

];

@NgModule({
  imports: [
    UploadModule,
    ShareModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AutoShelfComponent]
})
export class AutoshelfModule { }
