import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IconInputComponent } from './icon-input/icon-input.component'
import { PasswordInputComponent } from './password-input/password-input.component'
import { CheckboxComponent } from './checkbox/checkbox.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  declarations: [
    IconInputComponent,
    PasswordInputComponent,
    CheckboxComponent,
  ],
  exports: [
    IconInputComponent,
    PasswordInputComponent,
    CheckboxComponent,
  ],
})
export class ComponentsModule { }
