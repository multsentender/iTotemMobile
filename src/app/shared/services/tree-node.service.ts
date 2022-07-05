import { Injectable } from '@angular/core';
import { BasicTreeNode, AgentTreeNode, RoomTreeNode } from '@shared/models/models';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { isAgent, isRoom } from '../utils/nodeTypeDefinition';

@Injectable({providedIn: 'root'})
export class TreeNodeService {
  private _agentsSub = new BehaviorSubject<AgentTreeNode[]>([])
  private _roomsSub = new BehaviorSubject<RoomTreeNode[]>([])

  public readonly agents$ = this._agentsSub.asObservable()
  public readonly rooms$ = this._roomsSub.asObservable()

  constructor() { }

  // FIXME Оптимизировать (сверять с prev value)
  sortAgentAndRoom(req:
    Observable<BasicTreeNode[]>): void {
      const agents: Array<AgentTreeNode> = []
      const rooms: Array<RoomTreeNode> = []
      req.pipe(
        map((val) => {
          val.forEach(el => {
            if(isAgent(el)) agents.push(el)
            if(isRoom(el)) rooms.push(el)
          })
          return val
        }))
        .subscribe(() => {
          this._agentsSub.next(agents)
          this._roomsSub.next(rooms)
      })
  }
}
