import { Component, OnInit, ViewChild, AfterViewInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AmapMouseToolService, AmapMouseToolWrapper, NgxAmapComponent } from 'ngx-amap';
import { of } from 'rxjs';
import { take } from 'rxjs/operators';
import { Map } from 'ngx-amap/types/class';
// import { Map } from 'rxjs/operators';
import { HttpService } from '../../../http/http.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { NgxAmapModule } from 'ngx-amap';


@Component({
  templateUrl: './shippingfeescope.html',
  styleUrls: ['./shippingfeescope.less']
})
export class ShippingfeescopeComponent implements OnInit, AfterViewInit {
  // 请求参数
  params: any = {
    channel: '',
    region_code: [],
    costs: []
  };
  region_code: any;
  // region_code_fw: any;
  pageSize =
    {
      totalPage: 0,
      count: 0
    };
  itemlists: any;
  itemdate: any;
  cow = 0; // 序号
  channels: any[];
  changecount: any = 0;
  selectitemarr: any = []; // 批量操作选中的门店

  shippingfeearr: any = [
    {
      start_price: '', start_distance: '', start_weight: '',
      price: '', add_weight: '', add_weight_price: ''
      , add_distance: '', add_distance_price: '', time: { start: null, end: null }
    }
  ];
  distance: number;
  editable = false;
  label: any;
  fw_saveopt: Fwopt;
  deliveryRangeType: string;
  channelIndex: number;
  mapcenter: number[];
  hide = false;
  chide = false;
  stores: any;
  region_name: any;
  // region_name_fw: any;
  polygonArr = [];
  ceditoff = true;
  options = {};
  coptions: Coptions;
  amapcircle = true;
  radiusopt: any;
  private plugin: Promise<AmapMouseToolWrapper>;
  @ViewChild(NgxAmapComponent)
  private mapComponent: NgxAmapComponent;
  constructor(private router: ActivatedRoute, private notification: NzNotificationService,
    private mouseToolService: AmapMouseToolService, private http: HttpService,
  ) {
    this.notification.config({
      nzPlacement: 'topRight'
    });
  }
  ngOnInit(): void {
    // 初始化地图中心位置,默认北京
    this.mapcenter = [116.397428, 39.90923];
    this.router.params.forEach((datas: Params) => {
      this.getStorelist();
      if (datas['region_code'] && datas['name']) {
        this.region_code = '';
        this.region_code = datas['region_code'];
        this.region_name = '';
        this.region_name = datas['name'];
        this.getchannels(this.region_code);
      } else {
        // this.shippingfeescopeService.getStorelist()
        //   .then(stores => {
        //     this.stores = stores;
        //     this.region_code = this.stores[0].code;
        //     this.region_name = this.stores[0].codename;
        //     this.getchannels(this.region_code);
        //   });
        this.http.getStorelist.request()
        .subscribe(stores => {
          this.stores = stores;
            this.region_code = this.stores[0].code;
            this.region_name = this.stores[0].codename;
            this.getchannels(this.region_code);
        });

      }
    });

  }
    // 导入提示
  createBasicNotification(template: TemplateRef<{}>): void {
      this.notification.template(template, { nzDuration: 0 });
  }
  ngAfterViewInit() {
    this.plugin = this.mapComponent.ready
      .pipe(take(1))
      .toPromise()
      .then((map: Map) => this.mouseToolService.of(map));


  }
  draw(type: string, typenum) {
    this.plugin
      .then(wrapper => {
        return wrapper[type]();
      })
      .then(res => {
        this.fw_saveopt = this.fw_saveopt || { deliverRange: [] };
        this.fw_saveopt.type = typenum;
        this.fw_saveopt.deliverRange = [];
        for (let i = 0; i < res.yh.path.length; i++) {
          const pathopt = {
            x: '',
            y: ''
          };
          pathopt.x = res.yh.path[i].lng;
          pathopt.y = res.yh.path[i].lat;
          this.fw_saveopt.deliverRange.push(pathopt);
        }
      });
  }

