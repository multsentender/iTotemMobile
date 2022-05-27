import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@shared/auth/auth.service';
import { AgentInfo } from '@shared/models/agentInfo';
import { AgentTreeNode } from '@shared/models/agentTreeNode';
import { TreeNodeService } from '@shared/tree-node.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  public agents: Array<AgentInfo | AgentTreeNode> = [];
  public rooms: Array<AgentInfo | AgentTreeNode> = [];
  constructor(
    private router: Router,
    private authService: AuthService,
    private treeNodeService: TreeNodeService,
    private cookies: CookieService) {
      // FIXME оптимизация с лоадером
      this.treeNodeService.agents.subscribe((val) => this.agents = val)
      this.treeNodeService.rooms.subscribe((val) => this.rooms = val)
    }

    ngOnInit(): void {
      this.treeNodeService.sortAgentAndRoom(this.treeNodeService.loadTreeNode())
    }

    logOut(): void {
    const throwDownToDefault = () => {
      this.authService.isAuth.next(false)
      this.router.navigate(['/devLogin'])
    }

    // FIXME Вынести логику редиректа запроса в interceptor
    this.authService.logout().subscribe({
      next: () => throwDownToDefault(),
      error: (err: HttpErrorResponse) => {
        const url = err.url?.includes('/devLogin/')
        url ? throwDownToDefault() : console.error(err)
      }
    })
  }

  noMobile() {
    this.cookies.set('noMobile', 'true', {path: '/', sameSite: 'Strict'})
  }
}
