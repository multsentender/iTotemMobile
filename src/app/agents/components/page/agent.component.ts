import { Component, OnInit } from '@angular/core';

import { Logger, Log } from '@shared/services/log.service';

import { ApiService } from '@shared/services/api.service';

import { spinnerHandlerPipe } from '@shared/extensions';
import { ActivatedRoute } from '@angular/router';
import { AgentInfo } from '@shared/models/agentInfo';
import { MoneyUtils } from '@shared/utils/MoneyUtils';
import { AgentRateInfo } from '@shared/models/agentRateInfo';
import { RateInfo } from '@shared/models/rateInfo';
import { TranslateService } from '@ngx-translate/core';
import { hasPermission } from '@shared/utils/SecurityUtils';
import { HeaderMode } from '@shared/components/header/header.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-agent',
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.scss']
})

export class AgentComponent implements OnInit {
  componentName: string = 'AgentComponent';
  id: string;
  agentInfo?: AgentInfo;
  formatType: number = 0;

  balance?: number;
  balanceFail: boolean = false;
  dealerShare: string = "";
  agentRate: string = "";
  show = {
    loginComponent: false,
  }

  isLoading = true;
  setLoad(val: boolean) {
    this.isLoading = val
  }

  public HeaderMode = HeaderMode

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private translateService: TranslateService,
    private location: Location,
  ) {
    this.id = this.route.snapshot.params['id'];
  }

  getAgentData() {
    this.resetInfo();
    this.api.getAgentInfo(Number.parseInt(this.id))
      .pipe(spinnerHandlerPipe(this.setLoad.bind(this)))
      .subscribe(agentInfo => {
        this.agentInfo = agentInfo

        if (!this.agentInfo?.dealer && this.agentInfo?.permissions?.indexOf('AGENT_VIEW_SERVICE_BALANCE') != -1 && !!this.agentInfo?.walletNumber) {
          this.getServiceBalance(agentInfo)
        }

        if (!!this.agentInfo?.dealer && this.agentInfo?.permissions?.indexOf('AGENT_VIEW_SERVICE_BALANCE') != -1 && this.agentInfo.dealerBalance != null)
          this.getDealerShare(this.agentInfo)

        if (this.agentInfo?.agentRateInfo)
          this.getAgentRate(this.agentInfo?.agentRateInfo)

        if (hasPermission(this.agentInfo, 'AGENT_ACL_VIEW')) this.show.loginComponent = true;
      }, error => {
        if (error.error?.error === true) this.location.back()
    })
  }

  resetInfo(){
    this.agentInfo = undefined;
    this.formatType = 0;

    this.balance = undefined;
    this.balanceFail = false;
    this.dealerShare = "";
    this.agentRate = "";
    this.show.loginComponent = false;
  }

  getDealerShare(agent: AgentInfo) {
    this.dealerShare = MoneyUtils.format(agent.dealerBalance, agent.currency, agent.currencyCode);
  }

  getServiceBalance(agent: AgentInfo) {
    this.api.getAgentServiceBalance(agent).subscribe(serviceBalance => {
      this.balance = serviceBalance?.cashable//MoneyUtils.format(serviceBalance?.cashable, this.agentInfo?.currency, this.agentInfo?.currencyCode);
      this.balanceFail = false;
    }, err => {
      this.balanceFail = true;
    })
  }


  getAgentRate(agentRateInfo: AgentRateInfo) {
    //rateInfo - базовая ставка агента
    //groupRateInfo - Map отображает gameGroupId на ставку агента для группы игр
    let rateInfo: RateInfo[] = Object.values(agentRateInfo.groupRateInfo || {}) || []
    if (agentRateInfo.rateInfo) rateInfo.push(agentRateInfo.rateInfo)

    let max = rateInfo.reduce((prev, current) => (current?.rate == null) ? prev : (Number(prev.rate) > current.rate ? prev : current)).rate//((Number(prev.rate)) > current.rate) ? prev: current : current ).rate
    max = this.formatPercent(max)

    let min = rateInfo.reduce((prev, current) =>
      (current?.rate == null) ? prev : (Number(prev.rate) < current?.rate ? prev : current)
    ).rate
    min = this.formatPercent(min)

    if (min == null) this.agentRate = (max == null) ? '' : max + '%'
    else if (max == null) this.agentRate = min + '%'
    else this.agentRate = (min === max) ? `${min}%` : `${min}-${max}%`
  }

  formatPercent(num?: number) {
    if (num === undefined) return
    return Math.round(num * 10000) / 100
  }

  ngOnInit(): void {
    this.route.params.subscribe(
      params => {
        this.id = params['id'];
        this.getAgentData();
      }
    );
  }

  formatTypeChange(formatType: number) {
    this.formatType = formatType;
  }
}
