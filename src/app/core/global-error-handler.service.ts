import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { ErrorMessageService } from '@shared/services/error-message.service';
import { Log, Logger } from '@shared/services/log.service';

@Injectable()
export class GlobalErrorHandlerService implements ErrorHandler {
  constructor(
    private zone: NgZone,
    private errorMessage: ErrorMessageService
  ) { }

  handleError(error: any): void {
    this.zone.run(() => {

      if(error instanceof HttpErrorResponse) {
        if(error.error?.errorMessage) this.errorMessage.addError(error.error.errorMessage)
      }
    })
  }
}
