import { CdkDragDrop, CdkDragEnd } from '@angular/cdk/drag-drop/drag-events';
import { AfterViewInit, Component, ElementRef, Input, ViewChild, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject, Observable, pairwise, skip } from 'rxjs';

import { PathService } from '@shared/services/path.service';

export enum ModeSlideBtn { button, switch };

@Component({
  selector: 'app-slide-btn[mode]',
  templateUrl: './slide-btn.component.html',
  styleUrls: ['./slide-btn.component.scss'],
})
export class SlideBtnComponent implements AfterViewInit {
  @Input() mode!: ModeSlideBtn;
  @Input() off_text: string = 'SLIDE_CONFIRM'
  @Input() pending_on_text: string = 'CONFIRMING'
  @Input() on_text?: string;
  @Input() pending_off_text?: string

  @Output() pending_on = new EventEmitter<null>();
  @Output() pending_off = new EventEmitter<null>();
  @Input() initialValue: boolean = false
  @Input() toggle?: Observable<Event>


  public isActive = new BehaviorSubject<boolean>(false);
  public isLoading = new BehaviorSubject<boolean>(false)
  public disabled: boolean = false

  public transformMask = new BehaviorSubject<string>('translateX(0px)')
  public maskText = new BehaviorSubject<string | undefined>(this.pending_off_text)

  @ViewChild('slider') parent!: ElementRef<HTMLElement>;
  @ViewChild('sliderButton') dragElement!: ElementRef<HTMLElement>;
  private parentPosition = {left: 0, right: 0}
  private _dragPosition = {x: 0, y: 0};
  public dragPosition = this._dragPosition

  constructor(
    public pathService: PathService) {
      this.isActive
      .pipe(skip(1), pairwise())
      .subscribe(([prev, next]) => {
        this.togglePositionWithMask(next)

        // Processing change event
        if(next !== prev) {
          this.isLoading.next(true)
          if(next) this.pending_on.emit()
          else {
            if(this.mode === ModeSlideBtn.switch) {
              this.pending_off.emit()
              return
            }

            this.isLoading.next(false)
          }
        }
      })

      this.isLoading.subscribe(val => {
        this.disabled = val
        const active = this.isActive.value
        const currentMaskText =
          val ?
          active ? this.pending_off_text : this.pending_on_text :
          active ? this.on_text : this.pending_on_text

        this.maskText.next(currentMaskText)
      })
  }

  getParentPosition() {
    const {nativeElement} = this.parent

    let left = nativeElement.offsetLeft - nativeElement.scrollLeft;
    let right = left + nativeElement.offsetWidth;

    this.parentPosition = {left, right }
  }

  getDragPosition(event: any) {
    let dragElement = event.source.getRootElement();
    let boundingClientRect = dragElement.getBoundingClientRect();

    return boundingClientRect
  }

  maskOffsetHand(val: number) {
    this.transformMask.next(`translateX(${val}px)`)
  }
  changePosition(val: number) {
    this.dragPosition = {x: val, y: 0}
  }
  togglePositionWithMask(active: boolean) {
    const offset = this.parentPosition.right - this.parentPosition.left - this.dragElement.nativeElement.offsetWidth

    if(active) {
      this.maskOffsetHand(offset)
      this.changePosition(offset)
    } else {
      this.maskOffsetHand(0)
      this.changePosition(0)
    }
  }




  ngAfterViewInit(): void {
    const status = this.initialValue && this.mode === ModeSlideBtn.switch

    this.getParentPosition()
    this.isActive.next(status)
    this.togglePositionWithMask(status)

    this.toggle?.subscribe(() => this.isLoading.next(false))
  }

  onDragStart() {
    this.getParentPosition()
    this.parent.nativeElement.classList.remove('drag-animating')
  }

  onDragMoved(event: CdkDragDrop<string[]>) {
    const {x, y} = this.getDragPosition(event)
    this._dragPosition = {x, y}
    this.maskOffsetHand(x - this.parentPosition.left)
  }

  onDragEnd(event: CdkDragEnd) {
    const containerWidth = this.parent.nativeElement.offsetWidth
    this.parent.nativeElement.classList.add('drag-animating')

    if(Math.abs(event.distance.x) >= containerWidth * 0.35) this.isActive.next(!this.isActive.value)
    else this.isActive.next(this.isActive.value)
  }
}
