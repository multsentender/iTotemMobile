import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private _isShow = new BehaviorSubject<boolean>(false)
  public readonly isShow$ = this._isShow.asObservable()

  constructor() { }

  open() {
    this._isShow.next(true)
  }

  close() {
    this._isShow.next(false)
  }
}
