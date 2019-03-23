import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArmsService } from './arms.service';
import { ArmsConfig } from './arms.config';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { LoggerModule } from 'ngx-logger';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [], providers: [ArmsService]
})
export class ArmsModule {
  static forRoot(cfg: ArmsConfig): ModuleWithProviders {
    if (!cfg || !cfg.pid || !cfg.imgUrl) {
      throw new Error('配置信息异常');
    }
    return {
      ngModule: LoggerModule,
      providers: [
        { provide: ArmsConfig, useValue: cfg || {} },
        ArmsService
      ]
    };
  }
}
