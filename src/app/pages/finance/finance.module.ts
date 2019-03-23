import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from 'src/app/share.module';
import { FinanceRoutingModule } from './finance.routing';

@NgModule({
  imports: [
    ShareModule,
    FinanceRoutingModule
  ],
  declarations: []
})
export class FinanceModule { }