  save() {
    this.fw_saveopt = this.fw_saveopt || { deliverRange: [] };
    this.fw_saveopt.region_code = this.region_code;
    this.fw_saveopt.channel = this.channels[this.channelIndex].code;
    if (this.fw_saveopt.region_code && this.fw_saveopt.channel) {
      // console.log(this.fw_saveopt);
      // this.shippingfeescopeService.storeDeliveryRange(this.fw_saveopt)
      //   .then(res => {
      //     alert(res.msg);

      //   });
       this.http.storeDeliveryRange.request(this.fw_saveopt)
       .subscribe(res => {
         this.notification.create('success', '温馨提示', res['msg']);
       });
    } else {
      this.notification.create('error', '温馨提示', '门店和渠道不能为空!');
    }


  }
  clear() {
    this.editable = false;
    this.fw_saveopt = null;
    this.options = {};
    this.polygonArr = [];
    this.radiusopt = 0;
    this.hide = true;
    this.chide = true;
    // this.fw_saveopt.deliverRange = [];
    this.plugin
      .then(wrapper => {
        return wrapper.close(true);
      });
  }

  getMethods(circle, typenum) {
    this.fw_saveopt = this.fw_saveopt || { deliverRange: [] };
    this.fw_saveopt.type = typenum;
    this.fw_saveopt.deliverRange = [];
    const opt = {
      x: String(this.mapcenter[0]),
      y: String(this.mapcenter[1]),
      radius: '3000',
    };
    this.fw_saveopt.deliverRange.push(opt);
    this.coptions = {
      center: this.mapcenter,
      radius: 3000,
      fillColor: '#0080CE',
      strokeColor: '#F9F9F9',
      strokeWeight: 3,
      strokeOpacity: 1,
      fillOpacity: 0.35
    };
    this.editable = true;
    // // this.editor = true;
    // // this.amapcircle = false;
    // this.plugin
    //   .then(wrapper => {
    //     return wrapper[circle]();
    //   })
    //   .then(res => {
    //     this.fw_saveopt = this.fw_saveopt || { deliverRange: [] };
    //     this.fw_saveopt.type = typenum;
    //     this.fw_saveopt.deliverRange = [];
    //     if (res) {
    //       const opt = {
    //         x: '',
    //         y: '',
    //         radius: ''
    //       };
    //       opt.x = res.yh.center.lng;
    //       opt.y = res.yh.center.lat;
    //       opt.radius = res.yh.radius;
    //       this.fw_saveopt.deliverRange.push(opt);
    //     }

    //     console.log(this.fw_saveopt.deliverRange);

    // });

  }
  setamap(event: any) {
    console.log(event);
  }
  getStorelist() {
    // this.shippingfeescopeService.getStorelist()
    //   .then(stores => {
    //     this.stores = stores;
    //   });
      this.http.getStorelist.request()
      .subscribe(stores => {
        this.stores = stores;
      });
  }
  searchcode($event) {
    this.region_code = $event;
    this.getchannels(this.region_code);
  }
  // 门店列表选择显示编码加名称
  searchname($event) {
    this.region_name = $event;
  }
  searchcode_fw($event) {
    this.region_code = $event;
    this.getchannels(this.region_code);
  }
  // 门店列表选择显示编码加名称
  searchname_fw($event) {
    this.mapcenter = null;
    this.clear();
    this.channelIndex = 0;
    this.label = null;
    this.region_name = $event;
  }



  // 获取渠道
  getchannels(regioncode): void {
    // this.shippingfeescopeService.getchannels(regioncode)
    //   .then(channels => {
    //     const tmp = [{ code: '', name: '请选择渠道' }].concat(channels);
    //     this.channels = tmp;
    //   });
    console.log(regioncode);
      this.http.queryStoreCoordinate.request<any>(regioncode)
      .subscribe(channels => {
        const tmp = [{ code: '', name: '请选择渠道' }].concat(channels);
        this.channels = tmp;
      });
  }

  Reset() {
    this.params.search.channel = '';
    this.region_code = '';
    this.region_name = '';
  }

