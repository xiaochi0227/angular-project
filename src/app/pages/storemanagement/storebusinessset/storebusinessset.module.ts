import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StorebusinesssetComponent} from './storebusinessset.component';
import { ShareModule } from 'src/app/share.module';
import { NgxAmapModule } from 'ngx-amap';
const routes: Routes = [
  { path: '', component: StorebusinesssetComponent }

];

@NgModule({
  imports: [
    ShareModule,
    RouterModule.forChild(routes),
    // NgxAmapModule.forRoot({
    //   apiKey: 'ba26abf64fe6c1af777352c19a2f5ba8'
    // })
  ],
  declarations: [StorebusinesssetComponent]
})
export class StorebusinesssetModule { }
