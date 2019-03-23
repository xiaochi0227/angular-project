import { NgModule } from '@angular/core';
import { EntinfoComponent } from './entinfo.component';
import { Routes, RouterModule } from '@angular/router';
import { ShareModule } from 'src/app/share.module';
const routes: Routes = [{
  path: '', component: EntinfoComponent,
}];

@NgModule({
  imports: [
    ShareModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EntinfoComponent]
})
export class EntinfoModule { }
