import { Component } from '@angular/core';
import { NGXLogger } from 'ngx-logger';

@Component({
  styles: [],
  template: `<router-outlet></router-outlet>`
})
export class OrdersComponent {
  constructor(private logger: NGXLogger) {
    this.logger.log('orders');
  }
}
