import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShareModule } from 'src/app/share.module';
import { ActivitylistComponent } from './activitylist.component';
import { SearchbarModule } from 'src/app/sharecomponets/search-bar/search-bar.module';

const routes: Routes = [
  {
    path: '', component: ActivitylistComponent
  }
];
@NgModule({
  declarations: [ActivitylistComponent],
  imports: [
    ShareModule,
    SearchbarModule,
    RouterModule.forChild(routes)
  ]
})
export class ActivitylistModule { }
