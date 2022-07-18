import { Component, OnInit } from '@angular/core';
import { Notification } from '@shared/models/notification';
import { ApiService } from '@shared/services/api.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];

  constructor(
    private api: ApiService,
  ) {
    this.api.clearSelfNotifications()
      .subscribe(notifications => {
        this.notifications = notifications;
      })
  }

  ngOnInit(): void {
    
  }

}
