import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, pairwise } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoutingService {
  public currentRoute: string;
  public previosRoute?: string;

  constructor(private router: Router) {

    this.currentRoute = this.router.url

    this.router.events
      .pipe(
        filter(e => e instanceof NavigationEnd),
        pairwise()
      ).subscribe(([prev, next]: any) => {
        this.previosRoute = prev.url;
        this.currentRoute = next.url;
      })
  }
}
