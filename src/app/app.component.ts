import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router, Event } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../environments/environment';

declare const baseAssetsUrl: string;// – базовый урл к каталогу assets
declare const baseRouteUrl: string;// – базовый урл для HTML5 роунтина
declare const baseApiUrl: string;// – базовый урл для АПИ
declare const baseRootUrl: string;// - корень сайта, используется только для logout и переключение в Desktop режим
declare const appName: string;// – название продукта (Playpoint)
declare const backofficeAppName: string;// – название продукта Backoffice (Playpoint Backoffice)
declare const version: string;// - версия UI, должна использоваться в URL загрузки статики
declare const logConfig: string;//? - настройки логирования. Позволяют динамически менять уровень логирования отдельных классов. Будет детально описано в разделе посвященном логированию.
declare const userID: string;// - ID пользователя для целей логирования
declare const lang: string;// - текущий язык пользователя (en, it, pt, pt-BR, ..)
declare const freshchatToken: string;// - токен freshChat (может быть пустыми если для пользователя отключен чат)
declare const freshchatHost: string;// - хост freshChat (может быть пустыми если для пользователя отключен чат)
declare const userEmail: string;// - email текущего пользователя, для freshChat. Может быть пустым.

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']//not ./app.component.scss - webpack error
})
export class AppComponent {
  menuModalActive: BehaviorSubject<boolean>;
  currentRoute!: string;

  constructor(
    translate: TranslateService,
    private router: Router
  ) {
    translate.addLangs(['en', 'ru']);
    translate.setDefaultLang('en');

    this.menuModalActive = new BehaviorSubject<boolean>(false)
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.menuModalActive.next(false)
      }
    });

    try {
      environment.baseAssetsUrl = baseAssetsUrl;
      environment.baseRouteUrl = baseRouteUrl;
      environment.baseApiUrl = baseApiUrl;
      environment.baseRootUrl = baseRootUrl;
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

  getValue(): boolean {
    return this.menuModalActive.getValue()
  }

  toggleModal() {
    this.menuModalActive.next(!this.getValue())
  }
}
