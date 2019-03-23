import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { emit } from 'cluster';
@Component({
  selector: 'app-my-multipleselect',
  template: `      <nz-dropdown [nzTrigger]="'click'" (nzVisibleChange)="emitArray(selectStoreList)">
  <input type="text" nz-input nz-dropdown [(ngModel)]="selectStoreList" readonly >
  <div nz-menu style="background: white;max-height: 360px;overflow: auto; padding: 7px;">
    <nz-input-group [nzSuffix]="suffixIconSearch">
      <input type="text" nz-input placeholder="搜索{{tableName}}" style="margin-bottom: 7px;" [(ngModel)]="searchItem" (ngModelChange)="searchList($event,checkValue)">
      <ng-template #suffixIconSearch>
        <i nz-icon type="search"></i>
      </ng-template>
    </nz-input-group>
    <nz-table appDrag nzSize="small" nzFrontPagination="false" nzHideOnSinglePage="true" #basicTable [nzData]="list">
      <thead>
        <tr>
          <th nzShowCheckbox #checkValue (click)="setimportallstore(checkValue)"></th>
          <th>{{tableName}}</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let item of basicTable.data">
          <td nzShowCheckbox [(nzChecked)]="item.sfxz" (click)="checkList(checkValue,item)"></td>
          <td>{{item.codename}}</td>
        </tr>
      </tbody>
    </nz-table>
  </div>
</nz-dropdown>`
})
export class SeleclAllListComponent implements OnInit, OnChanges {
  @Input() list: any;             // 列表
  @Input() tableName: String;     // 表单名称
  @Input() searchZd = "codename"; // 搜索用的字段
  @Input() returnType = 'all';   // all :返回全部数组
  @Output() childparams: EventEmitter<any> = new EventEmitter<any>();
  selectStoreList = [];
  searchItem: any;
  private initlist: any;

  constructor() {
  }
  ngOnInit(): void {
  }

  ngOnChanges() {
    if (this.list) {
      this.initlist = JSON.parse(JSON.stringify(this.list));
    }
  }

  emitArray(event) {
    let arr = [];
    if (this.list.length !== 0 && event.length !== 0) {
      if (this.returnType === 'all') {
        this.list.forEach(item => {
          event.forEach(item2 => {
            if (item.code === item2) {
              arr.push(item);
            }
          });
        });
        this.childparams.emit(arr);
      } else {
        this.childparams.emit(event);
      }
    }


    console.log(event);

  }
  // 选择所有门店
  setimportallstore(event) {
    this.selectStoreList = [];
    event.nzIndeterminate = false;
    if (event.nzChecked) {
      this.list.forEach(item => {
        item.sfxz = true;
        this.selectStoreList.push(item.code);
      });
    } else {
      this.list.forEach(item => item.sfxz = false);
      this.selectStoreList = [];
    }
  }

  checkList(event, listItem) {
    if (this.list.every(item => item.sfxz === true)) {
      event.nzIndeterminate = false;
      event.nzChecked = true;
    } else if (this.list.every(item => item.sfxz === false)) {
      event.nzIndeterminate = false;
      event.nzChecked = false;
    } else {
      event.nzIndeterminate = true;
    }
    if (this.list.length === this.initlist.length) {
      // 没有启动搜索
      this.selectStoreList = this.list
        .filter(item => item.sfxz === true)
        .map(item => item.code);
    } else {
      if (listItem.sfxz === true) {
        this.selectStoreList.push(listItem.code);
      } else {

        for (let i = 0; i < this.selectStoreList.length; i++) {
          if (this.selectStoreList[i] === listItem.code) {
            this.selectStoreList.splice(i, 1);
          }
        }
      }
      this.selectStoreList = this.selectStoreList.slice();
    }

  }
  searchList(event, tabelModal) {
    this.list = this.searchByRegExp(event, this.initlist, 'codename');
    this.compareArray(this.selectStoreList, this.list);
    if (this.list.every(item => item.sfxz === true)) {
      tabelModal.nzIndeterminate = false;
      tabelModal.nzChecked = true;
    } else if (this.list.every(item => item.sfxz === false)) {
      tabelModal.nzIndeterminate = false;
      tabelModal.nzChecked = false;
    } else {
      if (this.list.some(item => item.sfxz === false) && this.list.some(item => item.sfxz === true)) {
        tabelModal.nzIndeterminate = true;
      }

    }
    console.log(this.list);
  }

  searchByRegExp(keyWord, list, zd) {
    console.log(list);
    if (!(list instanceof Array)) {
      return;
    }
    let arr = [];
    let reg = new RegExp(keyWord, 'i');
    for (let i = 0; i < list.length; i++) {
      if (list[i][zd]) {
        if (list[i][zd].match(reg)) {
          arr.push(list[i]);
        }
      }
    }
    return arr;
  }

  compareArray(checklist, list) {
    if (checklist.length > 0) {
      checklist.forEach((item) => {
        list.forEach((item1) => {
          if (item === item1.code) {
            console.log(item);
            item1.sfxz = true;
          }
        });
      });
    }
  }

}

