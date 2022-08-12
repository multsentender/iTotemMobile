import { Injectable } from '@angular/core';
import { TimestampObservableCache } from "./timestamp-observable-cache.model";

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  [key: string]: TimestampObservableCache/*Observable<unknown>*/ | undefined
  constructor() { }
}
