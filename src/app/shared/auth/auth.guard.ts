import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

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
    const isAuth = this.authService.isAuth.value
    const isAwait = this.authService.isAwait.value

    if(route.url[0]?.path === 'devLogin') {
      if(isAuth) {
        this.router.navigate(['/'])
        return false
      }
      return true
    } else {
      if (isAwait){
        return false
      } else
      if(!isAuth) {
        environment.production 
        ? window.location.href = environment.baseRootUrl
        : this.router.navigate(['/devLogin'])
        return false
      }
      return true
    }
  }
}
