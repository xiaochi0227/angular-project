import { Injectable, Injector } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { ActivatedRoute, Router } from '@angular/router';
import { PagesComponent } from "src/app/pages/pages.component";
import { Observable, Subject } from 'rxjs';

@Injectable()
export class BreadcrumbService {
    constructor(private activeRouter: ActivatedRoute) {
        console.log(this.activeRouter);
    }
    private subject = new Subject<any>();

    sendMessage(message: any) {
        this.subject.next({ message });
    }

    clearMessage() {
        this.subject.next();
    }

    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }



    // protected activatedRoute: ActivatedRoute;
    // protected router: Router;
    // protected PagesComponent: PagesComponent;

    // constructor(private baseInjector: Injector) {
    //     this.router = this.baseInjector.get(Router);
    //     this.activatedRoute = this.baseInjector.get(ActivatedRoute);
    //     this.PagesComponent = this.baseInjector.get(PagesComponent);
    //     this.changeBreadcrumb();
    // }

    // changeBreadcrumb() {
    //     console.log(this.activatedRoute);
    //     this.activatedRoute.data.subscribe(res => {
    //         console.log(res.breadcrumb);
    //         this.PagesComponent.getbreadcrumbobj = JSON.parse(localStorage.getItem("breadCrumb"));
    //         if (res.breadcrumb) {
    //             this.PagesComponent.getbreadcrumbobj.push(
    //                 {
    //                     name: res.breadcrumb,
    //                     url: this.router.url
    //                 }
    //             );
    //             this.PagesComponent.getbreadcrumbobj = this.unique(this.PagesComponent.getbreadcrumbobj);
    //             this.PagesComponent.getbreadcrumbobj = JSON.parse(localStorage.getItem("breadCrumb"));
    //             localStorage.setItem("breadCrumb", JSON.stringify(this.PagesComponent.getbreadcrumbobj));
    //             this.PagesComponent.getbreadcrumbobj = JSON.parse(localStorage.getItem("breadCrumb"));
    //         }
    //     });
    // }

    // unique(arr) {
    //     let result = [], i, j, len = arr.length;
    //     for (i = 0; i < len; i++) {
    //         for (j = i + 1; j < len; j++) {
    //             if (arr[i]['name'] === arr[j]['name']) {
    //                 j = ++i;
    //             }
    //         }
    //         result.push(arr[i]);
    //     }
    //     return result;
    // }

}


