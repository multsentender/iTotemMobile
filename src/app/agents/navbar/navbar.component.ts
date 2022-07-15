import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PathService } from '@shared/services/path.service';
import { Location } from '@angular/common';
import { ApiService } from '@shared/services/api.service';

@Component({
  selector: 'agents-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {

  borderBottom: string = "var(--special-accent)";
  @Input() title: string = "";
  @Input() isRoot: boolean = false;
  @Input() notifications: boolean = false;

  constructor(
    public pathService: PathService,
    public location: Location,
    private api: ApiService,
  ) { }

  ngOnInit(): void {
    this.api.getSelfNotifications()
      .subscribe(notifications => this.notifications = !!notifications.find(notification => notification.viewCount==0))
    window.addEventListener('scroll', this.scroll, true);
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.scroll, true);
  }

  scroll = (event: Event): void => {
    if (document?.getElementById("agent_header") && document.body.scrollTop > 1 || document.documentElement.scrollTop > 1) {
      this.borderBottom = "var(--white)";
    } else {
      this.borderBottom = "var(--special-accent)";
    }
  };

  previousPage() {
    this.location.back();
  }

}
