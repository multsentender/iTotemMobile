import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ModalComponent, ModalProps } from '@shared/components/modal/modal.component';
import { first } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ModalService {
  dialogRef?: MatDialogRef<ModalComponent, any>;
  isOpen = false

  constructor(public dialog: MatDialog) { }

  initingModal(data: ModalProps, options?: MatDialogConfig) {
    if(!this.isOpen) {
      this.dialogRef = this.dialog.open(ModalComponent, {
        maxWidth: 'calc(100% - var(--container-pad) * 2)',
        ...options,
        data
      })

      this.isOpen = true

      this.dialogRef.componentInstance.cbEvent.subscribe(val => {
        if(!val) data.cancelFunc && data.cancelFunc()
        else data.submitFunc(val)
        this.closeModal()
      })

      this.dialogRef.afterClosed().subscribe(
        () => this.dialogRef?.componentInstance.cbEvent.unsubscribe()
      )
    }
  }

  closeModal() {
    this.dialogRef?.close()
    this.isOpen = false
  }
}
