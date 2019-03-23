import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShareModule } from 'src/app/share.module';
import { CategorysalesrepComponent } from './categorysalesrep.component';

const routes: Routes = [
  { path: '', component: CategorysalesrepComponent }

];

@NgModule({
  declarations: [CategorysalesrepComponent],
  imports: [
    ShareModule,
    RouterModule.forChild(routes)
  ],
})
export class CategorysalesrepModule { }
