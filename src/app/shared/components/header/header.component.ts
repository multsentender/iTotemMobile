import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { PathService } from '@shared/services/path.service';
import { Location } from '@angular/common';
import { NotificationService } from '@shared/services/notification.service';

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
    private notificationService: NotificationService
  ) { }

  get notificationIcon(): URL {
    const visible = this.notificationService.visibleBell$.value
    return this.pathService.assetsPath(`/icons/notification${visible ? '_dot' : ''}.svg`)
  }

  previousPage() {
    this.onCancel && this.mode === HeaderMode.modal ? this.onCancel() : this.location.back()
  }
}
