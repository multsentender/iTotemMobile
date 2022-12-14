import { Component, Input, forwardRef } from '@angular/core';
import { FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { PathService } from '@shared/services/path.service';


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

export class IconInputComponent implements ControlValueAccessor {
  @Input() type: string = "text";
  @Input('form') formControl!: FormControl;

  @Input() errorMessage?: string;
  @Input() label?: string;
  @Input() placeholder: string = "";
  @Input() icon?: string;
  @Input() alt?: string;

  @Input() percent?: boolean

  hideError = true;
  hidePass: boolean = true;

  env = environment;

  constructor(
    public pathService: PathService,
  ) { }

  registerOnChange(fn: any) {
  }

  registerOnTouched(fn: () => {}): void {
  }

  writeValue(outsideValue: any) {//срабатывает при изменении значения в родительском компоненте
  }

}
