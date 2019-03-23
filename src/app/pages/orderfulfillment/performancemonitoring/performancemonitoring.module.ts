import { NgModule } from '@angular/core';
import { Routes ,RouterModule} from '@angular/router';
import { ShareModule } from 'src/app/share.module';
import { PerformancemonitoringComponent } from './performancemonitoring.component';

const routes: Routes = [
  { path: '', component: PerformancemonitoringComponent }
];

@NgModule({
  declarations: [PerformancemonitoringComponent],
  imports: [
    ShareModule,
    RouterModule.forChild(routes)
  ]
})
export class PerformancemonitoringModule { }
