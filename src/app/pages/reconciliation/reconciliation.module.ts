import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from 'src/app/share.module';
import { ReconciliationRoutingModule } from './reconciliation.routing';
@NgModule({
  imports: [
    ShareModule,
    ReconciliationRoutingModule
  ],
  declarations: []
})
export class ReconciliationModule { }
