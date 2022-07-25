import { CdkDragDrop, CdkDragEnd } from '@angular/cdk/drag-drop/drag-events';
import { AfterViewInit, Component, ElementRef, Input, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { BehaviorSubject, Observable, pairwise, skip, tap } from 'rxjs';

import { PathService } from '@shared/services/path.service';

export enum ModeSlideBtn { button, switch };

@Component({
  selector: 'app-slide-btn',
  templateUrl: './slide-btn.component.html',
  styleUrls: ['./slide-btn.component.scss']
})
export class SlideBtnComponent implements AfterViewInit, OnChanges {
  @Input() mode: ModeSlideBtn = ModeSlideBtn.button;
  @Input() off_text: string = 'SLIDE_CONFIRM'
  @Input() pending_on_text: string = 'CONFIRMING'
  @Input() on_text?: string;
  @Input() pending_off_text?: string

  @Input() pending_on!: () => Observable<unknown>;
  @Input() pending_off?: () => Observable<unknown>;
  @Input() toggle: boolean = false


  public isActive = new BehaviorSubject<boolean>(false);
  public isLoading = new BehaviorSubject<boolean>(false)
  public disabled: boolean = false

  public transformMask = new BehaviorSubject<string>('translateX(0px)')
  // public maskText = new BehaviorSubject<string | undefined>(this.pending_off_text)
    // this.isLoading.value ? !this.isActive.value ? this.pending_on_text : this.pending_off_text : this.pending_on

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
          if(next){
            this.pending_on()
              .pipe(tap({
                error: () => this.isActive.next(false)
              }))
              .subscribe(() => {
                this.isLoading.next(false)
                this.mode === ModeSlideBtn.button && this.isActive.next(false)
              })
          } else {
            if(this.mode === ModeSlideBtn.switch && this.pending_off) {
              this.pending_off().pipe(tap({
                error: () => this.isActive.next(true)
              }))
              .subscribe(() => {
                this.isLoading.next(false)
              })
            } else this.isLoading.next(false)
          }
        }
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
    const status = this.toggle && this.mode === ModeSlideBtn.switch

    this.getParentPosition()
    this.isActive.next(status)
    this.togglePositionWithMask(status)
  }
  ngOnChanges({toggle}: SimpleChanges): void {
    if(toggle.previousValue !== undefined) {
      this.parent.nativeElement.classList.add('drag-animating')
      this.isActive.next(toggle.currentValue)
    }
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
