import { Component, Directive, EventEmitter, OnInit, Input, Output } from '@angular/core';
@Component({
  selector: 'my-daterange',
  template: `
            <div class="datetime">
                <span class="datespan">
                    <nz-date-picker (ngModelChange)="_startDate=$event;_startValueChange()" [ngModel]="_startDate" [nzAllowClear]='false' [nzDisabledDate]="_disabledStartDate"  [nzFormat]="'YYYY-MM-DD'" [nzPlaceHolder]="'开始日期'" [nzDisabled]= "isdisabled"></nz-date-picker>
                </span><span style="padding:0 5px;">-</span><span class="datespan">
                    <nz-date-picker (ngModelChange)="_endDate=$event;_endValueChange()" [ngModel]="_endDate" [nzAllowClear]='false' [nzDisabledDate]="_disabledEndDate" [nzFormat]="'YYYY-MM-DD'" [nzPlaceHolder]="'结束日期'"></nz-date-picker>
                </span>
            </div>
    `,
  styles: [`
    .datetime{vertical-align:middle;}
    .datetime .datespan{vertical-align:middle;display:inline-block!important;width:47%!important;}
    nz-date-picker {
        width: 100%;
    }
    `]

})
export class DaterangeComponent {
  @Input()
  isdisabled: any;
  @Input()
  _startDate: any;
  @Input()
  _endDate: any;
  @Output()
  startchange: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  endchange: EventEmitter<any> = new EventEmitter<any>();
  result: any[];
  constructor() {
  }


  ngOnInit(): void {

  }
  ngOnChanges() {

  }
  _startValueChange = () => {
    if (this._startDate > this._endDate) {
      this._endDate = null;
    }
    this.startchange.emit(this._startDate);
  }
  _endValueChange = () => {
    if (this._startDate > this._endDate) {
      this._startDate = null;
    }
    this.endchange.emit(this._endDate);
  }
  _disabledStartDate = (startValue) => {
    if (!startValue || !this._endDate) {
      return false;
    }
    return startValue.getTime() > this._endDate.getTime();
  }
  _disabledEndDate = (endValue) => {
    if (!endValue || !this._startDate) {
      return false;
    }
    return endValue.getTime() < this._startDate.getTime();
  }

}

