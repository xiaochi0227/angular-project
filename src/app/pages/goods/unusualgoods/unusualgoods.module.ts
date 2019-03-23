import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShareModule } from 'src/app/share.module';
import { UploadModule } from 'src/app/sharecomponets/upload/upload.module';
import { UnusualComponent } from './unusualgoods.component';
import { RenameGoodsComponent } from './renamegoods/renamegoods.component';
import { LongNames } from './longnames/longnames.component';

const routes: Routes = [
  {
    path: '', component: UnusualComponent,
    children: [
      { path: '', redirectTo: 'renamegoods', pathMatch: 'full' },
      { path: 'renamegoods', component: RenameGoodsComponent },
      { path: 'longnames', component: LongNames },
      { path: '**', redirectTo: 'renamegoods' }
    ]
  }

];

@NgModule({
  imports: [
    ShareModule,
    UploadModule,
    RouterModule.forChild(routes)
  ],
  declarations: [UnusualComponent, RenameGoodsComponent, LongNames]
})
export class UnusualModule { }
