import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DirectiveModule } from '@shared/directives/directives.module';
import { GlobalErrorHandlerService } from './global-error-handler.service';
import { ApiHandlerInterceptor } from './api-handler.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {MatButtonModule} from '@angular/material/button';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    DirectiveModule,
    MatButtonModule,
  ],
  providers: [
    {provide: ErrorHandler, useClass: GlobalErrorHandlerService},
    {provide: HTTP_INTERCEPTORS, useClass: ApiHandlerInterceptor, multi: true,}
  ]
})
export class CoreModule { }
