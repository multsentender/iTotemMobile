import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthComponent } from './auth.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DirectiveModule } from '@shared/directives/directives.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: AuthComponent
      },
      {
        path: '**',
        redirectTo: ''
      }]),
    FormsModule,
    HttpClientModule,
    DirectiveModule,
  ]
})
export class AuthModule { }
