import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { PathService } from '@shared/services/path.service';
import { Location } from '@angular/common';
import { NotificationService } from '@shared/services/notification.service';
import { RoutingService } from '@shared/services/routing.service';
import { Router } from '@angular/router';

export enum HeaderMode {main, modal, default}
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  @Input('title') TITLE: string = "";
  @Input() subTitle?: string;

  @Input() mode: HeaderMode = HeaderMode.default;
  @Input() isRoot: boolean = false;

  @Input('confirm') onConfirm?: () => void;
  @Input('cancel') onCancel?:() => void;

  @Input() disabledConfirm?: boolean;

  public HeaderMode = HeaderMode
  componentName = "NavbarComponent";

  constructor(
    public pathService: PathService,
    private location: Location,
    private router: Router,
    private notificationService: NotificationService,
    private routingService: RoutingService
  ) { }

  get notificationIcon(): URL {
    const visible = this.notificationService.visibleBell$.value
    return this.pathService.assetsPath(`/icons/notification${visible ? '_dot' : ''}.svg`)
  }

  previousPage() {
    if(this.onCancel && this.mode === HeaderMode.modal) {
      this.onCancel()
      return
    }

    this.prevPage ? this.location.back() : this.router.navigateByUrl('/')
  }

  get currentPage() {
    return this.routingService.currentRoute
  }
  get prevPage() {
    return this.routingService.previosRoute
  }

  get backLog() {
    return `Back to ${this.prevPage ? this.prevPage : '/'} from ${this.currentPage}`
  }
}
