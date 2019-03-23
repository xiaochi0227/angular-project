import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { exceptionimg403  } from '../../images';
@Component({
  template: `
    <div class = "content">
      <span class = "leftbox">
        <img [src] ="exceptionimg403" />
      </span>
      <span class = "rightbox">
        <p class="errorcode">403</p>
        <p class = "errormsg">OH NO您暂无权限访问该页面</p>
        <p><button nz-button nzType="primary" nzSize="small">返回</button></p>
      </span>
    </div>
  `,
  styles: [`
    .content{width:720px;height:340px;margin:auto;left:0;right:0;top:0;bottom:0;position:absolute;color:#999;}
    .content .leftbox{display:inline-block;width:315px;vertical-align:top;}
    .content .rightbox{display:inline-block;width:375px;padding-left:30px;padding-top:15px;}
    .content .leftbox img{width:250px;height:314px;}
    .content .rightbox .errorcode{font-size:110px;font-weight:bold;}
    .content .rightbox p{
      -webkit-margin-before: 0em;
      -webkit-margin-after: 0em;
      -webkit-margin-start: 0px;
      -webkit-margin-end: 0px;
    }
    .content .rightbox .errormsg{font-size:18px;margin-bottom:20px;}
  `]
})
export class Exception403Component implements OnInit {
  exceptionimg403: any = exceptionimg403;
  constructor(private logger: NGXLogger) { }
  ngOnInit() {
    this.logger.debug('first');
  }

}
