import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { exceptionimg404  } from '../../images';
@Component({
  template: `
    <div class = "content">
      <span class = "leftbox">
        <img [src] ="exceptionimg404" />
      </span>
      <span class = "rightbox">
        <p class="errorcode">404</p>
        <p class = "errormsg">OH NO您访问的页面不存在</p>
        <p><button nz-button nzType="primary" nzSize="small">返回</button></p>
      </span>
    </div>
  `,
  styles: [`
    .content{width:720px;height:340px;margin:auto;left:0;right:0;top:0;bottom:0;position:absolute;color:#999;}
    .content .leftbox{display:inline-block;width:315px;vertical-align:top;}
    .content .rightbox{display:inline-block;width:375px;padding-left:30px;padding-top:15px;}
    .content .leftbox img{width:280px;height:267px;}
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
export class Exception404Component implements OnInit {
  exceptionimg404: any = exceptionimg404;
  constructor(private logger: NGXLogger) { }
  ngOnInit() {
    this.logger.debug('first');
  }

}
