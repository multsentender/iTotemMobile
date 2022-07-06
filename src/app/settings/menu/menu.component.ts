import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';

import { AuthService } from '@shared/auth/auth.service';
import { TreeNodeService } from '@shared/services/tree-node.service';
import { environment } from '../../../environments/environment';
import { PathService } from '@shared/services/path.service'

import { AgentInfo, AgentTreeNode, LanguageInfo } from '@shared/models/models';
import { ApiService } from '@shared/services/api.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  componentName: string = 'MenuComponent';
  public toDesktopLink = environment.baseRootUrl
  public currentLocale = environment.lang
  public freshchatToken = environment.freshchatToken

  public agents: Array<AgentInfo | AgentTreeNode> = [];
  public rooms: Array<AgentInfo | AgentTreeNode> = [];

  public languages: Array<LanguageInfo> = []
  public langListVisible = false

  isLoading = true

  constructor(
    private authService: AuthService,
    private treeNodeService: TreeNodeService,
    private cookies: CookieService,
    private translate: TranslateService,
    private api: ApiService,
    public pathService: PathService,
  ) {
    this.treeNodeService.agents.subscribe((val) => this.agents = val)
    this.treeNodeService.rooms.subscribe((val) => this.rooms = val)
  }

  ngOnInit(): void {
    this.treeNodeService.sortAgentAndRoom(this.api.getTreeChildren())

    this.api.getSupportedLanguages()
      .subscribe((data) => {
        let langs = data.map(el => el.code ? el.code : '')
        this.translate.addLangs(langs)
        this.languages = data
        this.isLoading = false
      })
  }

  logOut(): void {
    this.authService.isAuth.next(false)
    window.location.href = `${environment.baseRootUrl}/logout`
  }

  noMobile() {
    this.cookies.set('noMobile', 'true', {path: '/', sameSite: 'Strict'})
  }

  changeLocale(langCode: string) {
    this.cookies.set('customLocale', langCode, new Date('2035'))
    this.translate.use(langCode)
    environment.lang = langCode
    this.currentLocale = langCode
    this.langListVisible = false
  }

  support(){
    window.fcWidget?.open()
  }
}
