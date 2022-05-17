import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@shared/auth/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {

  constructor(
    private router: Router,
    private authService: AuthService) { }

  logOut(): void {
    const throwDownToDefault = () => {
      this.authService.isAuth.next(false)
      sessionStorage.removeItem('isAuth')
      this.router.navigate(['/login'])
    }

    // FIXME Вынести логику редиректа запроса в interceptor
    this.authService.logout().subscribe({
      next: () => throwDownToDefault(),
      error: (err: HttpErrorResponse) => {
        const url = err.url?.includes('/login/')
        url ? throwDownToDefault() : console.error(err)
      }
    })
  }
}