  n: any = 0;
  addBtn() { // 批量设置时间时添加一个时间范围
    this.n++;
    const dateitem: any = {
      start_price: '', start_distance: '', start_weight: '',
      price: '', add_weight: '', add_weight_price: ''
      , add_distance: '', add_distance_price: '', time: { start: '', end: '' }, timestr: ''
    };
    this.shippingfeearr.push(dateitem);
  }

  // 批量设置时间时删除一个时间范围
  delBtn(index: any) {
    this.shippingfeearr.splice(index, 1);
  }

  saveshippingfee(params) {
    this.params.region_code = [];
    let check = false;
    console.log(this.shippingfeearr);
    for (let i = 0; i < this.shippingfeearr.length; i++) {
      let shourstr: any = '';
      let sminutesstr: any = '';
      let ehourstr: any = '';
      let eminutesstr: any = '';
      if (this.shippingfeearr[i].time.start && this.shippingfeearr[i].time.end) {
        check = true;
        this.shippingfeearr[i].time.start = new Date(this.shippingfeearr[i].time.start).getTime();
        this.shippingfeearr[i].time.end = new Date(this.shippingfeearr[i].time.end).getTime();
        const startdate = new Date(this.shippingfeearr[i].time.start);
        const enddate = new Date(this.shippingfeearr[i].time.end);
        console.log(this.shippingfeearr[i].time.start);

        if (startdate.getHours() >= 10) {
          shourstr = startdate.getHours();
        } else {
          shourstr = '0' + startdate.getHours();
        }
        if (startdate.getMinutes() >= 10) {
          sminutesstr = startdate.getMinutes();
        } else {
          sminutesstr = '0' + startdate.getMinutes();
        }

        if (enddate.getHours() >= 10) {
          ehourstr = enddate.getHours();
        } else {
          ehourstr = '0' + enddate.getHours();
        }
        if (enddate.getMinutes() >= 10) {
          eminutesstr = enddate.getMinutes();
        } else {
          eminutesstr = '0' + enddate.getMinutes();
        }
        const timeobjstart = shourstr + ':' + sminutesstr;

        const timeobjend = ehourstr + ':' + eminutesstr;
        const opt = timeobjstart + '-' + timeobjend;
        this.shippingfeearr[i].timestr = opt;
      } else {
        this.notification.create('error', '温馨提示', '开始时间和结束时间必填!');
        check = false;
        break;
      }

    }
    params.costs = JSON.parse(JSON.stringify(this.shippingfeearr));
    for (let i = 0; i < params.costs.length; i++) {
      params.costs[i].time = params.costs[i].timestr;
      delete params.costs[i].timestr;
    }
    params.region_code.push(this.region_code);
    if (check) {
      console.log(this.params);
      // this.shippingfeescopeService.saveshippingfee(this.params)
      //   .then(res => {
      //     this.notification.blank('提示', res.msg);
      //   });
      this.http.getsavepsfj.request(this.params)
      .subscribe(res => {
        this.notification.create('success', '温馨提示', res['msg']);
      });
    }
  }

