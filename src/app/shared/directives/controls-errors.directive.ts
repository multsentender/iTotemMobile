import { Directive, Host, OnInit, Optional } from '@angular/core';
import { NgControl } from '@angular/forms';
import { EMPTY, merge, Observable } from 'rxjs';
import { FormSubmitDirective } from './form-submit.directive';

@Directive({
  selector: '[formControl], [formControlName]',
})
export class ControlsErrorsDirective implements OnInit{
  submit$: Observable<Event>

  constructor(
    private control: NgControl,
    @Optional() @Host() private form: FormSubmitDirective ) {

      this.submit$ = this.form ? this.form.submit$ : EMPTY
  }

  ngOnInit(): void {
    const controlChange = this.control.valueChanges ? this.control.valueChanges : EMPTY

    merge(
      controlChange,
      this.submit$
    ).subscribe(() => {
      const controlErrors = this.control.errors

      if(controlErrors) {
        const firstKey = Object.keys(controlErrors)[0]
        const text = controlErrors[firstKey]
      }
    })
  }
}
