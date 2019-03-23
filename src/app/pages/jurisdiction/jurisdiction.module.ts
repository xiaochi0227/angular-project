import { NgModule } from '@angular/core';
import { ShareModule } from 'src/app/share.module';
import { JurisdictionRoutingModule } from './jurisdiction.routing';


@NgModule({
  imports: [
    ShareModule,
    JurisdictionRoutingModule,
  ],
  declarations: [],
  bootstrap: []
})
export class JurisdictionModule {

}

