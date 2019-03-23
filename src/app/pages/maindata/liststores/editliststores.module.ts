import { NgModule } from '@angular/core';
import { EditListStoresComponent } from './editliststores.component';
import { ShareModule } from 'src/app/share.module';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{
  path: '', component: EditListStoresComponent,
}];

@NgModule({
  imports: [
    ShareModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EditListStoresComponent]
})
export class EditliststoresModule { }
