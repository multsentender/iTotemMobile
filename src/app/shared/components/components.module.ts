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
import {DragDropModule} from '@angular/cdk/drag-drop';

import { MessageComponent } from './message/message.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { SlideBtnComponent } from './slide-btn/slide-btn.component';
import { ControlErrorComponent } from './control-error/control-error.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    DragDropModule
  ],
  declarations: [
    IconInputComponent,
    CheckboxComponent,
    ModalComponent,
    MessageComponent,
    SpinnerComponent,
    SlideBtnComponent,
    ControlErrorComponent,
  ],
  exports: [
    IconInputComponent,
    CheckboxComponent,
    ModalComponent,
    MessageComponent,
    SlideBtnComponent,
    ControlErrorComponent,
  ],
})
export class ComponentsModule { }
