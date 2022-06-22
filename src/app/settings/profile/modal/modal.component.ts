import { Component, EventEmitter, Input, OnInit, Output, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface DialogData {
  title: string,
  message: string,
  withForm: boolean,
  cbEvent: EventEmitter<string>
}

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  @Input() title?: string;
  @Input() message?: string;

  @Input() withForm: boolean = false;
  @Input() cancelFunc?: () => void;

  @Output() cbEvent = new EventEmitter<string | boolean>();

  form = new FormControl('', { validators: Validators.required });

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }

  ngOnInit(): void {
  }

  formHandler() {
    if (!this.data.withForm) {
      this.cbEvent.emit(true)
    } else if (this.form.valid) {
      this.cbEvent.emit(this.form.value)
    }
  }

  cancel() {
    this.cancelFunc && this.cancelFunc()
    this.dialogRef.close();
  }
}
