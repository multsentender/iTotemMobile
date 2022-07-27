import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { MessageComponent } from '@shared/components/message/message.component';
import { mergeMap, of } from 'rxjs';
import { ErrorMessageService } from './error-message.service';

export enum MessageType {
  error = "success__error",
  success = "success__success"
}

export interface MatMessage {
  message: string[],
  type: MessageType
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private processingMessage: boolean = false;
  private messageQueue: MatMessage[] = [];

  constructor(
    private snackBar: MatSnackBar,
    private errorService: ErrorMessageService,
    private translate: TranslateService,
  ) {
  }

  public init(): void {
    this.errorService.errors.pipe(
      mergeMap(val => {
        if (val.length > 0)
          return this.translate.get(val)
        return of(val)
      })
    ).subscribe(el => {
      this.showError(Object.values(el))
    })
  }

  private displaySnackbar(): void {
    const nextMessage = this.getNextMessage();

    if (!nextMessage) {
      this.processingMessage = false; // No message in the queue, set flag false
      return;
    }
    this.processingMessage = true; // A message was dequeued and is being processed

    const options: MatSnackBarConfig = {
      verticalPosition: 'top',
      data: {
        ...nextMessage
      }
    }
    if(nextMessage.type === MessageType.success){
      options.duration = 2000
    }

    this.snackBar.openFromComponent(MessageComponent, options)
      .afterDismissed()
      .subscribe(() => {
        //clear error after closing of last error message
        if (nextMessage.type === MessageType.error && this.messageQueue.length == 0)
          this.errorService.clearErrors()
        this.displaySnackbar();
      });
  }

  private getNextMessage(): MatMessage | undefined {
    return this.messageQueue.length ? this.messageQueue.shift() : undefined;
  }

  showSuccess() {
    //errors will remain in queue
    this.errorService.clearErrors()
    this.showMessage(['CHANGES_SAVED'], MessageType.success)
  }

  showError(message: string[]) {
    if (message.length > 0) {
      //for last error message only update text
      if (this.messageQueue[this.messageQueue.length - 1]?.type === MessageType.error)
        this.messageQueue.pop()

      this.showMessage(message, MessageType.error)
    }
  }

  showMessage(message: string[], type: MessageType) {
    this.messageQueue.push({ message, type });
    //show immediately if there is no message on screen currently
    if (!this.processingMessage) {
      this.displaySnackbar();
    }

  }

  closeMessage() {
    this.snackBar.dismiss()
  }
}
