import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PromotionscontrolComponent } from './promotionscontrol.component';    // 导入组件
import { ShareModule } from 'src/app/share.module'; // 常用模块
const routes: Routes = [
    {
        path: '', component: PromotionscontrolComponent
    }

];

@NgModule({
    imports: [
        ShareModule,
        RouterModule.forChild(routes)
    ],
    declarations: [PromotionscontrolComponent]
})
export class PromotionscontrolModule { }    // 导出模块
