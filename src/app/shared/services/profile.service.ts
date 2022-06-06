import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { cachedRequests } from '@shared/cache/cache-decorator';
import { CacheService } from '@shared/cache/cache.service';
import { delayRetry } from '@shared/extensions';
import { BehaviorSubject, first, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AgentLoginInfo } from '../models/agentLoginInfo';
import { UpdateCurrentUserPasswordRequest, UpdateCurrentUserProfileRequest, ValidateAgentPasswordRequest, ValidationStatus } from '../models/models';
import { ValidateEMailRequest } from '../models/validateEMailRequest';

@Injectable()
export class ProfileService {
  profile: BehaviorSubject<AgentLoginInfo> = new BehaviorSubject<AgentLoginInfo>({})

  constructor(
    private http: HttpClient,
    private readonly cache: CacheService
  ) { }

  @cachedRequests(function() {return this.cache})
  @delayRetry()
  loadAgentProfile(): Observable<AgentLoginInfo> {
    return this.http.get(
      `${environment.baseApiUrl}/getCurrentUserProfile`,
      {withCredentials: true})
    }

  @cachedRequests(function() {return this.cache})
  validEmail(email: ValidateEMailRequest): Observable<ValidationStatus> {
    return this.http.post(`${environment.baseApiUrl}/validateEMail`,
    email,
    {withCredentials: true})
  }

  @cachedRequests(function() {return this.cache})
  validPassword(password: ValidateAgentPasswordRequest): Observable<ValidationStatus> {
    return this.http.post(
      `${environment.baseApiUrl}/validateCurrentUserPassword`,
      password,
      {withCredentials: true})
  }

  updateUserProfile(profile: UpdateCurrentUserProfileRequest): Observable<AgentLoginInfo>{
    return this.http.post(`${environment.baseApiUrl}/updateCurrentUserProfile`,
    profile,
    {withCredentials: true})
  }

  updateUserPassword(passwords: UpdateCurrentUserPasswordRequest): Observable<any> {
    return this.http.post(`${environment.baseApiUrl}/updateCurrentUserPassword`,
    passwords,
    {withCredentials: true})
  }
}
