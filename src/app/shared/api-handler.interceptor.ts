import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { delayRetryPipe } from './extensions';

import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { AuthService } from './auth/auth.service';
import { Log, Logger } from './services/log.service';
import { ErrorMessageService } from './services/error-message.service';

@Injectable()
export class ApiHandlerInterceptor implements HttpInterceptor {
  private logger: Logger = Log.get(ApiHandlerInterceptor.name)

  constructor(
    private router: Router,
    private authService: AuthService,
    private errorMessageService: ErrorMessageService,
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

  return next.handle(request).pipe(
    delayRetryPipe(2000, 3, (err) => {
      switch(err.status) {
        case 400: {
          this.logger.error(err)
          this.errorMessageService.addError('Internal error occured')
          throw Error('Internal error occured')
        }
        case 403: {
          this.authService.isAuth.next(false)
          if(environment.production) window.location.href = environment.baseRootUrl
          else {
            this.router.navigate(['/devLogin'])
          }
        }
        case 503: {
          this.logger.error(err)
        }
        default: {
          console.error(err.message)
        }
      }
    })
  )
  }
}
