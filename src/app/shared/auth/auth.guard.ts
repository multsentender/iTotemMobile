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
console.log(1)
    if(route.url[0]?.path === 'devLogin') {console.log(2)
      if(isAuth) {console.log(3)
        this.router.navigate(['/'])
        return false
      }
      return true
    } else {console.log(4)
      if (isAwait){console.log(6)
        return false
      } else
      if(!isAuth) {console.log(5)
        environment.production 
        ? window.location.href = environment.baseRootUrl
        : this.router.navigate(['/devLogin'])
        return false
      }
      return true
    }
  }
}
