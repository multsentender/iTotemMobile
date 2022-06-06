import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@shared/auth/auth.service';
import { UserAuth } from '@shared/models/userAuth.model';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  users: Array<UserAuth> = [
    {
      j_username: 'mobileadmindev1',
      j_password: 'qaz123'
    },
    {
      j_username: 'mobileadmindev2',
      j_password: 'qaz123'
    },
    {
      j_username: 'mobileadmindev3',
      j_password: 'qaz123'
    },
    {
      j_username: 'mobileadmindev4',
      j_password: 'qaz123'
    }
  ]

  selectedUser = this.users[0]

  constructor(
    private auth: AuthService,
    private router: Router) { }

  onAuth() {
    const getProfile = () => {
      this.auth.isAuth.next(true)
      this.router.navigate(['/'])
    }

    this.auth.login(this.selectedUser).subscribe({
      next: () => {
        getProfile()
      },
      error: (err: HttpErrorResponse) => {
        const url = err.url?.includes('/otp/')
        url ? getProfile() : console.error(err)
      },
    })
  }
}
