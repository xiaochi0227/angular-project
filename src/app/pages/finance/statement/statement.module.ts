import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchbarModule } from 'src/app/sharecomponets/search-bar/search-bar.module';
import { StatementComponent } from './statement.component';
import { ShareModule } from 'src/app/share.module';

const routes: Routes = [
  { path: '', component: StatementComponent }

];

@NgModule({
  imports: [
    ShareModule,
    SearchbarModule,
    RouterModule.forChild(routes)
  ],
  declarations: [StatementComponent]
})
export class StatementModule { }
