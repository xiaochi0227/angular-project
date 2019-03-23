


import { Component, OnInit, Injector } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Authbts, Whetherdisplay, GMTToStr } from './../../../validates/validates';
import { HttpService } from 'src/app/http/http.service';    // 导入所用接口
import { BreadcrumbService } from 'src/app/services/breadcrumb.service';    // 面包屑导航

@Component({
    selector: 'app-marketing',
    templateUrl: './marketing.component.html',
    styleUrls: ['./marketing.component.less']
})
export class MarketingComponent implements OnInit {

    // 获取接口服务
    constructor(public router: Router, private http: HttpService, private injector: Injector,
        public activatedRoute: ActivatedRoute, public breadcrumbService: BreadcrumbService) {
        this.breadcrumbService.sendMessage(0);
    }

    ngOnInit() {

    }

    onSkip(i) {

        switch (i) {
            case '1':
                this.router.navigate(['/pages/promotion/goodsDepreciate']); // 商品降价页面
                break;
            case '2':
                this.router.navigate(['/pages/promotion/fullreductionActive']); // 满减活动页面
                break;
        }

    }
}
