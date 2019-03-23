import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShareModule } from 'src/app/share.module';
import { SearchbarModule } from 'src/app/sharecomponets/search-bar/search-bar.module';
import { testsettlementComponent } from './testsettlement.component';

const routes: Routes = [
  { path: '', component: testsettlementComponent }
];

@NgModule({
  imports: [
    ShareModule,
    SearchbarModule,
    RouterModule.forChild(routes)
  ],
  declarations: [testsettlementComponent]
})
export class testsettlementModule { }
