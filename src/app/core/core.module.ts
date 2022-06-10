import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth/auth.component'
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DirectiveModule } from '@shared/directives/directives.module';



@NgModule({
  declarations: [
    AuthComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    DirectiveModule,
  ],
  exports: [
    AuthComponent,
  ]
})
export class CoreModule { }
