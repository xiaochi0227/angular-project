import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShareModule } from 'src/app/share.module';
import { FunctionsettingComponent } from './functionsetting.component';

const routes: Routes = [
  { path: '', component: FunctionsettingComponent }

];

@NgModule({
  imports: [
    ShareModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FunctionsettingComponent],
})
export class FunctionsettingModule { }
