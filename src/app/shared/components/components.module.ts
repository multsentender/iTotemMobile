import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IconInputComponent } from './icon-input/icon-input.component'
import { PasswordInputComponent } from './password-input/password-input.component'
import { CheckboxComponent } from './checkbox/checkbox.component';
//import { ModalComponent } from './modal/modal.component';
import { ErrorMessageComponent } from './error-message/error-message.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MessageComponent } from './message/message.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatButtonModule,
  ],
  declarations: [
    IconInputComponent,
    PasswordInputComponent,
    CheckboxComponent,
    //ModalComponent,
    ErrorMessageComponent,
    MessageComponent,
  ],
  exports: [
    IconInputComponent,
    PasswordInputComponent,
    CheckboxComponent,
    //ModalComponent,
    ErrorMessageComponent,
    MessageComponent,
  ],
})
export class ComponentsModule { }
