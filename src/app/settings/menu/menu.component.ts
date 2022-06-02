import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@shared/auth/auth.service';
import { cachedRequests } from '@shared/cache/cache-decorator';
import { CacheService } from '@shared/cache/cache.service';
import { AgentInfo } from '@shared/models/agentInfo';
import { AgentTreeNode } from '@shared/models/agentTreeNode';
import { TreeNodeService } from '@shared/services/tree-node.service';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  public logoutLink = `${environment.baseRootUrl}/logout`
  public agents: Array<AgentInfo | AgentTreeNode> = [];
  public rooms: Array<AgentInfo | AgentTreeNode> = [];
  constructor(
    private authService: AuthService,
    private treeNodeService: TreeNodeService,
    private cookies: CookieService,
    private readonly cache: CacheService) {
      // FIXME оптимизация с лоадером
      this.treeNodeService.agents.subscribe((val) => this.agents = val)
      this.treeNodeService.rooms.subscribe((val) => this.rooms = val)
    }

    ngOnInit(): void {
      this.treeNodeService.sortAgentAndRoom(this.treeNodeService.loadTreeNode())
    }

    logOut(): void {
      this.authService.isAuth.next(false)
      window.location.href = `${environment.baseRootUrl}/logout`
    }

  noMobile() {
    this.cookies.set('noMobile', 'true', {path: '/', sameSite: 'Strict'})
  }
}
