import { Injectable } from '@angular/core';
import { Directive, ElementRef, Input, OnInit, Renderer, HostListener } from '@angular/core';

@Directive({
  selector: '[appDrag]'
})

export class DragDirective implements OnInit {


  constructor(private el: ElementRef, private rr: Renderer) { }
  private isDown = false;

  private disX;

  private disY;

  ngOnInit() {


  }
  @HostListener('mousedown', ['$event']) onMousedown(event) {

    console.log(event);

    this.isDown = true;

    this.disX = event.clientX - this.el.nativeElement.offsetLeft;

    this.disY = event.clientY - this.el.nativeElement.offsetTop;



  }
  @HostListener('document:mousemove', ['$event']) onMousemove(event) {

    // 判断该元素是否被点击了。
    console.log(event);

    if (this.isDown) {

      console.log("移动中");

      let newdisX = event.clientX;

      let newdisY = event.clientY;

      this.el.nativeElement.style.left = newdisX - this.disX + "px";

      this.el.nativeElement.style.top = newdisY - this.disY + "px";
    }
  }
  @HostListener('document:mouseup', ['$event']) onMouseup() {
    // 只用当元素移动过了，离开函数体才会触发。
    if (this.isDown) {
      console.log("fail");

      this.isDown = false;

    }
  }

}
