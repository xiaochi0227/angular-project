import { Component, OnInit, Input, Output } from '@angular/core';
@Component({
  selector: 'my-channeltags',
  template: `<span [ngSwitch]="getchannel">
                <nz-tag *ngSwitchCase="'MTWM'" [nzColor]="'#eaae17'">美团外卖</nz-tag>
                <nz-tag *ngSwitchCase="'BDWM'" [nzColor]="'#d8112f'">饿了么星选</nz-tag>
                <nz-tag *ngSwitchCase="'ELEM'" [nzColor]="'#2e82c5'">饿了么</nz-tag>
                <nz-tag *ngSwitchCase="'JDDJ'" [nzColor]="'#00833f'">京东到家</nz-tag>
                <nz-tag *ngSwitchCase="'JDSC'" [nzColor]="'#f00'">京东商城</nz-tag>
                <nz-tag *ngSwitchCase="'WSC'" [nzColor]="'#ed6d02'">福州电信</nz-tag>
                <nz-tag *ngSwitchCase="'YINZUO'" [nzColor]="'#e60012'">银座云生活</nz-tag>
                <nz-tag *ngSwitchCase="'ABLAPP'" [nzColor]="'#ff4081'">爱便利</nz-tag>
                <nz-tag *ngSwitchCase="'YOUZAN'" [nzColor]="'#2c3a46'">有赞</nz-tag>
                <nz-tag *ngSwitchCase="'HXTZ'" [nzColor]="'#4c7795'">火星兔子</nz-tag>
                <nz-tag *ngSwitchCase="'HGDJ'" [nzColor]="'#2a2a72'">华冠到家</nz-tag>
                <nz-tag *ngSwitchCase="'CSH5'" [nzColor]="'#930701'">城市超市H5</nz-tag>
                <nz-tag *ngSwitchCase="'QSG'" [nzColor]="'#30c749'">轻松购</nz-tag>
                <nz-tag *ngSwitchCase="'MTWMFOOD'" [nzColor]="'#eaae17'">美团餐饮</nz-tag>
                <nz-tag *ngSwitchCase="'SMG'" [nzColor]="'#eaae17'">美团扫码购</nz-tag>
                <nz-tag *ngSwitchCase="'SHERPAS'" [nzColor]="'#ff9820'">食派士</nz-tag>
                <nz-tag *ngSwitchCase="'WDH'" [nzColor]="'#f111c5'">微电汇</nz-tag>
                <nz-tag *ngSwitchCase="'ELEMFOOD'" [nzColor]="'#2e82c5'">饿了么餐饮</nz-tag>
                <nz-tag *ngSwitchCase="'YJG'" [nzColor]="'#eb5c24'">易佳购</nz-tag>
                <nz-tag *ngSwitchCase="'JKLAPP'" [nzColor]="'#5fb631'">京客隆APP</nz-tag>
              </span>`
})
export class ChannelTags implements OnInit {
  @Input()
  getchannel: any;
  constructor() {
  }
  ngOnInit(): void {

  }

}

