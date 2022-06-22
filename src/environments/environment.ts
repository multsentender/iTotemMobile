// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { LogConfig } from "@shared/services/log.service";

export const environment = {
  production: false,
  baseApiUrl: "http://localhost:4200/api/rest",
  baseAssetsUrl: "http://localhost:4200/assets",// – базовый урл к каталогу assets
  baseRouteUrl: "http://localhost:4200/mobile",// – базовый урл для HTML5 роунтина
  baseRootUrl: "http://localhost:4200/api",// - корень сайта, используется только для logout и переключение в Desktop режим
  appName: "Playpoint",// – название продукта (Playpoint)
  backofficeAppName: "Playpoint BackOffice",// – название продукта Backoffice (Playpoint Backoffice)
  version: "0.1",// - версия UI, должна использоваться в URL загрузки статики
  logConfig: {appenders: [], logLevels: []} as LogConfig,// - настройки логирования. Позволяют динамически менять уровень логирования отдельных классов. Будет детально описано в разделе посвященном логированию.
  userID: "",// - ID пользователя для целей логирования
  lang: "ru",// - текущий язык пользователя (en, it, pt, pt-BR, ..)
  freshchatToken: "",// - токен freshChat (может быть пустыми если для пользователя отключен чат)
  freshchatHost: "",// - хост freshChat (может быть пустыми если для пользователя отключен чат)
  userEmail: "",// - email текущего пользователя, для freshChat. Может быть пустым.
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
