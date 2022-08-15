import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';
import { FormArray, FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';

import { ModeSlideBtn } from '@shared/components/slide-btn/slide-btn.component';
import { HeaderMode } from '@shared/components/header/header.component';

import { ApiService } from '@shared/services/api.service';
import { MessageService } from '@shared/services/message.service';

import { AgentTreeNode, RateInfo, AgentRateInfo, GameGroup } from '@shared/models/models';
import { spinnerHandlerPipe } from '@shared/extensions';

import { hasPermission } from '@shared/utils/SecurityUtils';
import { AgentRateUtils } from '@shared/utils/AgentRateUtils';
import { FormValidator } from '@shared/utils/formValidators';
import { bindContext } from '@shared/decorators/bind-context-decorator';




interface GroupRateOptions extends RateInfo {
  defaultRate?: boolean
}
export interface RateGroup {
  data: GameGroup,
  rateInfo: GroupRateOptions,
  children?: RateGroup[]
}
export interface IPermitions {
  editor: boolean,
  editorGroup: boolean,
  editorCheck: boolean
}
interface IGroupFormValue {
  id?: number,
  rate?: number,
  excluded?: boolean
}



@Component({
  selector: 'app-rates',
  templateUrl: './rates.component.html',
  styleUrls: ['./rates.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RatesComponent implements OnInit {
  public isEditing = false
  isLoading = new BehaviorSubject<boolean>(true)
  setLoad(val: boolean) {
    this.isLoading.next(val)
  }

  public ModeSlideBtn = ModeSlideBtn;
  public forms: FormGroup;

  private agent?: AgentTreeNode;
  private filtredGroups: RateGroup[] = [];
  public groupTree: RateGroup[] = [];

  public permitions: IPermitions = {
    editor: false,
    editorGroup: false,
    editorCheck: false
  }


  get agentRateInfo(): AgentRateInfo | undefined {
    return this.agent?.agentRateInfo
  }

  get headerMode(): HeaderMode {
    return this.isEditing ? HeaderMode.modal : HeaderMode.default
  }


  constructor(
    private activeRouter: ActivatedRoute,
    private api: ApiService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) { this.forms = fb.group({globalRate: 0}) }

  getfilterGroups(data: AgentRateInfo) {
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
  }

  generateGroupTree(data?: AgentRateInfo) {
    if(!data) return []

    this.getfilterGroups(data)

    const map = new Map(this.filtredGroups.map(el => [el.data.groupId, {...el}]));
    for (let item of map.values()) {
      // item.rateInfo.defaultRate = AgentRateUtils.checkRateForDefault(data, {...item.rateInfo})
      if (item.data.parentId === 0) {
        continue;
      }

      const parent = map.get(item.data.parentId);
      parent!.children = [...parent?.children || [], item];
    }

    return [...map.values()].filter(item => item.data.parentId === 0)
  }


  // Create group's FormGroup
  addFormGroup(id: number, rateInfo: RateInfo): FormGroup {
    return this.fb.group({
      id: id,
      rate: [rateInfo.rate, [this.agentRateInfo && FormValidator.rateValidator(this.agentRateInfo, rateInfo)]],
      excluded: !rateInfo.excluded
    })
  }

  buildFormFromData(data: RateGroup[]) {
    const groups: FormArray = this.fb.array([])
    data.forEach((el) => groups.push(this.addFormGroup(el.data.groupId, {...el.rateInfo})))

    this.forms.addControl('groups', groups)
    this.forms.patchValue({globalRate: this.agentRateInfo?.rateInfo.rate})
    this.forms.get('globalRate')?.addValidators(FormValidator.rateValidator(this.agentRateInfo!, this.agentRateInfo!.rateInfo) as ValidatorFn)
  }



  ngOnInit(): void {
    this.api.getAgentInfo(this.activeRouter.snapshot.params['id'])
      .pipe(spinnerHandlerPipe(this.setLoad.bind(this)))
      .subscribe(agent => {
        this.permitions = {
          editor: hasPermission(agent, 'AGENT_EDIT'),
          editorGroup: hasPermission(agent, 'AGENT_EDIT_GROUP_RATES'),
          editorCheck: hasPermission(agent, 'AGENT_EXCLUDE_GROUP_RATES')
        }

        this.agent = agent
        this.groupTree = this.generateGroupTree(agent.agentRateInfo)

        this.buildFormFromData(this.filtredGroups)
      })
  }



  toEdit(val: boolean) {
    this.isEditing = val
  }


  updateRate(id: string) {
    let rateVal = this.forms.get(String(id))?.value.rate

    if(this.agentRateInfo && rateVal) {
      let rateInfo = this.agentRateInfo?.groupRateInfo[id]

      if(rateVal === rateInfo.rate) return

      AgentRateUtils.setEffectiveRate(this.agentRateInfo, rateInfo, rateVal)
    }
  }


  @bindContext
  resetChanges() {
    console.log('res', this.isEditing);
    const groups = this.filtredGroups.map(el => (
      {
        id: el.data.groupId,
        rate: el.rateInfo.rate,
        excluded: !el.rateInfo.excluded
      }
    ))

    this.forms.patchValue({globalRate: this.agentRateInfo?.rateInfo.rate, groups})
    this.toEdit(false)
  }

  @bindContext
  onSubmit() {
    if(this.forms.valid && this.agent) {
      const {globalRate, groups} = this.forms.controls
      const groupInfo = this.agentRateInfo?.groupRateInfo

      groups.value.forEach((el: IGroupFormValue) => {
        if(!el.id) return
        const id = el.id
        delete el['id']

        if(el.rate) {
          AgentRateUtils.setEffectiveRate(this.agentRateInfo!, groupInfo![id], el.rate)
          delete el['rate']
        }
        if(el.excluded != null) el.excluded = !el.excluded
        return groupInfo![id] = {...groupInfo![id], ...el}
      });

      AgentRateUtils.setEffectiveRate(this.agentRateInfo!, this.agentRateInfo!.rateInfo, globalRate.value)

      this.api.updateAgentRateInfo(this.agent)
        .pipe(
          spinnerHandlerPipe(this.setLoad.bind(this)),
          tap(() => this.messageService.showSuccess())
        )
        .subscribe((data: AgentTreeNode) => {
          if(data.agentRateInfo) {
            this.getfilterGroups(data.agentRateInfo)
            this.buildFormFromData(this.filtredGroups)
          }
          this.isEditing = false
        })
    }
  }
}
