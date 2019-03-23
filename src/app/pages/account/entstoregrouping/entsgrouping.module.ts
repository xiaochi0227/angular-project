import { NgModule } from '@angular/core';
import { EntstoreGroupingComponent } from './entstoregrouping.component';
import { ShareModule } from 'src/app/share.module';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{
  path: '', component: EntstoreGroupingComponent,
}];

@NgModule({
  imports: [
    ShareModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EntstoreGroupingComponent]
})
export class EntsgroupingModule { }
