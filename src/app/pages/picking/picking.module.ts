import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PickingRoutingModule } from './picking.routing.module';
import { ShareModule } from 'src/app/share.module';

@NgModule({
  imports: [
    ShareModule,
    PickingRoutingModule,
  ],
  declarations: [],
  bootstrap: []
})
export class PickingModule { }
