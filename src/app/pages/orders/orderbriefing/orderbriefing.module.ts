import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderBriefingComponent } from './orderbriefing.component';
import { ShareModule } from 'src/app/share.module';
import { SearchbarModule } from 'src/app/sharecomponets/search-bar/search-bar.module';

const routes: Routes = [
  { path: '', component: OrderBriefingComponent }

];

@NgModule({
  imports: [
    ShareModule,
    SearchbarModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OrderBriefingComponent]
})
export class OrderbriefingModule { }
