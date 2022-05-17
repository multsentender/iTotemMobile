import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
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
      let isAuth = this.authService.isAuth.value

      if(route.url[0].path === 'login') {
        console.log(isAuth);
        if(isAuth) {
          this.router.navigate(['/'])
          return false
        }
        return true
      } else {
        if(isAuth) {
          return true
        }
        this.router.navigate(['/login'])
        return false
      }
  }
}
