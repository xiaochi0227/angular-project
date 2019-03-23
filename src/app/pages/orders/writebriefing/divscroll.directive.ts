import { Directive, ElementRef, Input, HostListener, OnChanges } from '@angular/core';
@Directive({
    selector: '[myDivScroll]'
})
export class DivScrollDirective {
    @Input('myDivScroll') myscrolltop: number;
    constructor(private el: ElementRef) {
        el.nativeElement.style.top = 0;
    };

    ngOnChanges() { // 输入属性有变化时触发ngOnChanges方法
        this.el.nativeElement.style.top = this.myscrolltop + 'px';
    }
}
@Directive({
    selector: '[myDivScrollLeft]'
})
export class DivScrollLeftDirective {
    @Input('myDivScrollLeft') myscrollleft: number;
    constructor(private el: ElementRef) {
        el.nativeElement.style.left = 0;
    };

    ngOnChanges() { // 输入属性有变化时触发ngOnChanges方法
        this.el.nativeElement.style.marginLeft = this.myscrollleft + 'px';
    }
}