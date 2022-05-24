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
      `${environment.rootUrl}j_spring_security_check?${Object.entries(user).map(([key, val]) => `${key}=${val}`).join('&')}`,
      {}, {withCredentials: true}
    )
  }

  logout() {
    return this.http.post(`${environment.rootUrl}logout`, {}, {withCredentials: true})
  }

  saveUserToLocalStorage(userAuth: boolean) {
    this.isAuth.next(userAuth)
    localStorage.setItem('isAuth', JSON.stringify(userAuth))
  }

  loadUserFromLocalStorage(): Boolean {
    if(!this.isAuth.value) {
      const localStorageData = localStorage.getItem('isAuth')

      if(localStorageData) {
        this.isAuth.next(JSON.parse(localStorageData))
      }
    }

    return this.isAuth.value
  }

  getTreeChildren(): Observable<AgentLoginInfo> {
    return this.http.post(`${environment.apiUrl}getTreeChildren`, {}, {withCredentials: true})
  }
}
