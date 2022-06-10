import { all } from 'deepmerge';
const jsyaml = require('js-yaml');
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';
import { environment } from '../../environments/environment';

export interface ITranslationResource {
    prefix: string;
    suffix: string;
}

export class MultiTranslateLoader implements TranslateLoader {
    env = environment;

    constructor(
        private http: HttpClient,
        private resources: ITranslationResource[]
    ) { }

    public getTranslation(lang: string): Observable<any> {
        const requests = this.resources.map(resource => {
            const last = environment.baseAssetsUrl?.slice(-1);
            const localPath = environment.baseAssetsUrl + ((last && last != '\/' && last != '\\') ? '/' : '') + 'lang/';
            resource.prefix = localPath;

            const isYaml = resource.suffix.includes('yaml');
            const path = resource.prefix + lang + resource.suffix + "?v=" + this.env.version;

            return this.http
                .get(path, {
                    responseType: 'text'
                })
                .pipe(
                    catchError(() => {
                        console.error('Could not find translation file:', path);
                        return of({});
                    }),
                    map(res => {
                        if (!res) {
                            return {};
                        }
                        if (isYaml) {
                            return jsyaml.load(res.toString());
                        } else {
                            return JSON.parse(res.toString());
                        }
                    })
                );
        });
        return forkJoin(requests).pipe(map(response => all(response)));
    }
}