import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import { Observable, throwError, catchError } from 'rxjs';

import { Log, Logger } from '../shared/services/log.service';
import { ErrorMessageService } from '../shared/services/error-message.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class ApiHandlerInterceptor implements HttpInterceptor {
  private className: string = 'ApiHandlerInterceptor'
  private logger: Logger = Log.get(this.className)

  constructor(
    private errorMessageService: ErrorMessageService,
    private translate: TranslateService,
  ) {}


  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError(error =>  {
        switch(error.status) {
          case 0: {
            this.logger.error(`0 - Disconect`)
            break
          }
          case 400: {
            this.logger.error(`400 - Bad request\n${error.url}`)
            this.errorMessageService.addError(
              this.errorMessageService.generateErrorMessage(error.status))
            break
          }
          case 403: {
            this.logger.error(`403 - not authorized\n${error.url}`)
            break
          }
          case 500: {
            this.logger.error(`500 - Application Error\n${error.url}\n${error.error?.errorMessage}`)
            this.errorMessageService.addError(
              this.errorMessageService.generateErrorMessage(error.status, error.error?.errorMessage)
            )
            break
          }
          case 503: {
            this.logger.error(`503 - Inaccessible Backend\n${error.url}`)
            break
          }
          default: {
            this.logger.error(`${error.status} - Unhandled HTTP Error\n${error.message}`)
            this.errorMessageService.addError(
              this.errorMessageService.generateErrorMessage(error.status))
          }
        }
        return throwError(error)
      })
    )
  }
}
