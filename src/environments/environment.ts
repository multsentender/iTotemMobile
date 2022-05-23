// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: "http://localhost:4200/api/rest/",
  rootUrl: "http://localhost:4200/api/",

  baseAssetsUrl: "https://localhost:4200/assets",//string – базовый урл к каталогу assets
  baseRouteUrl: "http://localhost:4200/mobile",//string – базовый урл для HTML5 роунтина
  baseApiUrl: "https://test-a.itotem.net/rest",//string – базовый урл для АПИ
  baseRootUrl: "http://localhost:4200/",//string - корень сайта, используется только для logout и переключение в Desktop режим
  appName: "Playpoint",//string – название продукта (Playpoint)
  backofficeAppName: "Playpoint BackOffice",//string – название продукта Backoffice (Playpoint Backoffice)
  version: "0.1",//string - версия UI, должна использоваться в URL загрузки статики
  logConfig: {},//object? - настройки логирования. Позволяют динамически менять уровень логирования отдельных классов. Будет детально описано в разделе посвященном логированию.
  userID: "",//string - ID пользователя для целей логирования
  lang: "ru",//string - текущий язык пользователя (en, it, pt, pt-BR, ..)
  freshchatToken: "",//string - токен freshChat (может быть пустыми если для пользователя отключен чат)
  freshchatHost: "",//string - хост freshChat (может быть пустыми если для пользователя отключен чат)
  userEmail: "",//string - email текущего пользователя, для freshChat. Может быть пустым.
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
