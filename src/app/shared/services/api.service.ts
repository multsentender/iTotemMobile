import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, throwError, mergeMap, retryWhen, delay, Observable, catchError } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

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
    allowRequest = false) {


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
}
