import { CdkDragDrop } from '@angular/cdk/drag-drop/drag-events';
import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


export enum modeSlideMtn { button, switch };

@Component({
  selector: 'app-slide-btn',
  templateUrl: './slide-btn.component.html',
  styleUrls: ['./slide-btn.component.scss']
})
export class SlideBtnComponent implements AfterViewInit {
  @Input() mode: modeSlideMtn = modeSlideMtn.button;
  @Input() off_text: string = 'CONFIRM'
  @Input() pending_on_text: string = 'CONFIRMING'
  @Input() on_text?: string;
  @Input() pending_off_text?: string

  @Input() pending_on!: () => void
  @Input() pending_off?: () => void
  @Input() toggle?: (active: boolean) => void;

  public isActive: boolean = false
  public isLoading: boolean = false
  public transformMask = new BehaviorSubject<string>('translateX(0px)')
  public maskText?: string =
    !this.isActive ? this.pending_on_text :
    this.isLoading ? this.pending_off_text : this.on_text

  @ViewChild('slider') parent!: ElementRef<HTMLElement>;
  private parentPosition = {left: 0, right: 0}
  private _dragPosition = {x: 0, y: 0};
  public dragPosition = this._dragPosition

  constructor() {}

  getParentPosition() {
    const {nativeElement} = this.parent

    let left = nativeElement.offsetLeft - nativeElement.scrollLeft;
    let right = left + nativeElement.offsetWidth;

    this.parentPosition = {left, right}
  }

  getDragPosition(event: any) {
    let dragElement = event.source.getRootElement();
    let boundingClientRect = dragElement.getBoundingClientRect();

    return boundingClientRect
  }

  ngAfterViewInit() {
    this.getParentPosition()
  }



  onDragMoved(event: CdkDragDrop<string[]>) {
    const coords = this.getDragPosition(event)
    this._dragPosition = {x: coords.x, y: coords.y}

    this.transformMask.next(
      `translateX(${coords.x - this.parentPosition.left}px)`
    )
  }

  onDragEnd(event: CdkDragDrop<string[]>) {
    console.log(this._dragPosition);
    console.log(this.dragPosition);
    console.log(event);
  }

  changePosition() {
    this.dragPosition = {x: 0, y: 0}
    this.transformMask.next(
      `translateX(0px)`
    )
  }
}
