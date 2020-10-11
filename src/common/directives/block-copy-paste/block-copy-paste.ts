import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[blockCopyPaste]' // Attribute selector
})
export class BlockCopyPasteDirective {

  constructor() {
    console.log('Hello BlockCopyPasteDirective Directive');
  }

  @HostListener('paste', ['$event']) blockPaste(e: KeyboardEvent) {
    e.preventDefault();
  }

  @HostListener('copy', ['$event']) blockCopy(e: KeyboardEvent) {
    e.preventDefault();
  }

  @HostListener('cut', ['$event']) blockCut(e: KeyboardEvent) {
    e.preventDefault();
  }

}
