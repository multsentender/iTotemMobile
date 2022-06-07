import { Component, Input, forwardRef } from '@angular/core';
import { FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { environment } from '../../../../environments/environment';


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
  @Input() formControl!: FormControl;
  @Input() placeholder: string = "";
  @Input() errorMessage?: string;
  hidePass: boolean = true;
  hideError: boolean = true;

  env = environment;

  constructor() { }

  registerOnChange() {}

  registerOnTouched() {}

  writeValue() {}
}
