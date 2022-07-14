import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { BehaviorSubject, catchError, filter, finalize, skip, tap } from 'rxjs';

import { Logger, Log } from '@shared/services/log.service';

import { ApiService } from '@shared/services/api.service';

import { spinnerHandlerPipe } from '@shared/extensions';
import { ActivatedRoute } from '@angular/router';
import { AgentInfo } from '@shared/models/agentInfo';


@Component({
  selector: 'app-agent',
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.scss']
})

export class AgentComponent implements OnInit {
  componentName: string = 'AgentComponent';
  id: string;
  agentInfo?: AgentInfo;

  isLoading = true
  setLoad(val: boolean) {
    this.isLoading = val
  }

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
  ) {
    this.id = this.route.snapshot.params['id'];
    this.api.getAgentInfo(Number.parseInt(this.id))
      .pipe(spinnerHandlerPipe(this.setLoad.bind(this)))
      .subscribe(agent => this.agentInfo = agent)
  }

  ngOnInit(): void {

  }
}