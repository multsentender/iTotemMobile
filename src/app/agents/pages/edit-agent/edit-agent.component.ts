import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HeaderMode } from '@shared/components/navbar/navbar.component';
import { AgentTreeNode } from '@shared/models/agentTreeNode';

import { ApiService } from '@shared/services/api.service';
import { MessageService } from '@shared/services/message.service';
import { FormValidator } from '@shared/utils/formValidators';

import { BehaviorSubject, first, tap } from 'rxjs';

@Component({
  selector: 'app-edit-agent',
  templateUrl: './edit-agent.component.html',
  styleUrls: ['./edit-agent.component.scss']
})
export class EditAgentComponent implements OnInit {
  public agentEditForm: FormGroup = this.fb.group({
    label: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(128)]],
    rate: ['', Validators.required]
  })

  private isSubAgent: boolean = false;
  private agent = new BehaviorSubject<AgentTreeNode>({});
  public disableBtn: boolean = true
  public formValid: boolean = false;

  public label: string = 'NEW_AGENT'
  public HeaderMode = HeaderMode

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.route.data.pipe(first())
      .subscribe(val => this.isSubAgent = val.isSubAgent || false)

    this.agent.subscribe(val => {
      if(!this.isSubAgent) {
        this.agentEditForm.patchValue({
          label: val.label,
          rate: val.rate
        })

        this.label = `AGENT ${val.label}`
      }
    })



    this.agentEditForm.valueChanges.subscribe(formControls => {
      let valid = this.agentEditForm.valid

      if(!this.isSubAgent) {
        const changed = (Object.keys(formControls) as (keyof typeof this.agent.value)[])
        .some((key) => this.agent.value[key] !== formControls[key])

        this.formValid = valid && changed
        return
      }
      this.formValid = valid
    })
  }

  // TODO добавить errorMessage
  ngOnInit(): void {
    const id = this.route.snapshot.params['id']

    if(Object.entries(this.agent.value).length <= 0)
      this.api.getAgentInfo(id)
      .subscribe(val => this.agent.next(val))

    this.api.getNewAgentRateInfo(id)
    .pipe(tap({
      error: () => this.disableBtn = true,
      next: () => this.disableBtn = false
    }))
    .subscribe(val => {
      this.agentEditForm.get('rate')?.addValidators(
        FormValidator.rateValidator(val, val.rateInfo) as ValidatorFn
      )
    })
  }


  editAgent() {
    const updateAgent: AgentTreeNode = {
      ...this.agent.value,
      ...this.agentEditForm.value,
      rate: this.agentEditForm.get('rate')?.value / 100
    }

    this.api.updateAgent(updateAgent)
    .subscribe(() => {
      this.messageService.showSuccess()
    })
  }

  createSubAgent() {
    const subAgent: AgentTreeNode = {
      _c: "AgentTreeNode",
      ...this.agentEditForm.value,
      rate: this.agentEditForm.get('rate')?.value / 100
    }

    this.api.createAgent(this.agent.value, subAgent)
    .subscribe(() => {
      this.messageService.showSuccess()
    })
  }

  confirm() {
    this.isSubAgent ? this.createSubAgent() : this.editAgent()
  }
}