  search(store, channel) {
    const opt = {
      region_code: store,
      channel: channel
    };
    // this.shippingfeescopeService.queryStoreCost(opt)
    //   .then(res => {
    this.http.queryStoreCost.request(opt)
    .subscribe(res => {
        if (res['costs']) {
          this.shippingfeearr = res['costs'];
          for (let i = 0; i < this.shippingfeearr.length; i++) {
            this.shippingfeearr[i].timestr = this.shippingfeearr[i].time;
            const d = new Date();
            this.shippingfeearr[i].time = {
              start: d.setHours(this.shippingfeearr[i].timestr.substr(0, 2),
                this.shippingfeearr[i].timestr.substr(3, 2)),
              end: d.setHours(this.shippingfeearr[i].timestr.substr(6, 2),
                this.shippingfeearr[i].timestr.substr(9, 2))
            };
          }
        } else {
          this.shippingfeearr = [];
          const dateitem: any = {
            start_price: '', start_distance: '', start_weight: '',
            price: '', add_weight: '', add_weight_price: ''
            , add_distance: '', add_distance_price: '', time: { start: '', end: '' }, timestr: ''
          };
          this.shippingfeearr.push(dateitem);
        }
      });
  }
  search_fw(store) {
    if (this.channelIndex < 1) {
      return;
    }
    const channel = this.channels[this.channelIndex].code;
    const opt = {
      region_code: store,
      channel: channel
    };
    if (this.channels[this.channelIndex].longitude && this.channels[this.channelIndex].latitude) {
      this.mapcenter = [Number(this.channels[this.channelIndex].longitude), Number(this.channels[this.channelIndex].latitude)]
    }
    this.label = {
      offset: {
        x: 20,
        y: 20
      },
      content: this.region_name
    };

    // this.shippingfeescopeService.queryStoreDeliveryRange(opt)
    //   .then(res => {
    //     this.fw_saveopt = {
    //       deliverRange: res.deliveryRange,
    //       type: res.delivery_range_type,
    //       channel: channel,
    //       region_code: store
    //     };
        this.http.StoreDeliveryRange.request(opt)
        .subscribe(res => {
          this.fw_saveopt = {
            deliverRange: res['deliveryRange'],
            type: res['delivery_range_type'],
            channel: channel,
            region_code: store
          };
        // });
        if (this.fw_saveopt.type === '2') {
          if (this.fw_saveopt && this.fw_saveopt.deliverRange.length > 0) {
            for (let i = 0; i < this.fw_saveopt.deliverRange.length; i++) {
              const obj = [this.fw_saveopt.deliverRange[i].x, this.fw_saveopt.deliverRange[i].y];
              this.polygonArr.push(obj);
            }
            this.hide = false;
            this.options = {
              path: this.polygonArr,
              strokeColor: '#FF33FF',
              strokeOpacity: 0.2,
              strokeWeight: 3,
              fillColor: '#1791fc',
              fillOpacity: 0.35
            };
          } else {
            this.clear();
          }
        } else {
          if (this.fw_saveopt.deliverRange && this.fw_saveopt.deliverRange[0] && this.fw_saveopt.deliverRange[0].radius) {
            this.coptions = {
              center: [Number(this.fw_saveopt.deliverRange[0].x), Number(this.fw_saveopt.deliverRange[0].y)],
              radius: Number(this.fw_saveopt.deliverRange[0].radius),
              fillColor: '#0080CE',
              strokeColor: '#F9F9F9',
              strokeWeight: 3,
              strokeOpacity: 1,
              fillOpacity: 0.35
            };
            console.log(this.coptions);

          } else {
            this.clear();
          }

        }
        this.editable = true;
      });
  }
  onEvent(event) {
    if (this.fw_saveopt && this.fw_saveopt.type === '1' && event && event.target && event.target.yh && event.target.yh.center) {
      const dev = {
        x: event.target.yh.center.lng,
        y: event.target.yh.center.lat,
        radius: event.target.yh.radius
      }
      this.fw_saveopt.deliverRange[0] = dev;
    }
  }
  editorEnd(event) {
    this.coptions = null;
  }
  onMapReady(map) {
    map.setDefaultCursor('crosshair')
  }
  onMouseOver(event) {
    if (event.lnglat && this.mapcenter && this.channelIndex && this.channelIndex !== 0) {
      this.distance = Math.round(event.lnglat.distance(this.mapcenter));
    }
  }
  onPolygonEnd(e) {
    console.log(e);
  }
}


interface CircleOptions {
  center: number[];
  radius: number;
  strokeColor: string;
  strokeOpacity: number;
  strokeWeight: number;
  fillColor: string;
  fillOpacity: number;
}

interface FwSaveopt {
  region_code: string;
  channel: string;
  type: string;
  deliverRange: {
    x: string;
    y: string;
    radius?: string;
  }[];
}
type Fwopt = Partial<FwSaveopt>;

export type Coptions = Partial<CircleOptions>;
