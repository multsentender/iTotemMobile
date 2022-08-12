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
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import {DragDropModule} from '@angular/cdk/drag-drop';

import { MessageComponent } from './message/message.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { SlideBtnComponent } from './slide-btn/slide-btn.component';
import { ControlErrorComponent } from './control-error/control-error.component';
import { HeaderComponent } from './header/header.component'
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    DragDropModule,
    MatToolbarModule,
    MatIconModule,
    RouterModule,
  ],
  declarations: [
    IconInputComponent,
    CheckboxComponent,
    ModalComponent,
    MessageComponent,
    SpinnerComponent,
    SlideBtnComponent,
    ControlErrorComponent,
    HeaderComponent,
  ],
  exports: [
    IconInputComponent,
    CheckboxComponent,
    ModalComponent,
    MessageComponent,
    SlideBtnComponent,
    ControlErrorComponent,
    HeaderComponent,
  ],
})
export class ComponentsModule { }
