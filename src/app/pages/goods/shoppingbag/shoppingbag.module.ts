import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShareModule } from 'src/app/share.module';
import { UploadModule } from 'src/app/sharecomponets/upload/upload.module';
import { Shoppingbag } from './shoppingbag.component';

const routes: Routes = [
  { path: '', component: Shoppingbag }

];

@NgModule({
  imports: [
    ShareModule,
    UploadModule,
    RouterModule.forChild(routes)
  ],
  declarations: [Shoppingbag]
})
export class ShoppingbagModule { }
