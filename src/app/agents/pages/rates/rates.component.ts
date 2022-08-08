import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '@shared/services/api.service';

import { spinnerHandlerPipe } from '@shared/extensions';
import { hasPermission } from '@shared/utils/SecurityUtils';
import { GameGroup } from '@shared/models/gameGroup';
import { AgentRateInfo } from '@shared/models/agentRateInfo';
import { RateInfo } from '@shared/models/models';
import { AgentRateUtils } from '@shared/utils/AgentRateUtils';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { rateValidator } from '@shared/utils/FormValidators';
import { ModeSlideBtn } from '@shared/components/slide-btn/slide-btn.component';
import { BehaviorSubject } from 'rxjs';


interface GroupRateOptions extends RateInfo {
  defaultRate?: boolean
}
export interface RateGroup {
  data: GameGroup,
  rateInfo: GroupRateOptions,
  children?: RateGroup[]
}

@Component({
  selector: 'app-rates',
  templateUrl: './rates.component.html',
  styleUrls: ['./rates.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RatesComponent implements OnInit {
  public isEditing: boolean = true
  isLoading = new BehaviorSubject<boolean>(true)
  setLoad(val: boolean) {
    this.isLoading.next(val)
  }

  public ModeSlideBtn = ModeSlideBtn

  private agentRateInfo?: AgentRateInfo
  private filtredGroups: RateGroup[] = []
  public groupTree: RateGroup[] = []

  public forms: FormGroup;

  // Permitions
  public editor: boolean = false
  public editorGroup: boolean = false
  public editorCheck: boolean = false




  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private fb: FormBuilder
  ) {
    this.forms = fb.group({globalRate: 0})
  }


  generateGroupTree(data?: AgentRateInfo) {
    if(!data) return []

    const filtredGroups: RateGroup[] = Object.values(data.gameGroups).filter(item =>
      !item.service &&
      !item.revenueExclude &&
      (!['tournaments', 'jackpots', 'internet'].includes(item.groupName?.toLowerCase() || ''))
    ).map(mapItem => {
      let rateInfo: GroupRateOptions = {...data.groupRateInfo[mapItem.groupId]}
      rateInfo = {...rateInfo, rate: AgentRateUtils.getEffectiveRate(data, rateInfo)}

      return { data: mapItem, rateInfo }
    })
    this.filtredGroups = filtredGroups

    const map = new Map(filtredGroups.map(el => [el.data.groupId, {...el}]));

    for (let item of map.values()) {
      if (item.data.parentId === 0) {
        continue;
      }

      const parent = map.get(item.data.parentId);
      parent!.children = [...parent?.children || [], item];
    }

    return [...map.values()].filter(item => item.data.parentId === 0)
  }


  addFormGroup(id: number, rateInfo: RateInfo): FormGroup {
    return this.fb.group({
      id: id,
      rate: [{value: rateInfo.rate, disabled: false}, [this.agentRateInfo && rateValidator(this.agentRateInfo, rateInfo)]],
      excluded: [{value: !rateInfo.excluded, disabled: !this.editorCheck}]
    })
  }

  buildFormFromData(data: RateGroup[]) {
    const groups: FormArray = this.fb.array([])
    data.forEach((el) => groups.push(this.addFormGroup(el.data.groupId, {...el.rateInfo})))

    this.forms.addControl('groups', groups)
  }



  ngOnInit(): void {
    this.api.getAgentInfo(this.route.snapshot.params['id'])
      .pipe(spinnerHandlerPipe(this.setLoad.bind(this)))
      .subscribe(agent => {
        this.editor = hasPermission(agent, 'AGENT_EDIT')
        this.editorGroup = hasPermission(agent, 'AGENT_EDIT_GROUP_RATES')
        this.editorCheck = hasPermission(agent, 'AGENT_EXCLUDE_GROUP_RATES')

        this.agentRateInfo = agent.agentRateInfo
        this.groupTree = this.generateGroupTree(agent.agentRateInfo)
        this.buildFormFromData(this.filtredGroups)

        this.forms.patchValue({globalRate: this.agentRateInfo?.rateInfo.rate})
      })
  }

  toEdit(val: boolean) {
    this.isEditing = val
  }

  resetChanges() {
    this.forms.patchValue({globalRate: this.agentRateInfo?.rateInfo.rate})
    this.filtredGroups.forEach(el => {
      const id = el.data.groupId
      const {rate, excluded} = el.rateInfo

      this.forms.patchValue({[id]: {rate, excluded: !excluded}})
    })

    this.toEdit(false)
  }

  updateRate(id: string) {
    let rateVal = this.forms.get(String(id))?.value.rate

    if(this.agentRateInfo && rateVal) {
      let rateInfo = this.agentRateInfo?.groupRateInfo[id]

      if(rateVal === rateInfo.rate) return

      AgentRateUtils.setEffectiveRate(this.agentRateInfo, rateInfo, rateVal)
    }
  }


  onSubmit() {
    console.log(this.forms.valid);
    console.log(this.forms.value);
  }
}
