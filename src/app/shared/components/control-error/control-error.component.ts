import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';

@Component({
  selector: 'app-control-error',
  template: `<span class="input__error" [class.hide]="hide">{{_text | translate}}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlErrorComponent {
  _text: string = '';
  _hide: boolean = true

  @Input() set text(value: string | null) {
    if(value !== this._text) {
      this.text = value ? value : ''
      this.changeDetector.detectChanges()
    }
  }
  @Input() set hide(value: boolean) {
    if(value !== this._hide) {
      this._hide = value
      this.changeDetector.detectChanges()
    }
  }

  constructor(private changeDetector: ChangeDetectorRef) { }
}
