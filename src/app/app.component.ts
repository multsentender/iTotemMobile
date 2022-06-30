import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';

import { AuthService } from '@shared/auth/auth.service';
import { environment } from '../environments/environment';

import { LogService, LogConfig, Logger, Log } from '@shared/services/log.service';
import { PathService } from '@shared/services/path.service'
import { ApiService } from '@shared/services/api.service';

import { fadeAnimation } from './animations';
import { SpinnerService } from '@shared/services/spinner.service';

declare const baseAssetsUrl: string;// – базовый урл к каталогу assets
declare const baseRouteUrl: string;// – базовый урл для HTML5 роунтина
declare const baseApiUrl: string;// – базовый урл для АПИ
declare const baseRootUrl: string;// - корень сайта, используется только для logout и переключение в Desktop режим
declare const appName: string;// – название продукта (Playpoint)
declare const backofficeAppName: string;// – название продукта Backoffice (Playpoint Backoffice)
declare const version: string;// - версия UI, должна использоваться в URL загрузки статики
declare const logConfig: LogConfig;//? - настройки логирования. Позволяют динамически менять уровень логирования отдельных классов. Будет детально описано в разделе посвященном логированию.
declare const userID: string;// - ID пользователя для целей логирования
declare const lang: string;// - текущий язык пользователя (en, it, pt, pt-BR, ..)
declare const freshchatToken: string;// - токен freshChat (может быть пустыми если для пользователя отключен чат)
declare const freshchatHost: string;// - хост freshChat (может быть пустыми если для пользователя отключен чат)
declare const userEmail: string;// - email текущего пользователя, для freshChat. Может быть пустым.

declare var  __webpack_public_path__:string;

declare global {
  interface Window {
    fcWidget: any;
  }
}


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],//not ./app.component.scss - webpack error
  animations:[
      fadeAnimation
  ]
})
export class AppComponent implements OnInit {
  componentName: string = 'AppComponent';
  currentRoute!: string;
  private _log: Logger = Log.get(this.componentName);//as name of component is removed in prod build
  env = environment;

  constructor(
    private authService: AuthService,
    private translate: TranslateService,
    private router: Router,
    private location: Location,
    private api: ApiService,
    protected logService: LogService,
    public pathService: PathService,
    public spinnerService: SpinnerService
    ) {

    try { environment.userID = userID; } catch (e) { }
    try {
      environment.logConfig = logConfig;
      logService.setConfig(environment.logConfig as LogConfig);
    } catch (e) { }
    this._log.info("open");
    try {
      environment.baseAssetsUrl = baseAssetsUrl;
      __webpack_public_path__ = baseAssetsUrl + "/";
      environment.baseRouteUrl = baseRouteUrl;
      // environment.baseApiUrl = `${baseApiUrl.slice(0, baseApiUrl.indexOf('/rest'))}/api/rest`;
      environment.baseApiUrl = baseApiUrl;
      environment.baseRootUrl = baseRootUrl;
      // environment.baseRootUrl = `${baseRootUrl}/api`;
      environment.version = version;
    } catch (e) { }
    try {
      environment.appName = appName;
      environment.backofficeAppName = backofficeAppName;
    } catch (e) { }
    try { environment.lang = lang; } catch (e) { }
    try { environment.freshchatToken = freshchatToken; } catch (e) { }
    try { environment.freshchatHost = freshchatHost; } catch (e) { }
    try { environment.userEmail = userEmail; } catch (e) { }

    this.translate.addLangs(['en', 'ru']);
    this.translate.setDefaultLang('en');
    this.translate.use(environment.lang);
  }

  ngOnInit(): void {
    this.api.getTreeChildren()
      .subscribe({
        next: () => {
          this.authService.isAwait.next(false)
          this.authService.isAuth.next(true)
          this.router.navigate(['/'])
        },
        error: () => {
          this.authService.isAwait.next(false)
          this.authService.isAuth.next(false)
        }
      })
  }

  toggleMenu() {
    this.router.isActive('settings', true) ? this.location.back() : this.router.navigate(['settings'])
  }
}
