import { Directive, ElementRef, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[appPercentDirective]',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => PercentDirective),
    multi: true
  }],
  host: {
    "[value]": 'ngModel',
    '(blur)': 'onBlur()'
  }
})
export class PercentDirective implements ControlValueAccessor {

  constructor(private el: ElementRef) { }

  private innerValue!: string;
  private toNumber!: number;
  private toPercent!: number;

  public onChangeCallback: any = (_: any) => { console.log(_) }
  public onTouched: any = () => { /*Empty*/ }

  onBlur() {
    let input = this.el.nativeElement.value;
    this.toPercent = parseFloat(input) / 100;

    if (input != this.toNumber) {
      this.onChangeCallback(this.toPercent);
    }
  }

  get value(): any {
    console.log(this.innerValue);
    return this.innerValue;
  };

  //set accessor including call the onchange callback
  set value(val: any) {
    if (val !== this.innerValue) {
      this.innerValue = val;
      this.onChangeCallback(val);
    }
  }

  writeValue(val: string): void {
    this.toNumber = parseFloat(val) * 100;
    this.el.nativeElement.value = this.toNumber;
  }

  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
