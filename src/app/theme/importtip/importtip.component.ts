import { Component, OnInit, Input, } from '@angular/core';
@Component({
  selector: 'import-tip',
  template: `
    <div class="ant-notification-notice-content" *ngIf="importres&&importres.new">
          <div>
            <div class="ant-notification-notice-message">{{importres.msg}}</div>
            <div class="ant-notification-notice-description" *ngIf="importres.details">
             <p *ngFor="let erorow of importres.details;let i=index">
              {{i+1}}.{{erorow}}
             </p>
            </div>
          </div>
      </div>
      <div class="ant-notification-notice-content" *ngIf="importres&&!importres.new">
      <div>
        <div class="ant-notification-notice-message">{{importres.code}}</div>
        <div class="ant-notification-notice-description" *ngIf="importres.msg">
         <p *ngFor="let erorow of importres.msg;let i=index">
          {{i+1}}.{{erorow}}
         </p>
        </div>
      </div>
  </div>
      `,
  styleUrls: ['importtip.scss']

})
export class ImportTip implements OnInit {
  @Input()
  importres;
  isarray = true;
  constructor() { }
  ngOnInit() {
    console.log(this.importres);

  }
}

