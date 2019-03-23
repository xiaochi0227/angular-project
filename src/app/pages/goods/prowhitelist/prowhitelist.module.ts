import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShareModule } from 'src/app/share.module';
import { ProwhitelistComponent } from './prowhitelist.component';
import { UploadModule } from 'src/app/sharecomponets/upload/upload.module';

const routes: Routes = [
  { path: '', component: ProwhitelistComponent }

];

@NgModule({
  imports: [
    ShareModule,
    UploadModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProwhitelistComponent]
})
export class ProwhitelistModule { }
