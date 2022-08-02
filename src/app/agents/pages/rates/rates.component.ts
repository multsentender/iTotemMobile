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
import { BehaviorSubject } from 'rxjs';


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
  public isEditing = new BehaviorSubject<boolean>(false)

  // for reset changes
  private _filtredGroups: RateGroup[] = []
  public groupTree: RateGroup[] = []

  isLoading: boolean = true
  setLoad(val: boolean) {
    this.isLoading = val
  }

  private agentRateInfo?: AgentRateInfo

  // Permitions
  public editor: boolean = false
  public editorGroup: boolean = false
  public editorCheck: boolean = false

  public forms: FormGroup

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private fb: FormBuilder
  ) {
    this.forms = fb.group({
      globalRate: fb.control(0)
    })
  }


  generateGroupTree(data?: AgentRateInfo) {
    if(!data) return []

    const filtredGroups: RateGroup[] = Object.values(data.gameGroups).filter(item =>
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


    this._filtredGroups = filtredGroups
    // generate formGroups
    this.buildFormFromData(filtredGroups)

    const map = new Map(filtredGroups.map(el => [el.data.groupId, el]));

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
      rate: this.fb.control({value: rateInfo.rate, disabled: false}),
      excluded: this.fb.control({value: !rateInfo.excluded, disabled: !this.isEditing.value})
    }))
  }

  buildFormFromData(data: RateGroup[]) {
    data.forEach((el) => this.addFormGroup(el.data.groupId, el.rateInfo))
  }

  ngOnInit(): void {
    this.api.getAgentInfo(this.route.snapshot.params['id'])
      .pipe(spinnerHandlerPipe(this.setLoad.bind(this)))
      .subscribe(agent => {
        this.editor = hasPermission(agent, 'AGENT_EDIT')
        this.editorGroup = hasPermission(agent, 'AGENT_EDIT_GROUP_RATES')
        // this.editorCheck = hasPermission(agent, 'AGENT_EXCLUDE_GROUP_RATES')
        this.editorCheck = false
        this.agentRateInfo = agent.agentRateInfo

        this.forms.patchValue({globalRate: this.agentRateInfo?.rateInfo.rate})
        this.groupTree = this.generateGroupTree(this.agentRateInfo)
      })
  }

  onEdit() {
    this.isEditing.next(true)
  }

  updateRate(id: string) {
    let rateVal = this.forms.get(String(id))?.value.rate

    if(this.agentRateInfo && rateVal) {
      let rateInfo = this.agentRateInfo?.groupRateInfo[id]

      if(rateVal === rateInfo.rate) return

      AgentRateUtils.setEffectiveRate(this.agentRateInfo, rateInfo, rateVal)
    }
  }


  skipAccordionExpanding(event: PointerEvent) {
    event.stopPropagation();
  }

  resetChanges() {
    this.forms.patchValue({globalRate: this.agentRateInfo?.rateInfo.rate})
    this._filtredGroups.forEach(el => {
      const id = el.data.groupId
      const {rate, excluded} = el.rateInfo

      this.forms.patchValue({[id]: {rate, excluded: !excluded}})
    })
    this.isEditing.next(false)
  }

  onSubmit() {
    console.log(this.forms.value);
  }
}
