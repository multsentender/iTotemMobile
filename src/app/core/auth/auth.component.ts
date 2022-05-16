import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

interface user {
  j_username: string;
  j_password: string;
}

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  users: Array<user> = [
    {
      j_username: 'mobileadmindev4',
      j_password: 'qaz123'
    }
  ]

  selectedUser = this.users[0]

  constructor(
    private http : HttpClient,
    private router: Router) { }

  async onAuth() {
    await this.http.post<any>(
      environment.rootUrl.concat(`j_spring_security_check?${Object.entries(this.selectedUser).map(([key, val]) => `${key}=${val}`).join('&')}`), {}
    ).subscribe()
  }
}
