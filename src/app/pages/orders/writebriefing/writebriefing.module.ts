import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShareModule } from 'src/app/share.module';
import { UploadModule } from 'src/app/sharecomponets/upload/upload.module';
import { WriteBriefing } from './writebriefing.component';
import { DivScrollDirective, DivScrollLeftDirective } from './divscroll.directive';

const routes: Routes = [
  { path: '', component: WriteBriefing }

];

@NgModule({
  imports: [
    ShareModule,
    UploadModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    WriteBriefing,
    DivScrollDirective,
    DivScrollLeftDirective
  ]
})
export class WritebriefingModule { }
