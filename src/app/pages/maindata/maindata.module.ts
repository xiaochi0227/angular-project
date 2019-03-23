import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from 'src/app/share.module';
import { MaindataRoutingModule } from "./maindata.routing";

@NgModule({
  imports: [
    ShareModule,
    MaindataRoutingModule,
  ],
  declarations: [],
  bootstrap: []
})
export class MaindataModule { }
