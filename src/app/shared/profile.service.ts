import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AgentLoginInfo } from './models/agentLoginInfo';
import { UpdateCurrentUserPasswordRequest, ValidationStatus } from './models/models';
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

  validEmail(email: ValidateEMailRequest): Observable<ValidationStatus> {
    return this.http.post(`${environment.apiUrl}validateEMail`,
    email,
    {withCredentials: true})
  }

  updateUserProfile(profile: UpdateCurrentUserPasswordRequest): Observable<AgentLoginInfo>{
    return this.http.post(`${environment}updateCurrentUserProfile`,
    profile,
    {withCredentials: true})
  }
}
