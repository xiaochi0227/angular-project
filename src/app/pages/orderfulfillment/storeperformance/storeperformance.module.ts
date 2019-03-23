import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShareModule } from 'src/app/share.module';
import { StoreperformanceComponent } from './storeperformance.component';
import { SearchbarModule } from 'src/app/sharecomponets/search-bar/search-bar.module';

const routes: Routes = [
  { path: '', component: StoreperformanceComponent }

];
@NgModule({
  imports: [
    ShareModule,
    SearchbarModule,
    RouterModule.forChild(routes)
  ],
  declarations: [StoreperformanceComponent]
})
export class StoreperformanceModule { }
