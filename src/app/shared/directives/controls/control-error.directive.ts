import { ComponentRef, Directive, Host, Inject, OnInit, Optional, ViewContainerRef } from '@angular/core';
import { NgControl } from '@angular/forms';
import { ControlErrorComponent } from '@shared/components/control-error/control-error.component';
import { FORM_ERRORS } from '@shared/services/form-errors.service';
import { EMPTY, merge, Observable } from 'rxjs';
import { ControlErrorContainerDirective } from './control-error-container.directive';
import { FormSubmitDirective } from './form-submit.directive';

@Directive({
  selector: '[formControl], [formControlName]'
})
export class ControlErrorDirective implements OnInit {
  ref!: ComponentRef<ControlErrorComponent>
  container: ViewContainerRef;
  submit$: Observable<Event>

  constructor(
    private vcr: ViewContainerRef,
    private control: NgControl,
    @Optional() @Host() private form: FormSubmitDirective,
    @Optional() controlContainer: ControlErrorContainerDirective,
    @Inject(FORM_ERRORS) private errors: any) {

      // Receiving an event 'submit'
      this.submit$ = form ? form.submit$ : EMPTY

      this.container = controlContainer ? controlContainer.vcr : vcr
  }


  ngOnInit(): void {
    const control$ = this.control.statusChanges ? this.control.statusChanges : EMPTY

    merge(
      this.submit$,
      control$
    ).subscribe(() => {
      const controlErrors = this.control.errors;
      if (controlErrors) {
        const firstKey = Object.keys(controlErrors)[0];
        const getError = this.errors[firstKey]
        const text = getError ? getError(controlErrors[firstKey]) : controlErrors[firstKey]
        this.setError(text)
      } else if(this.ref) {
        this.setError(null)
      }
    })
  }


  // Set ControlErrorComponent
  setError(text: string | null) {
    if(!this.ref) {
      this.ref = this.container.createComponent(ControlErrorComponent)
    }

    this.ref.instance.text(text)
  }
}
