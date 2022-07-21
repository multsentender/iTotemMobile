import { CdkDragDrop, CdkDragEnd } from '@angular/cdk/drag-drop/drag-events';
import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { PathService } from '@shared/services/path.service';
import { BehaviorSubject, filter, Observable, pairwise, tap } from 'rxjs';


export enum ModeSlideBtn { button, switch };

@Component({
  selector: 'app-slide-btn',
  templateUrl: './slide-btn.component.html',
  styleUrls: ['./slide-btn.component.scss']
})
export class SlideBtnComponent implements AfterViewInit {
  @Input() mode: ModeSlideBtn = ModeSlideBtn.button;
  @Input() off_text: string = 'SLIDE_CONFIRM'
  @Input() pending_on_text: string = 'CONFIRMING'
  @Input() on_text?: string;
  @Input() pending_off_text?: string

  @Input() pending_on!: () => Observable<unknown>;
  @Input() pending_off?: () => Observable<unknown>;

  public isActive = new BehaviorSubject<boolean>(false)
  public isLoading = new BehaviorSubject<boolean>(false)
  public transformMask = new BehaviorSubject<string>('translateX(0px)')
  // public maskText?: string =
  //   !this.isActive ? this.pending_on_text :
  //   this.isLoading ? this.pending_off_text : this.on_text

  @ViewChild('slider') parent!: ElementRef<HTMLElement>;
  @ViewChild('sliderButton') dragElement!: ElementRef<HTMLElement>;
  private parentPosition = {left: 0, right: 0}
  private _dragPosition = {x: 0, y: 0};
  public dragPosition = this._dragPosition

  constructor(
    public pathService: PathService) {
    this.isActive
      .pipe(pairwise(), filter(([prev, next]) => prev !== next))
      .subscribe(([_, val]) => {
        this.togglePositionWithMask()

        if(!val && this.mode === ModeSlideBtn.switch && this.pending_off) {
          this.isLoading.next(true)
          this.pending_off().subscribe(() => this.isLoading.next(false))
          return
        }

        if(val) {
          this.isLoading.next(true)

          this.pending_on()
          .pipe(tap({
            error: () => {
              if(this.mode === ModeSlideBtn.switch) this.toggleActive(false)
            },
            complete: () => {
              if(this.mode === ModeSlideBtn.button) this.toggleActive(false)
            }}))
          .subscribe(() => {
            this.isLoading.next(false)
          })
          return
        } else {
          this.isLoading.next(false)
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
  togglePositionWithMask() {
    const active = this.isActive.value
    const offset = this.parentPosition.right - this.parentPosition.left - this.dragElement.nativeElement.offsetWidth

    if(active) {
      this.maskOffsetHand(offset)
      this.changePosition(offset)
    } else {
      this.maskOffsetHand(0)
      this.changePosition(0)
    }
  }

  toggleActive(val?: boolean) {
    this.isActive.next(val ? val : !this.isActive.value)
  }



  ngAfterViewInit(): void {
    this.getParentPosition()
    this.togglePositionWithMask()
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
      this.toggleActive()
    } else this.togglePositionWithMask()
  }
}
