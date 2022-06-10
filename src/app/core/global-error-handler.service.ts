import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { Log, Logger } from '@shared/services/log.service';

@Injectable()
export class GlobalErrorHandlerService implements ErrorHandler {
  private logger: Logger = Log.get(GlobalErrorHandlerService.name)

  constructor(private zone: NgZone) { }

    handleError(error: any): void {
      this.zone.run(() => {
        if(!(error instanceof HttpErrorResponse)) {
          this.logger.error(error)
        }
      })
  }
}
