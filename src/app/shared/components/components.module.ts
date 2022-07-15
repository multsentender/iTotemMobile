import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IconInputComponent } from './icon-input/icon-input.component'
import { CheckboxComponent } from './checkbox/checkbox.component';
import { ModalComponent } from './modal/modal.component';
import { TranslateModule } from '@ngx-translate/core';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MessageComponent } from './message/message.component';
import { SpinnerComponent } from './spinner/spinner.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule
  ],
  declarations: [
    IconInputComponent,
    CheckboxComponent,
    ModalComponent,
    MessageComponent,
    SpinnerComponent,
  ],
  exports: [
    IconInputComponent,
    CheckboxComponent,
    ModalComponent,
    MessageComponent,
  ],
})
export class ComponentsModule { }
