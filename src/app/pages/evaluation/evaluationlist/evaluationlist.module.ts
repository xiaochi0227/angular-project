import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchbarModule } from 'src/app/sharecomponets/search-bar/search-bar.module';
import { ShareModule } from 'src/app/share.module';
import { EvaluationlistComponent } from './evaluationlist.component';

const routes: Routes = [
  { path: '', component: EvaluationlistComponent }

];

@NgModule({
  imports: [
    ShareModule,
    SearchbarModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EvaluationlistComponent]
})
export class EvaluationlistModule { }
