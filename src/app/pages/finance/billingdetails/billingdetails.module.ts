import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShareModule } from 'src/app/share.module';
import { BillingdetailsComponent } from './billingdetails.component';
import { SearchbarModule } from 'src/app/sharecomponets/search-bar/search-bar.module';

const routes: Routes = [
  { path: '', component: BillingdetailsComponent }

];
@NgModule({
  imports: [
    ShareModule,
    SearchbarModule,
    RouterModule.forChild(routes)
  ],
  declarations: [BillingdetailsComponent]
})
export class BillingdetailsModule { }
