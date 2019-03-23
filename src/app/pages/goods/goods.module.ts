import { NgModule } from '@angular/core';
import { ShareModule } from 'src/app/share.module';
import { GoodsRoutingModule } from './goods.routing';


@NgModule({
  imports: [
    ShareModule,
    GoodsRoutingModule,
  ],
  declarations: [],
  bootstrap: []
})
export class GoodsModule {

}

