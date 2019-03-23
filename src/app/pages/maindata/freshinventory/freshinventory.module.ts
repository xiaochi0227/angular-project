import { NgModule } from '@angular/core';
import { FreshinventoryComponent } from './freshinventory.component';
import { Routes, RouterModule } from '@angular/router';
import { ShareModule } from 'src/app/share.module';
import { UploadModule } from 'src/app/sharecomponets/upload/upload.module';

const routes: Routes = [{
  path: '', component: FreshinventoryComponent,
}];

@NgModule({
  imports: [
    ShareModule,
    UploadModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FreshinventoryComponent]
})
export class FreshinventoryModule { }
