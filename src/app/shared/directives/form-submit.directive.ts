import { Directive, ElementRef } from '@angular/core';
import { fromEvent, shareReplay } from 'rxjs';

@Directive({
  selector: 'form'
})
export class FormSubmitDirective {
  submit$ = fromEvent(this.element, 'submit').pipe(shareReplay(1))

  constructor(private host: ElementRef<HTMLFormElement>) { }

  get element() {
    return this.host.nativeElement;
  }
}
