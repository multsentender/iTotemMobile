import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-slide-btn',
  templateUrl: './slide-btn.component.html',
  styleUrls: ['./slide-btn.component.scss']
})
export class SlideBtnComponent implements OnInit {
  computeDragRenderPos(pos: any, dragRef: any) {
    console.log(pos);

    return {x: pos.x, y: pos.y}; // will render the element every 30 pixels horizontally
  }

  constructor() {

  }

  ngOnInit(): void {
  }
}
