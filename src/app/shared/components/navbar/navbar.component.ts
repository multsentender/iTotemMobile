import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PathService } from '@shared/services/path.service';
import { Location } from '@angular/common';
import { ApiService } from '@shared/services/api.service';

export enum HeaderMode {main, modal, default}
@Component({
  selector: 'navbar[mode]',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent implements OnInit {
  @Input() title: string = "";
  @Input() isRoot: boolean = false;
  @Input() mode!: HeaderMode;
  @Input() withConfirm?: boolean;
  @Input() withCancel?: boolean;
  @Input() disabledConfirm?: boolean;
  @Input() notifications: boolean = false;

  @Output('confirm') confirmEvent = new EventEmitter();
  @Output('cancel') cancelEvent = new EventEmitter<null>();

  public HeaderMode = HeaderMode
  componentName = "NavbarComponent";

  constructor(
    public pathService: PathService,
    public location: Location,
    private api: ApiService,
  ) {
  }

  ngOnInit(): void {
    this.api.getSelfNotifications()
      .subscribe(notifications => this.notifications = !!notifications.find(notification => notification.viewCount == 0))
  }

  onConfirm() {
    this.confirmEvent.emit()
  }

  previousPage() {
    this.withCancel ? this.cancelEvent.emit() : this.location.back()
  }
}
