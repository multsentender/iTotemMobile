import { Component } from '@angular/core';
import { NavigationStart, Router, Event } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  menuModalActive: BehaviorSubject<boolean>;
  currentRoute!: string;
  constructor(
    translate: TranslateService,
    private router: Router) {
    translate.addLangs(['en', 'ru']);
    translate.setDefaultLang('en');
    translate.use('en');

    this.menuModalActive = new BehaviorSubject<boolean>(false)
    this.router.events.subscribe((event: Event) => {
        if (event instanceof NavigationStart) {
            this.menuModalActive.next(false)
        }
    });
  }

  getValue(): boolean {
    return this.menuModalActive.getValue()
  }

  toggleModal() {
    this.menuModalActive.next(!this.getValue())
  }
}
