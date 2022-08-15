import { InjectionToken } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

export const defaultErrors = {
  required: () => 'REQUEIRED_ERROR',
  minlength: ({ requiredLength, actualLength }: ValidationErrors) => 'MINLENGTH_ERROR',
  pattern: () => 'PATTERN_ERROR'
}

export const FORM_ERRORS = new InjectionToken('FORM_ERRORS', {
  providedIn: 'root',
  factory: () => defaultErrors
})
