import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { delay, mergeMap, Observable, of, retryWhen, throwError } from 'rxjs';

import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { AuthService } from '../shared/auth/auth.service';
import { Log, Logger } from '../shared/services/log.service';
import { ErrorMessageService } from '../shared/services/error-message.service';
import { internalErrorOccurred } from '@shared/utils/msg';

@Injectable()
export class ApiHandlerInterceptor implements HttpInterceptor {
  private logger: Logger = Log.get(ApiHandlerInterceptor.name)

  constructor(
    private router: Router,
    private authService: AuthService,
    private errorMessageService: ErrorMessageService,
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const maxRetry = 3
    let retries = maxRetry

    return next.handle(request).pipe(
      retryWhen(errorOservable => errorOservable.pipe(
        mergeMap(error =>  {
          switch(error.status) {
            case 0: {
              if(--retries > 0 && request.method.toLowerCase() === 'get') {
                return of(error).pipe(delay(2000))
              }
              break
            }
            case 400: {
              this.logger.error(`400 - Bad request\n${error.url}`)
              this.errorMessageService.addError(internalErrorOccurred(error.status))
              break
            }
            case 403: {
              this.logger.error(`403 - not authorized\n${error.url}`)
              this.authService.isAuth.next(false)
              environment.production ?
                window.location.href = environment.baseRootUrl :
                this.router.navigate(['/devLogin'])
              break
            }
            case 500: {
              this.logger.error(`500 - Application Error\n${error.url}\n${error.error?.errorMessage}`)
              this.errorMessageService.addError(error.error?.errorMessage);
              break
            }
            case 503: {
              if(retries === maxRetry) {
                this.logger.error(`503 - Inaccessible Backend\n${error.url}`)
                this.errorMessageService.addError(internalErrorOccurred(error.status))
              }
              if(--retries > 0 && request.method.toLowerCase() === 'get') {
                return of(error).pipe(delay(2000))
              }
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
