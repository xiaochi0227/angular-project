import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { DaterangeComponent } from './daterange';
import { PageComponent } from './page/page.component';
import { ChannelTags } from './channeltags';
import { EchartComponent } from './echarts';
import { CanshowDirective } from '../directives/canshow.directive';
import { ImportTip } from './importtip';
import { ModalComponent } from './modal';
import { SeleclAllListComponent } from './selectalllist/selectalllist.component';






const NGA_COMPONENTS = [
  DaterangeComponent,
  PageComponent,
  ChannelTags,
  EchartComponent,
  CanshowDirective,
  ImportTip,
  ModalComponent,
  SeleclAllListComponent
  
];


@NgModule({
  declarations: [
    ...NGA_COMPONENTS,

  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule
  ],
  exports: [
    ...NGA_COMPONENTS,
  ],
  providers: []
})
export class NgaModule {

}
