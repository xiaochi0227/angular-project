import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShareModule } from 'src/app/share.module';
import { AddroleComponent } from './addrole.component';

const routes: Routes = [
  {
    path: '', component: AddroleComponent
  }

];

@NgModule({
  imports: [
    ShareModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AddroleComponent]
})
export class AddroleModule { }
