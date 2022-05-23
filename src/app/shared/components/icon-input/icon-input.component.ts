import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';


@Component({
  selector: 'app-icon-input',
  templateUrl: './icon-input.component.html',
  styleUrls: ['./icon-input.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    multi: true,
    useExisting: forwardRef(() => IconInputComponent),
  }]
})

export class IconInputComponent implements ControlValueAccessor, OnInit {
  @Input() type: string = "text";
  @Input() formControl!: FormControl;

  @Input() errorMessage?: string;
  @Input() placeholder: string = "";
  @Input() icon?: string;
  @Input() alt?: string;

  constructor() { }

  ngOnInit(): void {}

  registerOnChange(fn: any) {
  }

  registerOnTouched(fn: () => {}): void {
  }

  writeValue(outsideValue: any) {//срабатывает при изменении значения в родительском компоненте
  }

}
