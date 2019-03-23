import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShareModule } from 'src/app/share.module';
import { BillingstatementjklComponent } from './billingstatementjkl.component';

const routes: Routes = [
  { path: '', component: BillingstatementjklComponent }

];

@NgModule({
  declarations: [BillingstatementjklComponent],
  imports: [
    ShareModule,
    RouterModule.forChild(routes)
  ],
})
export class BillingstatementjklModule { }
