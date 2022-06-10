import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { Logger, Log } from '@shared/services/log.service';

@Directive({
  selector: '[clicklog]'
})
export class ClickDirective {

  constructor(private el: ElementRef) { }

  @Input() clicklog = {class: '', message: ''};

  @HostListener('click') click() {
    //console.log('click', this.clicklog)
    const _log: Logger = Log.get(this.clicklog.class);
    _log.info(this.clicklog.message);
  }

}