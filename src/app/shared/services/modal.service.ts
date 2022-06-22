import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ModalComponent } from 'src/app/settings/profile/modal/modal.component';

interface ModalProps {
  title?: string,
  message?: string,
  withForm?: boolean,
  cancelFunc?: () => void,
  cbEvent: Function
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  dialogRef?: MatDialogRef<ModalComponent, any>;

  constructor(public dialog: MatDialog,) { }

  initingModal(data: ModalProps, options: MatDialogConfig, ) {
    const origin = data?.cancelFunc
    const closeModal = () => {
      origin && origin()
      this.dialogRef?.close()
    }
    data.cancelFunc = closeModal

    this.dialog.open(ModalComponent, {...options, data})

    this.dialogRef?.componentInstance.cbEvent.subscribe(val => data?.cbEvent(val))
    this.dialogRef?.afterClosed().subscribe(() => this.dialogRef?.componentInstance.cbEvent.unsubscribe())
  }
}
