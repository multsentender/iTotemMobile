import { Component, Input, OnInit } from '@angular/core';
import { AgentInfo, AgentLoginInfo } from '@shared/models/models';
import { ApiService } from '@shared/services/api.service';
import { PathService } from '@shared/services/path.service';
import { hasPermission } from '@shared/utils/SecurityUtils';

@Component({
  selector: 'app-agent-login',
  templateUrl: './agent-login.component.html',
  styleUrls: ['./agent-login.component.scss']
})
export class AgentLoginsComponent implements OnInit {
  logins: AgentLoginInfo[] = []
  show = {
    loginSettings: false,
  }  
  displayedColumns: string[] = ['login', 'role'];

  @Input() agentInfo?: AgentInfo

  constructor(
    private api: ApiService,
    public pathService: PathService
  ) { }

  ngOnInit(): void {
    if (hasPermission(this.agentInfo!, 'AGENT_ACL_EDIT')) this.show.loginSettings = true;
    this.getLoginsList()
  }

  getLoginsList(){
    this.api.queryAgentLogins(this.agentInfo!, false, false, false).subscribe(logins => this.logins = logins)
  }

}
