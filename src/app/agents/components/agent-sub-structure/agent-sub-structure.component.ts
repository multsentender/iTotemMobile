import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AgentInfo, AgentTreeNode, BasicTreeNode, RoomTreeNode } from '@shared/models/models';
import { PathService } from '@shared/services/path.service';
import { hasPermission } from '@shared/utils/SecurityUtils';
import { ApiService } from '@shared/services/api.service';
import { Logger, Log } from '@shared/services/log.service';
import { ModalService } from '@shared/services/modal.service';

@Component({
  selector: 'app-agent-sub-structure',
  templateUrl: './agent-sub-structure.component.html',
  styleUrls: ['./agent-sub-structure.component.scss']
})
export class AgentSubStructureComponent implements OnInit {
  componentName: string = 'AgentSubStructureComponent';
  private _log: Logger = Log.get(this.componentName);

  subs: BasicTreeNode[] = [{}, {}, {}];
  show = {
    addAgent: false,
    addRoom: false,

    overdraft: false,
  }

  @Input() agentInfo?: AgentInfo

  constructor(
    public pathService: PathService,
    private translate: TranslateService,
    private api: ApiService,
    private modalService: ModalService,
  ) { }

  ngOnInit(): void {
    this.api.getTreeChildren(this.agentInfo).subscribe(subs => this.subs = subs)

    this.getPermissions()
  }

  getPermissions() {
    if (hasPermission(this.agentInfo || {}, 'AGENT_CREATE_SUB_AGENT')) this.show.addAgent = true;
    if (hasPermission(this.agentInfo || {}, 'AGENT_CREATE_ROOM')) this.show.addRoom = true;

    if (hasPermission(this.agentInfo || {}, 'AGENT_VIEW_OVERDRAFT')) this.show.overdraft = true;
  }

  unBlockAgentConfirm(sub: AgentTreeNode) {
    this._log.info(`open substructure agent block modal`);

    this.modalService.initingModal({
      submitText: 'CONFIRM',
      title: sub.blocked ? "CONFIRM_UNBLOCK_TITLE" : "CONFIRM_BLOCK_TITLE",
      message: `${this.translate.instant(sub.blocked ? "CONFIRM_UNBLOCK_AGENT_MESSAGE" : "CONFIRM_BLOCK_AGENT_MESSAGE")} ${sub.label}?`,
      submitFunc: this.unBlockAgent.bind(this, sub)
    })
  }


  unBlockAgent(node: AgentTreeNode) {
    this._log.info(`confirmation agent substructure agent block`);

    this.api.setAgentBlocked(node, !node.blocked).subscribe(() => {
      node.blocked = !node.blocked
    })
  }

  deleteAgent(sub: BasicTreeNode) {
    this._log.info('open substructure agent delete modal');

    this.modalService.initingModal({
      submitText: 'CONFIRM',
      title: "CONFIRM_DELETE_TITLE",
      message: `${this.translate.instant("AGENT_DELETE_MESSAGE")} ${sub.label}?`,
      submitFunc: this.deleteAgentRoom.bind(this, sub)
    })
  }

  deleteRoom(sub: RoomTreeNode) {
    this._log.info('open substructure room delete modal');

    this.modalService.initingModal({
      submitText: 'CONFIRM',
      title: "CONFIRM_DELETE_TITLE",
      message: `${this.translate.instant("ROOM_DELETE_MESSAGE")} ${sub.label}?`,
      submitFunc: this.deleteAgentRoom.bind(this, sub)
    })
  }

  deleteAgentRoom(node: BasicTreeNode) {
    this._log.info(`confirmation agent substructure ${(node._c == 'AgentTreeNode') ? 'agent' : 'room'} delete`);

    this.api.deleteTreeItem(node).subscribe(() => {
      this.subs = this.subs.filter(el => (el.id !== node.id))
    })
  }

}
