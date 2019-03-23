import { NgModule } from '@angular/core';
import { ShareModule } from 'src/app/share.module';
import { AccountRoutingModule } from './account.routing';
import { AccountComponent } from './account.component';

@NgModule({
  imports: [
    ShareModule,
    AccountRoutingModule
  ],
  declarations: [AccountComponent],
  bootstrap: []
})
export class AccountModule {

}

