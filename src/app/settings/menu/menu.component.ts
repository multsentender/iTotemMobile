import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';

import { TreeNodeService } from '@shared/services/tree-node.service';
import { environment } from '../../../environments/environment';
import { PathService } from '@shared/services/path.service'

import { AgentTreeNode, LanguageInfo, RoomTreeNode } from '@shared/models/models';
import { ApiService } from '@shared/services/api.service';

import { spinnerHandlerPipe } from '@shared/extensions';
import { ModeSlideBtn } from '@shared/components/slide-btn/slide-btn.component';
import { HeaderMode } from '@shared/components/header/header.component';

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

  public agents: Array<AgentTreeNode> = [];
  public rooms: Array<RoomTreeNode> = [];

  public languages: Array<LanguageInfo> = []
  public langListVisible = false

  public HeaderMode = HeaderMode

  isLoading = true
  setLoad(val: boolean) {
    this.isLoading = val
  }

  constructor(
    private treeNodeService: TreeNodeService,
    private cookies: CookieService,
    private translate: TranslateService,
    private api: ApiService,
    public pathService: PathService,
  ) {
    this.treeNodeService.agents$.subscribe((val) => this.agents = val)
    this.treeNodeService.rooms$.subscribe((val) => this.rooms = val)
  }

  public get modeSlideBtn(): typeof ModeSlideBtn {
    return ModeSlideBtn;
  }

  ngOnInit(): void {
    this.treeNodeService.sortAgentAndRoom(
      this.api.getTreeChildren()
        .pipe(spinnerHandlerPipe(this.setLoad.bind(this)))
    )

    this.api.getSupportedLanguages()
      .subscribe((data) => {
        let langs = data.map(el => el.code ? el.code : '')
        this.translate.addLangs(langs)
        this.languages = data
      })
  }

  logOut(): void {
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
