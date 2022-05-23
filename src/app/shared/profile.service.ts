import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, first, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AgentLoginInfo } from './models/agentLoginInfo';
import { UpdateCurrentUserPasswordRequest, UpdateCurrentUserProfileRequest, ValidateAgentPasswordRequest, ValidationStatus } from './models/models';
import { ValidateEMailRequest } from './models/validateEMailRequest';

@Injectable()
export class ProfileService {
  profile: BehaviorSubject<AgentLoginInfo> = new BehaviorSubject<AgentLoginInfo>({})

  constructor(
    private http: HttpClient
  ) { }


  loadAgentProfile(): void {
    this.http.get<AgentLoginInfo>(
      `${environment.apiUrl}getCurrentUserProfile`,
      {withCredentials: true})
      .subscribe({
        next: (data) => this.profile.next(data),
        error: (err: HttpErrorResponse) => new Error(err.message)
      })
  }

  validEmail(email: ValidateEMailRequest, cb: Function): void {
    this.http.post<ValidationStatus>(`${environment.apiUrl}validateEMail`,
    email,
    {withCredentials: true})
    .pipe(first()).subscribe(data => cb(data))
  }

  validPassword(password: ValidateAgentPasswordRequest, cb: Function): void {
    this.http.post<ValidationStatus>(
      `${environment.apiUrl}validateCurrentUserPassword`,
      password,
      {withCredentials: true})
      .pipe(first()).subscribe(data => cb(data))
  }

  updateUserProfile(profile: UpdateCurrentUserProfileRequest): Observable<AgentLoginInfo>{
    return this.http.post(`${environment.apiUrl}updateCurrentUserProfile`,
    profile,
    {withCredentials: true})
  }

  updateUserPassword(passwords: UpdateCurrentUserPasswordRequest): Observable<any> {
    return this.http.post(`${environment.apiUrl}updateCurrentUserPassword`,
    passwords,
    {withCredentials: true})
  }
}
