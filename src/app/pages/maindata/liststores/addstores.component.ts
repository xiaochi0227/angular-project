import { Component, Input, OnInit } from '@angular/core';
// import { ListStoresService } from './liststores.service';
import { HttpService } from '../../../http/http.service';
import { NzNotificationService } from 'ng-zorro-antd';
@Component({
    templateUrl: './addstores.html',
    styleUrls: ['./liststores.less']
})


export class AddStoresComponent implements OnInit {
    storesarr: any;
    constructor(private http: HttpService, private notification: NzNotificationService) { }
    ngOnInit(): void {
        this.storesarr = [{
            code: '',
            city: '',
            name: '',
            address: '',
            kcgxl: '',
            aqkcl: '',
            area: '',
            status: ''
        }];
    }
    addrows() {
        let option: any = {
            code: '',
            city: '',
            name: '',
            address: '',
            kcgxl: '',
            aqkcl: '',
            area: '',
            status: ''
        };
        this.storesarr.push(option);
    }
    del(index: any): void {
        this.storesarr.splice(index, 1);
    }

    // 新增门店
    addStore(storesarr): void {

        let data = {
            storesarr: storesarr
        };


        // this.listStoresService.addStore(data)
        //     .then(tip => {
        //         alert(tip.msg);
        //     });
        this.http.addstore.request(data)
        .subscribe(tip => {
          this.notification.create('success', '温馨提示', tip['msg']);
        });



    }



}



