import { NgModule } from '@angular/core';
import { ImportlistComponent } from './importlist.component';
import { ShareModule } from 'src/app/share.module';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [{
  path: '', component: ImportlistComponent,
}];

@NgModule({
  imports: [
    ShareModule,
    RouterModule.forChild(routes),
  ],
  declarations: [ImportlistComponent]
})
export class ImportlistModule { }
