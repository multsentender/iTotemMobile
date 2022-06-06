import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { delayRetryPipe } from './extensions';

import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth/auth.service';
import { Log, Logger } from './services/log.service';
import { ErrorMessageService } from './services/error-message.service';

@Injectable()
export class ApiHandlerInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router,
    private logget: Logger = Log.get('HTTP Error Request'),
    private errorMessageService: ErrorMessageService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

  return next.handle(request).pipe(
    tap(() => {},
    err => {
      switch(err.status) {
        case 400: {
          this.logget.error(err)
          this.errorMessageService.addError('Internal error occured')
          throw Error('Internal error occured')
        }
        case 403: {
          if(environment.production) window.location.href = environment.baseRootUrl
          else {
            this.authService.isAuth.next(false)
            this.router.navigate(['/devLogin'])
          }
        }
        case 503: {
          this.logget.error(err)
        }
        default: {
          console.error(err.message)
        }
      }
    }),
    // delayRetryPipe(2000, 3, (error: HttpErrorResponse) =>
    // (![400, 401, 403, 404, 500].includes(error.status)) && request.method.toLowerCase() === 'get')
  )
  }
}
