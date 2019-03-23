import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShareModule } from '../../../share.module';
import { UploadModule } from '../../../sharecomponets/upload/upload.module';
import { WillsellventoryComponent } from './willsellventory.component';
const routes: Routes = [
  { path: '', component: WillsellventoryComponent }

];

@NgModule({
  imports: [
    ShareModule,
    UploadModule,
    RouterModule.forChild(routes)
  ],
  declarations: [WillsellventoryComponent]
})
export class WillsellventoryModule { }
