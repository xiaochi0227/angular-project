


import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MarketingComponent } from './marketing.component';    // 导入组件
import { ShareModule } from 'src/app/share.module'; // 常用模块
const routes: Routes = [
    {
        path: '', component: MarketingComponent
    }

];

@NgModule({
    imports: [
        ShareModule,
        RouterModule.forChild(routes)
    ],
    declarations: [MarketingComponent]
})
export class MarketingModule { }    // 导出模块
