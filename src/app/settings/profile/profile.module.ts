import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';

import { ComponentsModule } from '@shared/components/components.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { ProfileService } from '@shared/services/profile.service';
import { DirectiveModule } from '@shared/directives/directives.module';

import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    ProfileComponent
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
  ],
  providers: [ProfileService]
})
export class ProfileModule { }
