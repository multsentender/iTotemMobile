import { Directive, ElementRef } from '@angular/core';
import { fromEvent, shareReplay, tap } from 'rxjs';

@Directive({
  selector: '[appForm]'
})
export class FormSubmitDirective {
  submit$ = fromEvent(this.element, 'submit').pipe(shareReplay(1))

  constructor(private host: ElementRef<HTMLFormElement>) {
    this.submit$.pipe(tap(() => {
      this.element.classList.add('submitted')
    }))
  }

  get element() {
    return this.host.nativeElement;
  }
}
