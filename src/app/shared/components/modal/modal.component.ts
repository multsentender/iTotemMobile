import { Component, EventEmitter, Input, OnInit, Output, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


export interface ModalProps {
  title?: string,
  message?: string,
  submitText?: string,
  withForm?: boolean,
  cancelFunc?: () => void,
  submitFunc?: Function
}

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  @Output() cbEvent = new EventEmitter<string | boolean>();

  form = new FormControl('', { validators: Validators.required });

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalProps,
  ) { }

  ngOnInit(): void {}

  formHandler() {
    if (!this.data.withForm) {
      this.cbEvent.emit(true)
      // this.data.submitFunc()
    } else if (this.form.valid) {
      this.cbEvent.emit(this.form.value)
      // this.data.submitFunc(this.form.value)
    }
  }

  cancel() {
    this.cbEvent.emit(false)
  }
}
