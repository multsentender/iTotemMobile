import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorMessageService {
  errors: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([])
  constructor() {
    this.errors.subscribe(() => {
      if(this.withErrors()) {
        setTimeout(() => this.clearErrors(), 5000)
      }
    })
  }

  addError(message: string) {
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
