import { NgModule } from '@angular/core';
import { LoginComponent } from './login.component';
import { Router, RouterModule } from '@angular/router';
import { ShareModule } from 'src/app/share.module';
import { LoginCardComponent } from 'src/app/theme/logincard/logincard.component';

@NgModule({
  imports: [
    ShareModule,
    RouterModule.forChild([
      { path: '', component: LoginComponent }
    ])
  ],
  declarations: [LoginComponent, LoginCardComponent]
})
export class LoginModule { }
