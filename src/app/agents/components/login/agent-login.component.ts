import { Component, Input, OnInit } from '@angular/core';
import { AgentInfo, AgentLoginInfo } from '@shared/models/models';
import { ApiService } from '@shared/services/api.service';
import { ModalService } from '@shared/services/modal.service';
import { PathService } from '@shared/services/path.service';
import { Logger, Log } from '@shared/services/log.service';
import { hasPermission } from '@shared/utils/SecurityUtils';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-agent-login',
  templateUrl: './agent-login.component.html',
  styleUrls: ['./agent-login.component.scss']
})
export class AgentLoginsComponent implements OnInit {
  componentName: string = 'AgentLoginsComponent';
  private _log: Logger = Log.get(this.componentName);

  logins: AgentLoginInfo[] = [{}, {}]
  show = {
    loginSettings: false,
  }
  displayedColumns: string[] = ['login', 'role'];

  @Input() agentInfo?: AgentInfo

  constructor(
    private api: ApiService,
    public pathService: PathService,
    private modalService: ModalService,
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {
    if (hasPermission(this.agentInfo!, 'AGENT_ACL_EDIT')) this.show.loginSettings = true;
    this.getLoginsList()
  }

  getLoginsList() {
    this.api.queryAgentLogins(this.agentInfo, false, false, false).subscribe(logins => this.logins = logins)
  }


  deleteLogin(login: AgentLoginInfo) {
    this._log.info("confirmation agent login delete");

    this.api.deleteAgentLoginInfo(login.agentId, login.userId, login.login)
      .subscribe(() => {
        this.logins = this.logins.filter(el => (el.login !== login.login || el.userId !== login.userId || el.agentId !== login.agentId))
      })
  }

  confirmDeleteLogin(login: AgentLoginInfo) {
    this._log.info("open agent login delete modal");

    this.modalService.initingModal({
      submitText: 'CONFIRM',
      title: "LOGIN_DELETE_TITLE",
      message: `${this.translate.instant("LOGIN_DELETE_MESSAGE")} ${login.login}?`,
      submitFunc: this.deleteLogin.bind(this, login)
    })
  }

}
