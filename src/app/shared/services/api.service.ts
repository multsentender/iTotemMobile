import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, throwError, mergeMap, retryWhen, delay, Observable, catchError, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { CacheService } from '@shared/cache/cache.service';
import { cachedRequests } from '@shared/cache/cache-decorator';
import { AgentLoginInfo, BasicTreeNode, GetTreeChildrenRequest, LanguageInfo, UpdateCurrentUserPasswordRequest, UpdateCurrentUserProfileRequest, ValidateAgentPasswordRequest, ValidateEMailRequest, ValidationStatus } from '@shared/models/models';
import { Router } from '@angular/router';
import { reqValidErrorHandlerPipe } from '@shared/extensions';
import { MessageService } from './message.service'

interface httpReq {
	apiUrl: string,
	type: 'get' | 'post' | 'put' | 'patch' | 'delete',
	body?: object,
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(
    private http: HttpClient,
    private router: Router,
		private readonly cache: CacheService,
    private messageService: MessageService,
  ) { }

  truncParams({apiUrl, type, body}: httpReq,) {
		let url = `${environment.baseApiUrl}/${apiUrl}`
		if(type !== 'get' && type !== 'delete') {
			return this.http[type](url, body, {withCredentials: true})
		} else {
			return this.http[type](url, {withCredentials: true})
		}
	}

	sendApiRequest(
    type: 'get' | 'post' | 'put' | 'patch' | 'delete',
    apiUrl: string,
    body?: object,
    allowRequest = false): Observable<any> {


    const maxRetry = 3
		let retries = maxRetry

		return this.truncParams({type, apiUrl, body}).pipe(
			retryWhen(errorObservable => errorObservable.pipe(
				mergeMap(error => {
					switch(error.status) {
						case 0:case 503:
              if((type === 'get' || allowRequest) && --retries > 0)
                return of(error).pipe(delay(2000))
              break
            case 403:
              environment.production ?
                window.location.href = environment.baseRootUrl :
                this.router.navigate(['/devLogin'])
              break
					}
					return throwError(error)
				})
			))
		)
	}



  // Validation
	@cachedRequests(function() {return this.cache})
	validateEmail(email: string): Observable<ValidationStatus> {
		let request: ValidateEMailRequest = {email}
		return this.sendApiRequest('post', 'validateEMail', request)
	}

  @cachedRequests(function() {return this.cache})
  validateAgentPassword(request: ValidateAgentPasswordRequest): Observable<ValidationStatus> {
    return this.sendApiRequest('post', 'validateCurrentUserPassword', request)
  }



  // Profile
  loadAgentProfile(): Observable<AgentLoginInfo> {
    return this.sendApiRequest('get', 'getCurrentUserProfile')
  }

  updateUserProfile(profile: AgentLoginInfo): Observable<AgentLoginInfo>{
    let request: UpdateCurrentUserProfileRequest = {profile}
    return this.sendApiRequest('post', 'updateCurrentUserProfile', request).pipe(tap(()=>this.messageService.showSuccess()))
  }

  updateUserPassword(currentPassword: string, newPassword: string): Observable<any> {
    let request: UpdateCurrentUserPasswordRequest = {
      currentPassword, newPassword
    }
    return this.sendApiRequest('post', 'updateCurrentUserPassword', request)
      .pipe(reqValidErrorHandlerPipe((biba) => console.log(biba)), tap(()=>this.messageService.showSuccess()))
  }



  // Menu
  @cachedRequests(function() {return this.cache})
  getLanguages(): Observable<LanguageInfo[]>{
    return this.sendApiRequest('get', 'getSupportedLanguages')
  }

  // FIXME исправить тип получаемого параметра
  loadTreeNode(requestBody = {}): Observable<BasicTreeNode[]> {
    return this.sendApiRequest('post', 'getTreeChildren', requestBody, true)
  }



  // App
  getTreeChildren(parent?: BasicTreeNode): Observable<AgentLoginInfo> {
    let request: GetTreeChildrenRequest = {parent}
    return this.sendApiRequest('post', 'getTreeChildren', request)
  }
}
