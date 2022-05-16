import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { ControlContainer, FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';


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
export class PasswordInputComponent implements ControlValueAccessor, OnInit {
  @Input() placeholder: string = "";
  hidePass: boolean = true;

  @Input() formControlName: string = '';
  control: FormControl = new FormControl();

  constructor(
    private controlContainer: ControlContainer,
  ) { }

  ngOnInit(): void {
    if (this.controlContainer?.control && this.formControlName) {
      this.control = this.controlContainer.control!.get(this.formControlName)! as FormControl;
    }
  }

  registerOnChange() {}

  registerOnTouched() {}

  writeValue() {}

  setDisabledState() {}

  hidePassword() {
    this.hidePass = !this.hidePass;
  }

}
