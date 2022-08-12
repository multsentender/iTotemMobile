import { Component, OnInit } from '@angular/core';
import { Notification } from '@shared/models/notification';
import { ApiService } from '@shared/services/api.service';
import { HeaderMode } from '@shared/components/navbar/navbar.component';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  public HeaderMode = HeaderMode

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
