import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShareModule } from 'src/app/share.module';
import { WeekSalesRankingsComponent } from './weeksalesrankings.component';
import { SearchbarModule } from 'src/app/sharecomponets/search-bar/search-bar.module';

const routes: Routes = [
  { path: '', component: WeekSalesRankingsComponent }

];

@NgModule({
  imports: [
    ShareModule,
    SearchbarModule,
    RouterModule.forChild(routes)
  ],
  declarations: [WeekSalesRankingsComponent]
})
export class WeeksalerankingModule { }
