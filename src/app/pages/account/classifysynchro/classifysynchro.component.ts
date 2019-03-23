import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/http/http.service';

@Component({
  selector: 'app-classifysynchro',
  templateUrl: './classifysynchro.component.html',
  styleUrls: ['./classifysynchro.component.less']
})
export class ClassifysynchroComponent implements OnInit {

  params: any = {
    'ent_id': '',
    'region_code': "",
    'cat_code': "",
    'name': ""
  };
  public storelist: any;
  public ents: any;
  entItem: any;
  res: any;
  constructor(private http: HttpService) { }

  ngOnInit() {
    this.getents();
  }

  getents(): void {

    this.http.getents.request()
      .subscribe(res => {
        console.log(res);
        this.ents = res['data'];
      });
  }

  getStoreList(ent_id) {
    this.http.getregions.request(ent_id)
      .subscribe((data) => {
        this.storelist = data;
      });
  }

  viewSelectList(event) {
    this.params.regions = event;
    console.log(this.params);
  }
  onegoodsadd() {

  }
  onegoodsedit() {

  }
  onegoodsprice() {

  }
  onegoodsstock() {

  }
  onegoodsonoff() {

  }
}
