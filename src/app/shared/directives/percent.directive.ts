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
    "[(value)]": 'ngModel',
    '(blur)': 'onBlur()',
  }
})
export class PercentDirective implements ControlValueAccessor {

  constructor(private el: ElementRef) {}

  private innerValue: string | undefined;
  private toNumber?: number;
  private toPercent?: number;

  public onChangeCallback!: (value: number) => void;
  public onTouched!: () => void;

  onBlur() {
    let input = this.el.nativeElement.value;
    if(input === '') {
      this.el.nativeElement.value = 0;
      input = 0
    }
    this.toPercent = parseFloat(input) / 100;

    if (input != this.toNumber) {
      this.onChangeCallback(this.toPercent);
    }
  }

  get value(): any {
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
    this.toNumber = +(parseFloat(val) * 100).toFixed(2);

    this.el.nativeElement.value = this.toNumber;
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.el.nativeElement.disabled = isDisabled
  }
}
