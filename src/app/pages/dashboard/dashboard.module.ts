import { NgModule } from '@angular/core';
import { ShareModule } from 'src/app/share.module';
import { DashboardRoutingModule } from './dashboard.routing';
@NgModule({
  imports: [
    ShareModule,
    DashboardRoutingModule
  ],
  declarations: [],
  bootstrap: []
})
export class DashboardModule {

}

