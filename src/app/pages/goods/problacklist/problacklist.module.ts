import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShareModule } from 'src/app/share.module';
import { ProBlackListComponent } from './problacklist.component';

const routes: Routes = [
  { path: '', component: ProBlackListComponent }

];

@NgModule({
  imports: [
    ShareModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProBlackListComponent]
})
export class ProblacklistModule { }
