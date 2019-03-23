import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShareModule } from 'src/app/share.module';
import { UploadModule } from 'src/app/sharecomponets/upload/upload.module';
import { ReturnList } from './returnlist.component';
import { ReturnOrderCard } from './returnordercard.component';

const routes: Routes = [
  { path: '', component: ReturnList }

];

@NgModule({
  imports: [
    ShareModule,
    UploadModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ReturnList, ReturnOrderCard]
})
export class ReturnlistModule { }
