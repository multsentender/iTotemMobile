import { Directive, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[disableControl]'
})
export class ControlDisableDirective implements OnChanges {
  @Input() set disableControl( condition : boolean ) {
    this._condition = condition
  }
  private _condition: boolean = false

  constructor(private control: NgControl) { }

  ngOnChanges(changes: SimpleChanges): void {
    const control = this.control.control
    const action = this._condition ? 'disable' : 'enable';
    control?.[action]();
  }
}
