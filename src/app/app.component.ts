import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router, Event } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '@shared/auth/auth.service';
import { TreeNodeService } from '@shared/tree-node.service';
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
    private authService: AuthService,
    private treeNodeService: TreeNodeService,
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
    this.authService.loadUserFromLocalStorage()

    this.authService.getTreeChildren()
      .subscribe({
        error: () => {
          if(this.authService.isAuth) {
            this.authService.isAuth.next(false)
            localStorage.removeItem('isAuth')
            this.router.navigate(['/login'])
          }
        }
      })

    if(this.authService.isAuth) {
      this.treeNodeService.sortAgentAndRoom(this.treeNodeService.loadTreeNode())
    }
  }

  getValue(): boolean {
    return this.menuModalActive.getValue()
  }

  toggleModal() {
    this.menuModalActive.next(!this.getValue())
  }
}
