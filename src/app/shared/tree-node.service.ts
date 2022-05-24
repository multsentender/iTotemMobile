import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, first, map, pairwise, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AgentInfo } from './models/agentInfo';
import { AgentTreeNode } from './models/agentTreeNode';
import { RoomInfo } from './models/roomInfo';
import { RoomTreeNode } from './models/roomTreeNode';
import { isAgent, isRoom } from './utils/nodeTypeDefinition';

@Injectable({providedIn: 'root'})
export class TreeNodeService {
  agents: BehaviorSubject<Array<AgentInfo | AgentTreeNode>> = new BehaviorSubject<Array<AgentInfo | AgentTreeNode>>([])
  rooms: BehaviorSubject<Array<RoomInfo | RoomTreeNode>> = new BehaviorSubject<Array<RoomInfo | RoomTreeNode>>([])

  constructor(private http: HttpClient) { }

  loadTreeNode() {
      return this.http.post<Array<AgentTreeNode | AgentInfo | RoomTreeNode | RoomInfo>>(
        `${environment.apiUrl}getTreeChildren`,
        {parent: null},
        {withCredentials: true})
  }

  // FIXME Оптимизировать (сверять с prev value)
  sortAgentAndRoom(req:
    Observable<Array<AgentTreeNode
    | AgentInfo
    | RoomTreeNode
    | RoomInfo>>): void {
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
