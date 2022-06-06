import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@shared/auth/auth.service';
import { AgentInfo } from '@shared/models/agentInfo';
import { AgentTreeNode } from '@shared/models/agentTreeNode';
import { TreeNodeService } from '@shared/tree-node.service';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../environments/environment';
import { Logger, Log } from '@shared/services/log.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  public logoutLink = `${environment.baseRootUrl}/logout`
  public agents: Array<AgentInfo | AgentTreeNode> = [];
  public rooms: Array<AgentInfo | AgentTreeNode> = [];
  private _log: Logger = Log.get(MenuComponent.name);
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
      this._log.info("open");
      this.treeNodeService.sortAgentAndRoom(this.treeNodeService.loadTreeNode())
    }

    logOut(): void {
      this.authService.isAuth.next(false)
    }

  noMobile() {
    this.cookies.set('noMobile', 'true', {path: '/', sameSite: 'Strict'})
  }
}
