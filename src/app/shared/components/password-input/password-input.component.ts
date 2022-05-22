import { Component, Input, forwardRef } from '@angular/core';
import { FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';


@Component({
  selector: 'app-password-input',
  templateUrl: './password-input.component.html',
  styleUrls: ['./password-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PasswordInputComponent),
      multi: true
    }
  ],
})
export class PasswordInputComponent implements ControlValueAccessor {
  @Input() placeholder: string = "";
  hidePass: boolean = true;

  @Input() formControl!: FormControl;

  constructor() { }

  registerOnChange() {}

  registerOnTouched() {}

  writeValue() {}

  hidePassword() {
    this.hidePass = !this.hidePass;
  }
}
