import { CdkDragDrop, CdkDragEnd } from '@angular/cdk/drag-drop/drag-events';
import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { BehaviorSubject, filter, Observable, tap } from 'rxjs';


export enum modeSlideBtn { button, switch };

@Component({
  selector: 'app-slide-btn',
  templateUrl: './slide-btn.component.html',
  styleUrls: ['./slide-btn.component.scss']
})
export class SlideBtnComponent implements AfterViewInit {
  @Input() mode: modeSlideBtn = modeSlideBtn.button;
  @Input() off_text: string = 'SLIDE_CONFIRM'
  @Input() pending_on_text: string = 'CONFIRMING'
  @Input() on_text?: string;
  @Input() pending_off_text?: string

  @Input() pending_on!: Observable<unknown>
  @Input() pending_off?: Observable<unknown>
  // @Input() toggle?: (active: boolean) => void;

  public isActive = new BehaviorSubject<boolean>(false)
  public isLoading = false
  public transformMask = new BehaviorSubject<string>('translateX(0px)')
  public maskText?: string =
    !this.isActive ? this.pending_on_text :
    this.isLoading ? this.pending_off_text : this.on_text

  @ViewChild('slider') parent!: ElementRef<HTMLElement>;
  @ViewChild('sliderButton') dragElement!: ElementRef<HTMLElement>;
  private parentPosition = {left: 0, right: 0}
  private _dragPosition = {x: 0, y: 0};
  public dragPosition = this._dragPosition

  constructor() {
    this.isActive.subscribe(val => {
      if(val || (!val && this.isLoading)) {
        this.changePositionWithMask(this.parentPosition.right - this.parentPosition.left - this.dragElement.nativeElement.offsetWidth)
      } else this.changePositionWithMask(0)
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
  changePositionWithMask(val: number) {
    this.maskOffsetHand(val)
    this.changePosition(val)
  }


  toggleHand(event: CdkDragEnd) {
    // if(this.isActive.value && this.mode === modeSlideBtn.switch) {
    //   this.pending_off && this.pending_off
    //     .pipe(tap({
    //       complete: () => {
    //         this.isLoading = false
    //         this.isActive.next(false)
    //       }
    //     }))
    //     .subscribe(})
    // }
    // if(!this.isActive) {
    //   this.pending_on
    //     .pipe(tap({
    //       error: () => {},
    //       next: () => {
    //         if(this.mode === modeSlideBtn.switch) this.isActive.next(true)
    //         else this.isActive.next(false)
    //       },
    //       complete: () => this.isLoading = false
    //     }))
    //     .subscribe()
    // }
    // if(!this.isActive)
    //   this.pending_on
    //   .pipe(tap({
    //     error: () => {},
    //     complete: () => {
    //       if(this.mode === modeSlideBtn.switch) {
    //         this.isActive = true
    //       }
    //     }
    //   }))
    //   .subscribe(() => {
    //     this.isLoading = false
    //     event.source.disabled = false
    //   })
    // if(this.isActive && this.mode === modeSlideBtn.switch) {
    //   this.pending_off && this.pending_off.subscribe()
    // }
  }

  ngAfterViewInit(): void {
    this.getParentPosition()
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

    if(Math.abs(event.distance.x) >= containerWidth * 0.35) {
      this.isLoading = true
      event.source.disabled = true

      this.toggleHand(event)
    } else this.isActive.next(false)
  }
}
