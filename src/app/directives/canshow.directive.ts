import { Directive, OnInit, TemplateRef, ViewContainerRef, Input, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Directive({
  selector: '[appCanshow]'
})
export class CanshowDirective implements OnInit, OnDestroy {

  condition: boolean;
  constructor(
    private tmpRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    console.log('++++++++++++++++++++');

    const isAuth = Math.random() < 0.5;
    if (isAuth && this.condition || !this.condition) {
      this.viewContainer.createEmbeddedView(this.tmpRef);
    } else {
      this.viewContainer.clear();
    }
  }
  @Input() set appCanshow(condition: boolean) {
    this.condition = condition;
  }
  ngOnDestroy(): void {
    console.log('-----------------');
  }
}
