import { Injectable } from '@angular/core';
import { BehaviorSubject, exhaustMap, interval, skip, timer } from 'rxjs';
import { ApiService } from './api.service';
import { Notification } from '@shared/models/models'

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  public visibleBell$ = new BehaviorSubject<boolean>(false)
  public notifications$ = new BehaviorSubject<Notification[]>([])

  constructor(private api: ApiService) {
    this.notifications$
      .pipe(skip(1))
      .subscribe(nts => {
        this.visibleBell$.next(
          nts.some((el) => el.viewCount == 0)
        )
    })

    timer(0, 1000 * 20 * 60)
      .pipe(exhaustMap(() => this.api.getSelfNotifications()))
      .subscribe(nts => {
        this.dataHandle(nts)
      })
  }

  dataHandle(data: Notification[]) {
    this.notifications$.next(data)
  }

  getNotification() {
    this.api.getSelfNotifications()
      .subscribe(nts => this.dataHandle(nts))
  }
}
