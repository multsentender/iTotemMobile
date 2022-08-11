import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';

@Component({
  selector: 'app-control-error',
  template: `<span *ngIf="_text" class="input__error" (click)="hide(!_hide)" [class.error_visible]="!_hide">{{_text | translate}}</span>`,
  styleUrls: ['./control-error.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlErrorComponent {
  _text: string = '';
  _hide: boolean = true;

  @Input() text(value: string | null) {
    if(value !== this._text) {
      this._text = value ? value : ''
      this.changeDetector.detectChanges()
    }
  }

  @Input() hide(value: boolean) {
    if(value !== this._hide) {
      this._hide = value
      this.changeDetector.detectChanges()
    }
  }

  constructor(private changeDetector: ChangeDetectorRef) { }
}
