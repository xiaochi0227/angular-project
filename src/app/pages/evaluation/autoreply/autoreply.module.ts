import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchbarModule } from 'src/app/sharecomponets/search-bar/search-bar.module';
import { ShareModule } from 'src/app/share.module';
import { AutoreplyComponent } from './autoreply.component';
const routes: Routes = [
  { path: '', component: AutoreplyComponent }

];

@NgModule({
  declarations: [AutoreplyComponent],
  imports: [
    ShareModule,
    SearchbarModule,
    RouterModule.forChild(routes)
  ]
})
export class AutoreplyModule { }
