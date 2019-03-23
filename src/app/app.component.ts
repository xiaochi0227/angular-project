import { Component } from '@angular/core';
import { HttpService } from './http/http.service';
import { toBase64String } from '@angular/compiler/src/output/source_map';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'bsp2-ng';
  constructor() {
  }
}
