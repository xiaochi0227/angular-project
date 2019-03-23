import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from './theme/nga.module';

@NgModule({
  // imports: [
  //   CommonModule,
  //   NgZorroAntdModule
  // ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    NgaModule,
  ]
})
export class ShareModule { }
