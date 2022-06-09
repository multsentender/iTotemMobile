import { Injectable } from '@angular/core';
import path from 'path-browserify';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class PathService {
    constructor() { }

    assetsPath(link: string) {
        return new URL('?v=' + environment.version, path.join(environment.baseAssetsUrl, link))
    }
}