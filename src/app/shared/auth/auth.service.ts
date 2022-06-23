import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { UserAuth } from '@shared/models/userAuth.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuth: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(false)
  isAwait: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(true)

  constructor(
    private http: HttpClient,
  ) {}

  login(user: UserAuth) {
    return this.http.post(
      `${environment.baseRootUrl}/j_spring_security_check?${Object.entries(user).map(([key, val]) => `${key}=${val}`).join('&')}`,
      {}, {withCredentials: true}
    )
  }

  logout() {
    return this.http.post(`${environment.baseRootUrl}/logout`, {}, {withCredentials: true})
  }
}
