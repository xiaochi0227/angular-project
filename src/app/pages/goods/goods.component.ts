import { Component } from '@angular/core';

@Component({
  template: `<router-outlet></router-outlet>`
})
export class GoodsComponent {
  constructor() { console.log('goodsmodule'); }
}
