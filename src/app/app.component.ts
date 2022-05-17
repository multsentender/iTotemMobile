import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router, Event } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '@shared/auth/auth.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  menuModalActive: BehaviorSubject<boolean>;
  currentRoute!: string;
  constructor(
    private auth: AuthService,
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

  ngOnInit(): void {
    this.auth.loadUserFromLocalStorage()
  }

  getValue(): boolean {
    return this.menuModalActive.getValue()
  }

  toggleModal() {
    this.menuModalActive.next(!this.getValue())
  }
}
