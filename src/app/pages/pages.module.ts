import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages.routing.module';
import { ShareModule } from '../share.module';


@NgModule({
  imports: [
    ShareModule,
    PagesRoutingModule,
  ],
  providers: [],
  declarations: [PagesComponent],
  bootstrap: []
})
export class PagesModule { }
