import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShareModule } from 'src/app/share.module';
import { StoredistributionsetComponent } from './storedistributionset.component';
import { UploadModule } from 'src/app/sharecomponets/upload/upload.module';

const routes: Routes = [
  { path: '', component: StoredistributionsetComponent }

];

@NgModule({
  imports: [
    UploadModule,
    ShareModule,
    RouterModule.forChild(routes)
  ],
  declarations: [StoredistributionsetComponent]
})
export class StoredistributionsetModule { }
