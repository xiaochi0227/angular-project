import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { BusinessoverviewComponent } from './businessoverview.component';
import { PiechartComponent } from './piechart/piechart.component';
const routes: Routes = [
    { path: '', component: BusinessoverviewComponent }

];

@NgModule({
    imports: [
        CommonModule,
        NgZorroAntdModule,
        RouterModule.forChild(routes)
    ],
    declarations: [BusinessoverviewComponent, PiechartComponent]
})
export class BusinessoverviewModule { }
