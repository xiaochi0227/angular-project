import { Component, OnDestroy } from '@angular/core';

@Component({
  template: `<router-outlet></router-outlet>`
})
export class AccountComponent implements OnDestroy {
  ngOnDestroy(): void {
    console.log('accountmodule destroy');
  }
  constructor() {
    console.log('accountmodule');
  }
}
