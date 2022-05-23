import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  @Input() modalActive: boolean = false;
  @Input() title?: string;
  @Input() message?: string;

  @Input() withForm: boolean = false;

  @Output() modalActiveEvent = new EventEmitter<boolean>(this.modalActive);
  @Output() cbEvent = new EventEmitter<string>();

  form = new FormControl('', {validators: Validators.required});

  constructor() {}

  ngOnInit(): void {
  }

  formHandler() {
    if(!this.withForm) {
      this.cbEvent.emit()
    } else if(this.form.valid) {
      this.cbEvent.emit(this.form.value)
    }
  }

  cancel() {
    this.form.reset()
    this.modalActiveEvent.emit(false)
  }
}
