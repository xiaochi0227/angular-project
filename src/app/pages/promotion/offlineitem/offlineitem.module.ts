import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OfflineitemComponent } from './offlineitem.component';    // 导入组件
import { ShareModule } from 'src/app/share.module'; // 常用模块
const routes: Routes = [
    {
        path: '', component: OfflineitemComponent
    }

];

@NgModule({
    imports: [
        ShareModule,
        RouterModule.forChild(routes)
    ],
    declarations: [OfflineitemComponent]
})
export class OfflineitemModule { }    // 导出模块
