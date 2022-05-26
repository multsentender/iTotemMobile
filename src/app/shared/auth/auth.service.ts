import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AgentLoginInfo } from '@shared/models/agentLoginInfo';
import { UserAuth } from '@shared/models/userAuth.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuth: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(false)

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

  getTreeChildren(): Observable<AgentLoginInfo> {
    return this.http.post(`${environment.baseApiUrl}/getTreeChildren`, {}, {withCredentials: true})
  }
}
