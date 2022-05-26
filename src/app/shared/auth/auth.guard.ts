import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { catchError, first, map, Observable, of } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.authService.getTreeChildren()
        .pipe(map(() => {
          if(route.url[0]?.path === 'login') {
            this.router.navigate(['/'])
            return false
          }
          return true
        }),
        catchError(err => {
          if(route.url[0]?.path === 'login') {
            return of(true);
          }
          this.router.navigate(['/login']);
          return of(false);
        }))
  }
}
