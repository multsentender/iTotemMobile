import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth/auth.component'
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GlobalErrorHandlerService } from './global-error-handler.service';
import { ApiHandlerInterceptor } from './api-handler.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';



@NgModule({
  declarations: [
    AuthComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
  ],
  exports: [
    AuthComponent,
  ],
  providers: [
    {provide: ErrorHandler, useClass: GlobalErrorHandlerService},
    {provide: HTTP_INTERCEPTORS, useClass: ApiHandlerInterceptor, multi: true,}
  ]
})
export class CoreModule { }
