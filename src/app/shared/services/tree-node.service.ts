import { Injectable } from '@angular/core';
import { AgentInfo, AgentTreeNode, BasicTreeNode, RoomInfo, RoomTreeNode } from '@shared/models/models';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { isAgent, isRoom } from '../utils/nodeTypeDefinition';

@Injectable({providedIn: 'root'})
export class TreeNodeService {
  agents: BehaviorSubject<Array<AgentInfo | AgentTreeNode>> = new BehaviorSubject<Array<AgentInfo | AgentTreeNode>>([])
  rooms: BehaviorSubject<Array<RoomInfo | RoomTreeNode>> = new BehaviorSubject<Array<RoomInfo | RoomTreeNode>>([])

  constructor() { }

  // FIXME Оптимизировать (сверять с prev value)
  sortAgentAndRoom(req:
    Observable<BasicTreeNode[]>): void {
      const agents: Array<AgentInfo | AgentTreeNode> = []
      const rooms: Array<RoomInfo | RoomTreeNode> = []
      req.pipe(
        map((val) => {
          val.forEach(el => {
            if(isAgent(el)) agents.push(el)
            if(isRoom(el)) rooms.push(el)
          })
          return val
        }))
        .subscribe(() => {
        this.agents.next(agents)
        this.rooms.next(rooms)
      })
  }
}
