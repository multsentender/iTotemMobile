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
  componentName: string = 'AuthComponent';//as name is removed in prod build
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
    private router: Router) { console.log(100)}

  onAuth() {console.log(10)
    const getProfile = () => {console.log(11)
      this.auth.isAuth.next(true)
      this.router.navigate(['/'])
    }

    this.auth.login(this.selectedUser).subscribe({
      next: () => {console.log(12)
        getProfile()
      },
      error: (err: HttpErrorResponse) => {console.log(13)
        const url = err.url?.includes('/otp/')
        url ? getProfile() : console.error(err)
      },
    })
  }
}
