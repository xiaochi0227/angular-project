import { Component } from '@angular/core';

@Component({
  template: `<router-outlet></router-outlet>`
})
export class FinanceComponent {
  constructor() { console.log('FinanceComponent'); }
}
