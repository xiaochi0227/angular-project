import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegiongoodsComponent } from './regiongoods.component';
import { UploadModule } from 'src/app/sharecomponets/upload/upload.module';
import { ShareModule } from 'src/app/share.module';
import { SearchbarModule } from 'src/app/sharecomponets/search-bar/search-bar.module';

const routes: Routes = [
  { path: '', component: RegiongoodsComponent }

];

@NgModule({
  imports: [
    ShareModule,
    SearchbarModule,
    UploadModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RegiongoodsComponent]
})
export class RegiongoodsModule { }
