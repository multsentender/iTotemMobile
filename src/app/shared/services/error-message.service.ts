import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorMessageService {
  public errors: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([])
  constructor(
    private translate: TranslateService
  ) {}

  generateErrorMessage(statusCode?: number, message?: string) {
    const localizationString = this.translate.instant("INTERNAL_ERROR", {
      statusCode,
      message
    })

    return localizationString
  }

  addError(message: string = "Error") {
    this.errors.next([...this.errors.value, message])
  }

  setErrors(val: Array<string>) {
    this.errors.next(val)
  }

  clearErrors() {
    this.errors.next([])
  }

  withErrors() : boolean {
    return this.errors.value.length > 0 ? true : false
  }
}
