import { Directive, OnInit, HostListener, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[auto-resize-text-area]'
})
export class AutoResizeTextAreaDirective implements OnInit {

  @HostListener('input', ['$event.target'])
  onInput(textArea: HTMLTextAreaElement): void {
    this.adjust();
  }

  @Input('auto-resize-text-area') maxHeight: number;

  constructor(public element: ElementRef) {
    console.log('Hello AutoResizeTextAreaDirective Directive');
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.adjust();
    }, 500);
  }

  adjust(): void {
    let ta = this.element.nativeElement.querySelector("textarea");
    if (ta) {
      ta.style.overflow = "hidden";
      ta.style.height = null;
      ta.style.height = Math.min(ta.scrollHeight, this.maxHeight) + "px";
    } else {
      this.element.nativeElement.style.overflow = "hidden";
      this.element.nativeElement.height = null;
      this.element.nativeElement.style.height = Math.min(this.element.nativeElement.scrollHeight, this.maxHeight) + "px";
    }
  }

}
