import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersRoutingModule } from './orders.routing.module';
import { ShareModule } from 'src/app/share.module';

@NgModule({
  imports: [
    ShareModule,
    OrdersRoutingModule,
  ],
  declarations: [],
  bootstrap: []
})
export class OrdersModule { }
