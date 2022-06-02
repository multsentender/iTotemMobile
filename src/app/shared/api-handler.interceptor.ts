import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, mergeMap, Observable, tap } from 'rxjs';
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
  //   tap((event) => {
  //     if (event instanceof HttpResponse)
  //     console.log(request.method == 'GET');

  //   },
  //   (err) => {
  //     if (err instanceof HttpErrorResponse) {
  //       switch(err.status) {
  //         case 400: throw Error('Internal error occured')
  //         case 403: {
  //           // Переадрессация на baseRootUrl при неавторизации
  //           // FIXME убрать версию для dev'a
  //           if(environment.production) window.location.href = environment.baseRootUrl
  //           else {
  //             this.authService.isAuth.next(false)
  //             this.router.navigate(['/devLogin'])
  //           }
  //         }
  //         case 500: throw Error(err.message)
  //         case 503: {

  //         }
  //       }
  //     }
  //   })
  );
  }
}


// export function errorStatusHandler(error: HttpErrorResponse) {
//   switch(error.status) {
//     case 400: throw Error('Internal error occured')
//     case 403: {
//       // Переадрессация на baseRootUrl при неавторизации
//       // FIXME убрать версию для dev'a
//       if(environment.production) window.location.href = environment.baseRootUrl
//       else {
//         this.authService.isAuth.next(false)
//         this.router.navigate(['/devLogin'])
//       }
//     }
//     case 404: throw Error('Произошла непредвиденная ошибка!')
//     case 500: throw Error(error.message)
//     default {}
//   }
// }
