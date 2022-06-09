import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class PathService {
  constructor() { }

  assetsPath(link: string){
    return environment.baseAssetsUrl+ link+ '?v='+ environment.version
  }
}