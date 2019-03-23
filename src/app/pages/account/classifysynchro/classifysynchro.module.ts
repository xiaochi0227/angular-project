import { NgModule } from '@angular/core';
import { ShareModule } from 'src/app/share.module';
import { Routes, RouterModule } from '@angular/router';
import { ClassifysynchroComponent } from './classifysynchro.component';

const routes: Routes = [{
  path: '', component: ClassifysynchroComponent,
}];

@NgModule({
  declarations: [ClassifysynchroComponent],
  imports: [
    ShareModule,
    RouterModule.forChild(routes)
  ]
})
export class ClassifysynchroModule { }
