import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '@shared/services/api.service';

import { spinnerHandlerPipe } from '@shared/extensions';
import { hasPermission } from '@shared/utils/SecurityUtils';
import { GameGroup } from '@shared/models/gameGroup';
import { AgentRateInfo } from '@shared/models/agentRateInfo';
import { RateInfo } from '@shared/models/models';
import { AgentRateUtils } from '@shared/utils/AgentRateUtils';

interface RateGroup {
  data: GameGroup,
  rate: RateInfo,
  children?: RateGroup[]
}

@Component({
  selector: 'app-rates',
  templateUrl: './rates.component.html',
  styleUrls: ['./rates.component.scss']
})
export class RatesComponent implements OnInit {
  public isEditing: boolean = false
  public groupTree: RateGroup[] = []

  isLoading: boolean = true
  setLoad(val: boolean) {
    this.isLoading = val
  }

  // Permitions
  public editor: boolean = false
  public editorGroup: boolean = false
  public radioEditor: boolean = false


  constructor(
    private route: ActivatedRoute,
    private api: ApiService
  ) { }


  generateGroupTree(data?: AgentRateInfo) {
    if(!data) return []

    const filtredGroup: RateGroup[] = Object.values(data.gameGroups).filter(item =>
      !item.service &&
      !item.revenueExclude &&
      (!['tournaments', 'jackpots', 'internet'].includes(item.groupName?.toLowerCase() || ''))
    ).map(mapItem => {
      let rate = data.groupRateInfo[mapItem.groupId]

      rate = {...rate, rate: AgentRateUtils.getEffectiveRate(data, rate)}

      return { data: mapItem, rate }
    })

// (item.groupName !== ('Tournaments' || 'Jackpots' || 'Internet'))
    const map = new Map(filtredGroup.map(el => [el.data.groupId, el]));

    for (let item of map.values()) {

      if (item.data.parentId === 0) {
        continue;
      }
      const parent = map.get(item.data.parentId);
      parent!.children = [...parent?.children || [], item];
    }

    return [...map.values()].filter(item => item.data.parentId === 0)
  }


  ngOnInit(): void {
    this.api.getAgentInfo(this.route.snapshot.params['id'])
      .pipe(spinnerHandlerPipe(this.setLoad.bind(this)))
      .subscribe(agent => {
        this.groupTree = this.generateGroupTree(agent.agentRateInfo)
        console.log(this.groupTree);


        this.editor = hasPermission(agent, 'AGENT_EDIT')
        this.editorGroup = hasPermission(agent, 'AGENT_EDIT_GROUP_RATES')
        this.radioEditor = hasPermission(agent, 'AGENT_EXCLUDE_GROUP_RATES')
      })
  }

  onEdit() {
    this.isEditing = true
  }


  skipAccordionExpanding(event: PointerEvent) {
    event.stopPropagation();
  }
}
