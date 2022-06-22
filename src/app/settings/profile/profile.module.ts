import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './page/profile.component';

import { ComponentsModule } from '@shared/components/components.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { ProfileService } from '@shared/services/profile.service';
import { DirectiveModule } from '@shared/directives/directives.module';
import { ModalComponent } from './modal/modal.component';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    ProfileComponent,
    ModalComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: ProfileComponent
      },
      {
        path: '**',
        redirectTo: ''
      }]),
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    DirectiveModule,
    MatButtonModule,
    MatDialogModule,
  ],
  providers: [ProfileService]
})
export class ProfileModule { }
