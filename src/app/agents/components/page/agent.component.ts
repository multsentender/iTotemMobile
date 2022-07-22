import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, catchError, filter, finalize, skip, tap } from 'rxjs';

import { Logger, Log } from '@shared/services/log.service';

import { ApiService } from '@shared/services/api.service';

import { spinnerHandlerPipe } from '@shared/extensions';
import { ActivatedRoute } from '@angular/router';
import { AgentInfo } from '@shared/models/agentInfo';
import { Money } from '@shared/models/money';
import { MoneyUtils } from '@shared/utils/MoneyUtils';
import { AgentRateInfo } from '@shared/models/agentRateInfo';
import { RateInfo } from '@shared/models/rateInfo';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-agent',
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.scss']
})

export class AgentComponent implements OnInit {
  componentName: string = 'AgentComponent';
  id: string;
  agentInfo?: AgentInfo;
  serviceBalance?: Money;
  balance: string = '';
  balanceFail: boolean = false;
  dealerShare: string = "";
  agentRate: string = "";

  isLoading = true;
  setLoad(val: boolean) {
    this.isLoading = val
  }

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private translateService: TranslateService,
  ) {
    this.id = this.route.snapshot.params['id'];
    this.balance = this.translateService.instant('LOADING_');
    this.api.getAgentInfo(Number.parseInt(this.id))
      .pipe(spinnerHandlerPipe(this.setLoad.bind(this)))
      .subscribe(agentInfo => {
        this.agentInfo = agentInfo

        if (!this.agentInfo?.dealer && this.agentInfo?.permissions?.indexOf('AGENT_VIEW_SERVICE_BALANCE') != -1) {
          this.getServiceBalance(agentInfo)
        }

        if (!!this.agentInfo?.dealer && this.agentInfo?.permissions?.indexOf('AGENT_VIEW_SERVICE_BALANCE') != -1 && this.agentInfo.dealerBalance != null)
          this.getDealerShare(this.agentInfo)

        if (this.agentInfo?.agentRateInfo)
          this.getAgentRate(this.agentInfo?.agentRateInfo)

      })
  }

  getDealerShare(agent: AgentInfo) {
    this.dealerShare = MoneyUtils.format(agent.dealerBalance, agent.currency, agent.currencyCode);
  }

  getServiceBalance(agent: AgentInfo) {
    this.api.getAgentServiceBalance(agent).subscribe(serviceBalance => {
      this.serviceBalance = serviceBalance;
      this.balance = MoneyUtils.format(serviceBalance?.cashable, this.agentInfo?.currency, this.agentInfo?.currencyCode);
      this.balanceFail = false;
    }, err => {
      this.balance = this.translateService.instant('FAILURE');
      this.balanceFail = true;
    })
  }


  getAgentRate(agentRateInfo: AgentRateInfo) {
    //rateInfo - базовая ставка агента
    //groupRateInfo - Map отображает gameGroupId на ставку агента для группы игр
    let rateInfo: RateInfo[] = Object.values(agentRateInfo.groupRateInfo || {}) || []
    if (agentRateInfo.rateInfo) rateInfo.push(agentRateInfo.rateInfo)

    const max = rateInfo.reduce((prev, current) => (current?.rate == null) ? prev : (Number(prev.rate) > current.rate ? prev : current)).rate//((Number(prev.rate)) > current.rate) ? prev: current : current ).rate
    const min = rateInfo.reduce((prev, current) =>
      (current?.rate == null) ? prev : (Number(prev.rate) < current?.rate ? prev : current)
    ).rate

    if (min == null) this.agentRate = (max == null) ? '' : max + '%'
    else if (max == null) this.agentRate = min + '%'
    else this.agentRate = (min === max) ? `${min}%` : `${min}-${max}%`
  }

  ngOnInit(): void {

  }


}