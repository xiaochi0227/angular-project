import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'unusualgoods',
  styleUrls: ['./unusualgoods.less'],
  template: `<div class="widgets">
  <div class="row">
      <div class="tabdiv">
        <nz-tabset>
          <nz-tab (nzClick)="search(0)" nzTitle = "重名商品">
          <router-outlet></router-outlet>
          </nz-tab>
          <nz-tab (nzClick)="search(1)" nzTitle="名称过长商品">
          <router-outlet></router-outlet>
          </nz-tab>
        </nz-tabset>
      </div>
  </div>
</div>`
})
export class UnusualComponent {
  constructor(private router: Router) { }
  search(i) {
    if (i === 0) {
      this.router.navigate(['/pages/goods/unusualgoods/renamegoods']);
    } else if (i === 1) {
      this.router.navigate(['/pages/goods/unusualgoods/longnames']);
    }
  }
}


