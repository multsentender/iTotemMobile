import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AgentInfo, AgentTreeNode, BasicTreeNode, RoomTreeNode } from '@shared/models/models';
import { PathService } from '@shared/services/path.service';
import { hasPermission } from '@shared/utils/SecurityUtils';
import { ApiService } from '@shared/services/api.service';

@Component({
  selector: 'app-agent-sub-structure',
  templateUrl: './agent-sub-structure.component.html',
  styleUrls: ['./agent-sub-structure.component.scss']
})
export class AgentSubStructureComponent implements OnInit {

  subs: BasicTreeNode[] = [{}, {}, {}];
  show = {
    addAgent: true,
    addRoom: true,
  }

  @Input() agentInfo?: AgentInfo

  constructor(
    public pathService: PathService,
    private translate: TranslateService,
    private api: ApiService,
  ) { }

  ngOnInit(): void {
    this.api.getTreeChildren(this.agentInfo).subscribe(subs => {
      this.subs = subs;
      (this.subs[3] as AgentTreeNode).blocked = true;//!only for test
    })

    if (hasPermission(this.agentInfo || {}, 'AGENT_CREATE_SUB_AGENT')) this.show.addAgent = true;
    if (hasPermission(this.agentInfo || {}, 'AGENT_CREATE_ROOM')) this.show.addRoom = true;
  }


  unBlockAgent(sub: BasicTreeNode){
  }

  deleteAgent(sub: BasicTreeNode){
  }
  deleteRoom(sub: RoomTreeNode){
  }

}
