import { Component } from '@angular/core';
import { NGXLogger } from 'ngx-logger';

@Component({
  template: `<router-outlet></router-outlet>`
})
export class JurisdictionComponent {
  constructor(private logger: NGXLogger) {
    this.logger.log('jurisdiction');
  }
}
