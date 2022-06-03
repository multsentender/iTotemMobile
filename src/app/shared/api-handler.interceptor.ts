import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, delay, filter, mergeMap, Observable, of, take, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth/auth.service';
import { delayRetryPipe } from './extensions';

@Injectable()
export class ApiHandlerInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {


  return next.handle(request).pipe(
    tap(() => {},
    err => {
      switch(err.status) {
        case 400: throw Error('Internal error occured')
        case 403: {
          if(environment.production) window.location.href = environment.baseRootUrl
          else {
            this.authService.isAuth.next(false)
            this.router.navigate(['/devLogin'])
          }
        }
        case 500: throw Error(err.message)
        case 503: throw Error(err.message)
        default: {
          console.error(err)
          break;
        }
      }
    }),
    delayRetryPipe(2000, 3, (error: HttpErrorResponse) =>
    (![400, 401, 403, 404, 500].includes(error.status)) && request.method.toLowerCase() === 'get')
  )
  }
}
