import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PickefficiencyComponent} from './pickefficiency.component';
import { ShareModule } from 'src/app/share.module';
const routes: Routes = [
  { path: '', component: PickefficiencyComponent }

];

@NgModule({
  imports: [
    ShareModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PickefficiencyComponent]
})
export class PickefficiencyModule { }
