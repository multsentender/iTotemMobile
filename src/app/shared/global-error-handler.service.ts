import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { ErrorMessageService } from './error-message.service';

@Injectable()
export class GlobalErrorHandlerService implements ErrorHandler {
  constructor(
    private errorMessageService: ErrorMessageService,
    private zone: NgZone) { }

  handleError(error: Error): void {
    this.zone.run(() => {
      this.errorMessageService.addError(error.message)
    })
  }
}
