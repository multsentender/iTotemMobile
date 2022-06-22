import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SuccessMessageService {
  public show: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  constructor() {}

  showMessage() {
    this.show.next(true)
  }

  closeMessage() {
    this.show.next(false)
  }
}
