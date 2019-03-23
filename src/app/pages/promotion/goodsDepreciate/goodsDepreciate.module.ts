import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GoodsDepreciateComponent } from './goodsDepreciate.component';    // 导入首页组件
import { DetailsGoodsDepreciateComponent } from './detailsGoodsDepreciate.component';    // 导入详情组件
import { AddGoodsDepreciateComponent } from './addGoodsDepreciate.component';    // 导入新增组件
import { ShareModule } from 'src/app/share.module'; // 常用模块

const routes: Routes = [
    {
        path: '', component: GoodsDepreciateComponent,
        data: {
            breadcrumb: "单品直降"
        }
    },
    {
        path: 'detailsGoodsDepreciate', component: DetailsGoodsDepreciateComponent,
       
    },
    {
        path: 'addGoodsDepreciate', component: AddGoodsDepreciateComponent,
    }

];

@NgModule({
    imports: [
        ShareModule,
        RouterModule.forChild(routes)
    ],
    declarations: [GoodsDepreciateComponent, DetailsGoodsDepreciateComponent, AddGoodsDepreciateComponent]
})
export class GoodsDepreciateModule { }  // 导出模块
