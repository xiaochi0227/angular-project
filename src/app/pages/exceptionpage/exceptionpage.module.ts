import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { Exception403Component } from './403.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { Exception404Component } from './404.component';
const routes: Routes = [
    { path: '403', component: Exception403Component },
    { path: '404', component: Exception404Component }

];

@NgModule({
    imports: [
        CommonModule,
        NgZorroAntdModule,
        RouterModule.forChild(routes)
    ],
    declarations: [Exception403Component, Exception404Component]
})
export class ExceptionModule { }
