import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AgentTreeNode } from '@shared/models/agentTreeNode';

import { ApiService } from '@shared/services/api.service';
import { MessageService } from '@shared/services/message.service';

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

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private route: ActivatedRoute,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.route.data.pipe(first())
      .subscribe(val => this.isSubAgent = val.isSubAgent || false)
    this.activatedRoute.paramMap
      .subscribe(() => this.agent.next(window.history.state.agent || {}))

    this.agent.subscribe(val => {
      if(!this.isSubAgent) this.agentEditForm.patchValue({
        label: val.label,
        rate: val.rate
      })
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

  // TODO Исправить валидатор, добавить errorMessage
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
      this.agentEditForm.get('percent')?.addValidators(
        Validators.min(val.rateInfo?.minRate || 0)
      )
    })
  }


  editAgent() {
    const updateAgent: AgentTreeNode = {
      ...this.agent.value,
      ...this.agentEditForm.value
    }

    this.api.updateAgent(updateAgent)
    .subscribe(() => {
      this.messageService.showSuccess()
    })
  }

  createSubAgent() {
    const subAgent: AgentTreeNode = {
      _c: "AgentTreeNode",
      ...this.agentEditForm.value
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
