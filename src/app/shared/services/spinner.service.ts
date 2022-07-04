import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private _isShow = new BehaviorSubject<boolean>(false)
  public readonly isShow$ = this._isShow.asObservable()

  constructor() {}

  open() {
    this._isShow.next(true)
  }

  close() {
    this._isShow.next(false)
  }

  spinnerHandlerPipe<T>() {
    return (src: Observable<T>) : Observable<T> => {
      this.open()

      return src.pipe(finalize(() => this.close()))
    }
  }
}
