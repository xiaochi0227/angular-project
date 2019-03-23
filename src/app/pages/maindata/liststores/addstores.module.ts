import { NgModule } from '@angular/core';
import { AddStoresComponent } from './addstores.component';
import { ShareModule } from 'src/app/share.module';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{
  path: '', component: AddStoresComponent,
}];

@NgModule({
  imports: [
    ShareModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AddStoresComponent]
})
export class AddstoresModule { }

