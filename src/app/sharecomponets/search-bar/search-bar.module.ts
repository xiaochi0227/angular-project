import { NgModule } from '@angular/core';
import { SearchBarComponent } from './search-bar.component';
import { ShareModule } from 'src/app/share.module';
@NgModule({
  imports: [
    ShareModule
  ],
  declarations: [SearchBarComponent],
  exports: [
    SearchBarComponent
  ]
})
export class SearchbarModule { }
