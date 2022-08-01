import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '@shared/services/api.service';

import { spinnerHandlerPipe } from '@shared/extensions';
import { hasPermission } from '@shared/utils/SecurityUtils';
import { GameGroup } from '@shared/models/gameGroup';
import { AgentRateInfo } from '@shared/models/agentRateInfo';
import { RateInfo } from '@shared/models/models';
import { AgentRateUtils } from '@shared/utils/AgentRateUtils';
import { FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { rateValidator } from '@shared/utils/formValidators';


interface GroupRateOptions extends RateInfo {
  defaultRate?: boolean
}
interface RateGroup {
  data: GameGroup,
  rateInfo: GroupRateOptions,
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

  private agentRateInfo?: AgentRateInfo

  // Permitions
  public editor: boolean = false
  public editorGroup: boolean = false
  public radioEditor: boolean = false

  public forms: FormGroup

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private fb: FormBuilder
  ) {
    this.forms = fb.group({})
  }


  generateGroupTree(data?: AgentRateInfo) {
    if(!data) return []

    const filtredGroup: RateGroup[] = Object.values(data.gameGroups).filter(item =>
      !item.service &&
      !item.revenueExclude &&
      (!['tournaments', 'jackpots', 'internet'].includes(item.groupName?.toLowerCase() || ''))
    ).map(mapItem => {
      let rateInfo: GroupRateOptions = data.groupRateInfo[mapItem.groupId]
      rateInfo = {
        ...rateInfo,
        rate: AgentRateUtils.getEffectiveRate(data, rateInfo),
        defaultRate: AgentRateUtils.checkRateForDefault(data, rateInfo)
      }

      return { data: mapItem, rateInfo }
    })

    // generate formGroups
    this.buildFormFromData(filtredGroup)

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


  addFormGroup(id: number, rateInfo: RateInfo) {
    this.forms.addControl(String(id), this.fb.group({
      rate: this.fb.control(rateInfo.rate),
      excluded: this.fb.control(rateInfo.excluded || false)
    }))
  }
  buildFormFromData(data: RateGroup[]) {
    data.forEach((el) => this.addFormGroup(el.data.groupId, el.rateInfo))
  }

  ngOnInit(): void {
    this.api.getAgentInfo(this.route.snapshot.params['id'])
      .pipe(spinnerHandlerPipe(this.setLoad.bind(this)))
      .subscribe(agent => {
        this.agentRateInfo = agent.agentRateInfo
        this.groupTree = this.generateGroupTree(this.agentRateInfo)
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

  onSubmit() {
    console.log(this.forms.value);
  }
}
