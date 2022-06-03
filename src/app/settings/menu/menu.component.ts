import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '@shared/auth/auth.service';
import { cachedRequests } from '@shared/cache/cache-decorator';
import { CacheService } from '@shared/cache/cache.service';
import { AgentInfo } from '@shared/models/agentInfo';
import { AgentTreeNode } from '@shared/models/agentTreeNode';
import { LanguageInfo } from '@shared/models/languageInfo';
import { TreeNodeService } from '@shared/services/tree-node.service';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  public toDesktopLink = environment.baseRootUrl
  public currentLocale = environment.lang
  public agents: Array<AgentInfo | AgentTreeNode> = [];
  public rooms: Array<AgentInfo | AgentTreeNode> = [];
  public languages: Array<LanguageInfo> = []

  public langListVisible = false

  constructor(
    private authService: AuthService,
    private treeNodeService: TreeNodeService,
    private cookies: CookieService,
    private http: HttpClient,
    private readonly cache: CacheService,
    private translate: TranslateService,
  ) {
    // FIXME оптимизация с лоадером
    this.treeNodeService.agents.subscribe((val) => this.agents = val)
    this.treeNodeService.rooms.subscribe((val) => this.rooms = val)
  }

  ngOnInit(): void {
    this.treeNodeService.sortAgentAndRoom(this.treeNodeService.loadTreeNode())
    this.getLanguages()
      .subscribe((data) => {
        let langs = data.map(el => el.code ? el.code : '')
        this.translate.addLangs(langs)
        this.languages = data
      })
  }



  logOut(): void {
    this.authService.isAuth.next(false)
    window.location.href = `${environment.baseRootUrl}/logout`
  }

  noMobile() {
    this.cookies.set('noMobile', 'true', {path: '/', sameSite: 'Strict'})
  }

  @cachedRequests(function() {return this.cache})
  getLanguages() : Observable<LanguageInfo[]> {
    return this.http.get<LanguageInfo[]>(`${environment.baseApiUrl}/getSupportedLanguages`)
  }
  changeLocale(langCode: string) {
    this.cookies.set('customLocale', langCode, new Date('2035'))
    this.translate.use(langCode)
    // window.location.reload()
  }
}
