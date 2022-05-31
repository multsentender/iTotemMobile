import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router, Event } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../environments/environment';
import { Location } from '@angular/common';
import { AuthService } from '@shared/auth/auth.service';
import { TreeNodeService } from '@shared/tree-node.service';

declare const baseAssetsUrl: string;// – базовый урл к каталогу assets
declare const baseRouteUrl: string;// – базовый урл для HTML5 роунтина
declare const baseApiUrl: string;// – базовый урл для АПИ
declare const baseRootUrl: string;// - корень сайта, используется только для logout и переключение в Desktop режим
declare const appName: string;// – название продукта (Playpoint)
declare const backofficeAppName: string;// – название продукта Backoffice (Playpoint Backoffice)
declare const version: string;// - версия UI, должна использоваться в URL загрузки статики
declare const logConfig: object;//? - настройки логирования. Позволяют динамически менять уровень логирования отдельных классов. Будет детально описано в разделе посвященном логированию.
declare const userID: string;// - ID пользователя для целей логирования
declare const lang: string;// - текущий язык пользователя (en, it, pt, pt-BR, ..)
declare const freshchatToken: string;// - токен freshChat (может быть пустыми если для пользователя отключен чат)
declare const freshchatHost: string;// - хост freshChat (может быть пустыми если для пользователя отключен чат)
declare const userEmail: string;// - email текущего пользователя, для freshChat. Может быть пустым.

declare var  __webpack_public_path__:string;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']//not ./app.component.scss - webpack error
})
export class AppComponent implements OnInit {
  currentRoute!: string;

  constructor(
    private authService: AuthService,
    translate: TranslateService,
    private router: Router,
    private location: Location
    ) {
    translate.addLangs(['en', 'ru']);
    translate.setDefaultLang('en');

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
    try { environment.logConfig = logConfig; } catch (e) { }
    try { environment.userID = userID; } catch (e) { }
    try { environment.lang = lang; } catch (e) { }
    try { environment.freshchatToken = freshchatToken; } catch (e) { }
    try { environment.freshchatHost = freshchatHost; } catch (e) { }
    try { environment.userEmail = userEmail; } catch (e) { }

    translate.use(environment.lang);
  }

  ngOnInit(): void {
    this.authService.getTreeChildren()
      .subscribe({
        next: () => {
          this.authService.isAuth.next(true)
        },
        error: () => {
          this.authService.isAuth.next(false)
          this.router.navigate(['/devLogin'])
        }
      })
  }

  toggleMenu() {
    this.router.isActive('settings', true) ? this.location.back() : this.router.navigate(['settings'])
  }
}
