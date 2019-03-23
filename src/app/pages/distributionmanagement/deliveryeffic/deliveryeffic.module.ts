import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShareModule } from 'src/app/share.module';
import { DeliveryefficComponent } from './deliveryeffic.component';

const routes: Routes = [
  { path: '', component: DeliveryefficComponent }

];

@NgModule({
  imports: [
    ShareModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DeliveryefficComponent]
})
export class DeliveryefficModule { }
