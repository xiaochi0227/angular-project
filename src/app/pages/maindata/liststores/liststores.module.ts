import { NgModule } from '@angular/core';
import { ListStoresComponent } from './liststores.component';
import { Routes, RouterModule } from '@angular/router';
import { ShareModule } from 'src/app/share.module';
import { UploadModule } from 'src/app/sharecomponets/upload/upload.module';

const routes: Routes = [{
  path: '', component: ListStoresComponent,
}];

@NgModule({
  imports: [
    ShareModule,
    UploadModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ListStoresComponent]
})
export class ListstoresModule { }
