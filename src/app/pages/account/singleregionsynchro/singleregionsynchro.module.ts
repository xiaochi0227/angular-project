import { NgModule } from '@angular/core';
import { ShareModule } from 'src/app/share.module';
import { Routes, RouterModule } from '@angular/router';
import { SingleregionsynchroComponent } from './singleregionsynchro.component';
const routes: Routes = [{
  path: '', component: SingleregionsynchroComponent,
}];
@NgModule({
  declarations: [SingleregionsynchroComponent],
  imports: [
    ShareModule,
    RouterModule.forChild(routes)
  ]
})
export class SingleregionsynchroModule { }
