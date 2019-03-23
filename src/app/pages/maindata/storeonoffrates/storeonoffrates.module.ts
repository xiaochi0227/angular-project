import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';
import { StoreonoffratesComponent } from './storeonoffrates.component';
import { ShareModule } from 'src/app/share.module';
const routes: Routes = [
  { path: '', component: StoreonoffratesComponent }

];

@NgModule({
  declarations: [StoreonoffratesComponent],
  imports: [
    ShareModule,
    RouterModule.forChild(routes)
  ]
})
export class StoreonoffratesModule { }
