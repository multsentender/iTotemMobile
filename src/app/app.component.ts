import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '@shared/auth/auth.service';
import { TreeNodeService } from '@shared/tree-node.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  currentRoute!: string;
  constructor(
    private authService: AuthService,
    private treeNodeService: TreeNodeService,
    translate: TranslateService,
    private router: Router,
    private location: Location) {
    translate.addLangs(['en', 'ru']);
    translate.setDefaultLang('en');
    translate.use('en');
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

  toggleMenu() {
    this.router.isActive('settings', true) ? this.location.back() : this.router.navigate(['settings'])
  }
}
