import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import { mergeMap, Observable, retryWhen, throwError } from 'rxjs';

import { AuthService } from '../shared/auth/auth.service';
import { Log, Logger } from '../shared/services/log.service';
import { ErrorMessageService } from '../shared/services/error-message.service';
import { internalErrorOccurred } from '@shared/utils/msg';

@Injectable()
export class ApiHandlerInterceptor implements HttpInterceptor {
  private logger: Logger = Log.get(ApiHandlerInterceptor.name)

  constructor(
    private authService: AuthService,
    private errorMessageService: ErrorMessageService,
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      retryWhen(errorOservable => errorOservable.pipe(
        mergeMap(error =>  {
          switch(error.status) {
            case 400: {
              this.logger.error(`400 - Bad request\n${error.url}`)
              this.errorMessageService.addError(internalErrorOccurred(error.status))
              break
            }
            case 403: {
              this.logger.error(`403 - not authorized\n${error.url}`)
              this.authService.isAuth.next(false)
              break
            }
            case 500: {
              this.logger.error(`500 - Application Error\n${error.url}\n${error.error?.errorMessage}`)
              this.errorMessageService.addError(error.error?.errorMessage);
              break
            }
            case 503: {
              this.logger.error(`503 - Inaccessible Backend\n${error.url}`)
              this.errorMessageService.addError(internalErrorOccurred(error.status))
              break
            }
            default: {
              this.logger.error(`${error.status} - Unhandled HTTP Error\n${error.message}`)
            }
          }
          return throwError(error)
        })
      ))
    )
  }
}
