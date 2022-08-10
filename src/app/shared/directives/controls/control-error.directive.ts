import { ComponentRef, Directive, Host, OnInit, Optional, ViewContainerRef } from '@angular/core';
import { NgControl } from '@angular/forms';
import { ControlErrorComponent } from '@shared/components/control-error/control-error.component';
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
    @Optional() controlContainer: ControlErrorContainerDirective) {

      // Receiving an event 'submit'
      this.submit$ = form ? form.submit$ : EMPTY

      this.container = controlContainer ? controlContainer.vcr : vcr
  }


  ngOnInit(): void {
    const control$ = this.control.valueChanges ? this.control.valueChanges : EMPTY

    merge(
      this.submit$,
      control$
    ).subscribe(() => {
      const controlErrors = this.control.errors;
      if (controlErrors) {
        const firstKey = Object.keys(controlErrors)[0];
        const text = controlErrors[firstKey]
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
