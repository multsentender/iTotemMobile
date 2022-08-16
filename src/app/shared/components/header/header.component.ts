import { ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import { PathService } from '@shared/services/path.service';
import { Location } from '@angular/common';
import { NotificationService } from '@shared/services/notification.service';
import { RoutingService } from '@shared/services/routing.service';
import { Router } from '@angular/router';
import { bindContext } from '@shared/decorators/bind-context-decorator';
import { BehaviorSubject } from 'rxjs';

export enum HeaderMode {main, modal, default}
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnDestroy {
  @Input('title') TITLE: string = "";
  @Input() subTitle?: string;

  @Input() mode: HeaderMode = HeaderMode.default;
  @Input() isRoot: boolean = false;

  @Input('confirm') onConfirm?: () => void;
  @Input('cancel') onCancel?:() => void;

  @Input() disabledConfirm?: boolean;

  public HeaderMode = HeaderMode
  public componentName = "NavbarComponent";
  public scrollClass = new BehaviorSubject<boolean>(false)

  constructor(
    public pathService: PathService,
    private location: Location,
    private router: Router,
    private notificationService: NotificationService,
    private routingService: RoutingService,
  ) {
    this.setScrollClass()
    window.addEventListener('scroll', this.setScrollClass)
  }

  get notificationIcon(): URL {
    const visible = this.notificationService.visibleBell$.value
    return this.pathService.assetsPath(`/icons/notification${visible ? '_dot' : ''}.svg`)
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

  @bindContext
  setScrollClass() {
    const newVal = document.documentElement.scrollTop > 10
    if(newVal !== this.scrollClass.value)
      this.scrollClass.next(newVal)
  }

  previousPage() {
    if(this.onCancel && this.mode === HeaderMode.modal) {
      this.onCancel()
      return
    }

    this.prevPage ? this.location.back() : this.router.navigateByUrl('/')
  }


  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.setScrollClass)
  }
}
