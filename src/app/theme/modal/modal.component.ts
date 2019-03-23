import { Component, OnInit, Input, EventEmitter, Output, OnChanges, } from '@angular/core';
@Component({
  selector: 'app-modal',
  template: `
  <nz-modal [(nzVisible)]="isVisible" [nzWidth] = "modalwidth" [nzTitle]="modalTitle" [nzContent]="modalContent" [nzFooter]="modalFooter" (nzOnCancel)="handleCancel()">
  <ng-template #modalTitle>
    {{modaltitle}}
  </ng-template>

  <ng-template #modalContent>
    <ng-content></ng-content>
  </ng-template>

  <ng-template #modalFooter>
    <button nz-button nzType="default" (click)="handleCancel()">关闭</button>
    <button nz-button nzType="primary" *ngIf="confirmisshow" (click)="handleOk()" [nzLoading]="isConfirmLoading">{{confirmtext}}</button>
  </ng-template>
</nz-modal>
      `,
  styleUrls: ['modal.less']

})
export class ModalComponent {
  @Input()
  confirmtext = '确认';
  @Input()
  isVisible = false;
  @Input()
  modalwidth = 600;
  @Input()
  isConfirmLoading = false;
  @Input()
  modaltitle: string;
  @Input()
  confirmisshow = true;
  @Output()
  handleokemit: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  handlecancelemit: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }
  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.handleokemit.emit(this.modaltitle);
  }

  handleCancel(): void {
    this.handlecancelemit.emit();
  }
}

