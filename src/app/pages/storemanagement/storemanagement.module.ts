import { NgModule } from '@angular/core';
import { ShareModule } from 'src/app/share.module';

import { StoremanagementRoutingModule } from './storemanagement.routing';
@NgModule({
  imports: [
    ShareModule,
    StoremanagementRoutingModule
  ],
  declarations: [],
  bootstrap: []
})
export class StoremanagementModule {

}
