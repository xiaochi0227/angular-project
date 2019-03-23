import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShareModule } from 'src/app/share.module';
import { StoreonoffrateComponent } from './storeonoffrate.component';
import { SearchbarModule } from 'src/app/sharecomponets/search-bar/search-bar.module';
const routes: Routes = [
  { path: '', component: StoreonoffrateComponent }
];
@NgModule({
  declarations: [StoreonoffrateComponent],
  imports: [
    ShareModule,
    SearchbarModule,
    RouterModule.forChild(routes)
  ]
})
export class StoreonoffrateModule { }
