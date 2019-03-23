import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from 'src/app/share.module';
import { EvaluationRoutingModule } from './evaluation.routing';



@NgModule({
  declarations: [],
  imports: [
    ShareModule,
    EvaluationRoutingModule
  ],
})
export class EvaluationModule { }
