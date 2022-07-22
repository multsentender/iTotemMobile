import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError, mergeMap, retryWhen, delay, delayWhen, tap, fromEvent, race } from 'rxjs';

import { CacheService } from '@shared/cache/cache.service';
import { cachedRequests } from '@shared/cache/cache-decorator';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { reqValidErrorHandlerPipe } from '@shared/extensions';
import { ModalService } from './modal.service';

import { apiRetryDelayMs, apiRetryMaxAttempts } from '@shared/constants';

import {
  AgentInfo,
  AgentLoginInfo,
  BasicTreeNode,
  GetAgentInfoRequest,
  GetTreeChildrenRequest,
  LanguageInfo,
  UpdateCurrentUserPasswordRequest,
  UpdateCurrentUserProfileRequest,
  ValidateAgentPasswordRequest,
  ValidateEMailRequest,
  ValidationStatus,
  Notification, 
  Money,
  GetAgentServiceBalanceRequest,
  AgentTreeNode} from '@shared/models/models';
import { ErrorMessageService } from './error-message.service';


enum httpTypes {
  get = 'get',
  post = 'post',
  put = 'put',
  patch = 'patch',
  delete = 'delete',
}
interface httpReq {
	apiUrl: string,
	type: httpTypes,
	body?: object,
}


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private onOnline$ = fromEvent(window, 'online')

  constructor(
    private http: HttpClient,
		private readonly cache: CacheService,
    private modalService: ModalService,
    private errorMessageService: ErrorMessageService,
  ) {}

  /**
 * Function method selections httpClient
 * @param [apiUrl] api path request
 * @param [type] type http request
 * @param [body] body for post/put/patch requests
 * @return request responce Observer
 */
  truncParams({apiUrl, type, body}: httpReq): Observable<any> {
    let url = `${environment.baseApiUrl}/${apiUrl}`
		if(type !== 'get' && type !== 'delete') {
      return this.http[type](url, body, {withCredentials: true})
		} else {
      return this.http[type](url, {withCredentials: true})
		}
	}



  // Function modal window event handler
  modalHandler(error: HttpErrorResponse): Observable<any> {
    this.modalService.initingModal({
      submitText: 'RETRY',
      title: "CON_FAILURE_TITLE",
      message: "CON_FAILURE_MESSAGE",
      cancelFunc: () => window.location.href = environment.baseRootUrl
    })

    const toObservable$ = this.modalService.event as Observable<any>

    return race(
      this.onOnline$,
      toObservable$.pipe(mergeMap(val => val ? of(error) : throwError(error))))
        .pipe(
          tap(() => this.modalService.closeModal())
        )
  }




	sendApiRequest(
    type: httpTypes,
    apiUrl: string,
    allowRequest: boolean,
    body?: object): Observable<any> {

    const req = this.truncParams({type, apiUrl, body})
		let retries = apiRetryMaxAttempts

    return req.pipe(
			retryWhen(errorObservable => errorObservable.pipe(
				mergeMap(error => {
					switch(error.status) {
						case 0:case 503:
              if(allowRequest) {
                if(--retries > 0) return of(error).pipe(delay(apiRetryDelayMs))
                return of(error).pipe(delayWhen(() => this.modalHandler(error)))
              } else {
                this.errorMessageService.addError(
                  this.errorMessageService.generateErrorMessage(error.status))
              }
              break
            case 403:
              window.location.href = environment.baseRootUrl
              break
					}
					return throwError(error)
				})
			)),
		)
	}




  // Api Requests

  // Validation
	@cachedRequests(function() {return this.cache})
	validateEMail(email: string): Observable<ValidationStatus> {
		let request: ValidateEMailRequest = {email}
		return this.sendApiRequest(httpTypes.post, 'validateEMail', true, request)
	}

  @cachedRequests(function() {return this.cache})
  validateCurrentUserPassword(request: ValidateAgentPasswordRequest): Observable<ValidationStatus> {
    return this.sendApiRequest(httpTypes.post, 'validateCurrentUserPassword', true, request)
  }



  // Profile
  getCurrentUserProfile(): Observable<AgentLoginInfo> {
    return this.sendApiRequest(httpTypes.get, 'getCurrentUserProfile', true)
  }

  updateCurrentUserProfile(profile: AgentLoginInfo): Observable<AgentLoginInfo>{
    let request: UpdateCurrentUserProfileRequest = {profile}
    return this.sendApiRequest(httpTypes.post, 'updateCurrentUserProfile', false, request)
  }

  updateCurrentUserPassword(currentPassword: string, newPassword: string): Observable<any> {
    let request: UpdateCurrentUserPasswordRequest = {
      currentPassword, newPassword
    }
    return this.sendApiRequest(httpTypes.post, 'updateCurrentUserPassword', false, request)
  }




  // Agent
  getAgentInfo(agentId: number): Observable<AgentInfo>{
    let request: GetAgentInfoRequest = { agentId }
    return this.sendApiRequest(httpTypes.post, 'getAgentInfo', true, request)
  }

  getAgentServiceBalance(agent: AgentTreeNode): Observable<Money>{
    let request: GetAgentServiceBalanceRequest = { agent }
    return this.sendApiRequest(httpTypes.post, 'getAgentServiceBalance', true, request)
  }


  // Notifications
	@cachedRequests(function() {return this.cache}, true, 20 * 60 * 1000)
  clearSelfNotifications(): Observable<Notification[]>{
    return this.sendApiRequest(httpTypes.get, 'getSelfNotifications', true)
  }
  
	@cachedRequests(function() {return this.cache}, false, 20 * 60 * 1000)
  getSelfNotifications(): Observable<Notification[]>{
    return this.sendApiRequest(httpTypes.get, 'getSelfNotifications', true)
  }


  // Menu
  getSupportedLanguages(): Observable<LanguageInfo[]>{
    return this.sendApiRequest(httpTypes.get, 'getSupportedLanguages', true)
  }


  // App
  getTreeChildren(parent?: BasicTreeNode): Observable<BasicTreeNode[]> {
    let request: GetTreeChildrenRequest = {parent}
    return this.sendApiRequest(httpTypes.post, 'getTreeChildren', true, request)
  }
}
