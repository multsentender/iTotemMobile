import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';
import {HttpClient, HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { MultiTranslateLoader } from './core/multi-translate-loader';

import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { AppComponent } from './app.component';
import { ComponentsModule } from './shared/components/components.module';


import { LogService } from './shared/services/log.service';
import { PathService } from './shared/services/path.service';
import { ApiHandlerInterceptor } from '@shared/api-handler.interceptor';

import '../styles/styles.scss';
import { ErrorMessageService } from '@shared/services/error-message.service';
import { AuthService } from '@shared/auth/auth.service';
import { DirectiveModule } from '@shared/directives/directives.module';

export function HttpYamlLoaderFactory(http: HttpClient): MultiTranslateLoader {

  const resources = [
    { prefix: '', suffix: '/settings.yaml' },
    { prefix: '', suffix: '/common.yaml' },
  ];
  return new MultiTranslateLoader(http, resources);
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    ComponentsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpYamlLoaderFactory,
        deps: [HttpClient]
      }
    }),
    DirectiveModule
  ],
  providers: [
    CookieService,
    LogService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiHandlerInterceptor,
      multi: true,
    },
    PathService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
