import { AbstractControl, AsyncValidatorFn, FormArray, FormControl, FormGroup, ValidationErrors } from "@angular/forms";
import { AgentRateInfo, RateInfo, ValidationStatus } from "@shared/models/models";
import { ApiService } from "@shared/services/api.service";
import { debounceTime, distinctUntilChanged, first, map, Observable } from "rxjs";
import { AgentRateUtils } from "./AgentRateUtils";

export class FormValidator {
  static atLeastOneValidator(keys: string[]) {
    return (group: FormGroup) => {
      const { controls } = group;
      return keys.some(key => controls[key] && !!controls[key].value)
        ? null
        : { atLeastOne: 'error' };
      };
  }


  static checkConfirmPassword(group: FormGroup) {
      return (group.controls['password'].value === group.controls['passwordConf'].value) ? null :
    { passwordMatchError: 'passwords_not_equal' } as ValidationErrors
  }


  static rateValidator(agentRateInfo: AgentRateInfo, rateInfo: RateInfo) {
    return (control: FormControl) => {
      const message = AgentRateUtils.validateRate(agentRateInfo, rateInfo, control.value)
      return message ? { rate: message} as ValidationErrors : null
    }
  }


  static getFormValidationErrors(form: FormGroup | FormArray): {[key: string]: ValidationErrors}
    {
      const errors: {[key: string]: ValidationErrors} = {}

      Object.entries(form.controls).forEach(([key, val]) => {
        const controlErrors: ValidationErrors | null = val.errors

        if(controlErrors) errors[key] = controlErrors;
      })

      return errors
    }

  static emailAsyncValidator(api: ApiService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return api.validateEMail(control.value)
        .pipe(
          debounceTime(400),
          map((result: ValidationStatus) => {
            return result.isValid ? null : {email: result.message || 'UNHANDLED_ERROR'}
          }),
          first()
        )
    }
  }

  static passwordAsyncValidator(api: ApiService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return api.validateCurrentUserPassword({password: control.value})
        .pipe(
          debounceTime(400),
          distinctUntilChanged(),
          map((result: ValidationStatus) => {
            return result.isValid ? null : {password: result.message || 'UNHANDLED_ERROR'}
          }),
          first()
        )
    }
  }
}
