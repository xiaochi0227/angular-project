import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShareModule } from 'src/app/share.module';
import { UploadModule } from 'src/app/sharecomponets/upload/upload.module';
import { StoreInventoryComponent } from './storeinventory.component';
const routes: Routes = [
  { path: '', component: StoreInventoryComponent }

];

@NgModule({
  imports: [
    ShareModule,
    UploadModule,
    RouterModule.forChild(routes)
  ],
  declarations: [StoreInventoryComponent]
})
export class StoreinventoryModule { }
