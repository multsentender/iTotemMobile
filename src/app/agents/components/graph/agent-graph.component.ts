import { Component, Input, OnInit } from '@angular/core';
import { AclPermission, AgentInfo } from '@shared/models/models';
import { PathService } from '@shared/services/path.service'
import { hasPermission } from '@shared/utils/SecurityUtils';
import { MoneyUtils } from '@shared/utils/MoneyUtils';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { TranslateService } from '@ngx-translate/core';

interface graphLine {
  name: string,
  series: graphDot[]
}
interface graphDot {
  name: Date,
  value: number
}

@Component({
  selector: 'app-agent-graph',
  templateUrl: './agent-graph.component.html',
  styleUrls: ['./agent-graph.component.scss']
})
export class GraphComponent implements OnInit {
  public yAxisTickFormattingFn = this.yAxisTickFormatting.bind(this);
  multi: graphLine[] = [
    {
      "name": this.translate.instant('BALANCE'),
      "series": []
    }]
  yAxisTicks: number[] = [];

  balance: string = '';
  agentBlocked: boolean = false;
  overdraft: string = '';
  expiresIn: string = '';
  show = {
    overdraftSettings: false,
    topUp: false,
  }
  min?: number;
  colorScheme = {
    domain: ['var(--special-accent)']
  };

  @Input() agentInfo?: AgentInfo

  constructor(
    public pathService: PathService,
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.getBalance();

    this.getBalanceGraph();

    if (this.agentInfo?.overdraftExpirationDate && this.agentInfo.overdraft != 0
      && hasPermission(this.agentInfo || {}, 'AGENT_VIEW_OVERDRAFT'))
      this.expiresIn = MoneyUtils.format(this.agentInfo.overdraftExpirationDate, this.agentInfo?.currency, this.agentInfo?.currencyCode);

    if (this.agentInfo?.overdraft != 0 && hasPermission(this.agentInfo || {}, 'AGENT_VIEW_OVERDRAFT'))
      this.overdraft = MoneyUtils.format(this.agentInfo!.overdraft, this.agentInfo?.currency, this.agentInfo?.currencyCode);

    if (hasPermission(this.agentInfo || {}, 'AGENT_CHANGE_OVERDRAFT')) this.show.overdraftSettings = true;
    if (hasPermission(this.agentInfo || {}, 'AGENT_TRANSFER_MONEY')) this.show.topUp = true;
  }

  getBalance() {
    if (hasPermission(this.agentInfo || {}, 'AGENT_VIEW_OVERDRAFT'))
      this.balance = MoneyUtils.format(this.agentInfo!.balance || 0 + (this.agentInfo!.overdraft || 0), this.agentInfo?.currency, this.agentInfo?.currencyCode);
    else
      this.balance = MoneyUtils.format(this.agentInfo?.balance, this.agentInfo?.currency, this.agentInfo?.currencyCode);

    if (this.agentInfo?.blocked)
      this.agentBlocked = true;
  }

  getBalanceGraph() {
    //random graph data generating
    let date = new Date();
    date.setDate(date.getDate() - 7)
    for (let i = 6; i > 0; i--) {
      this.multi[0].series.push({
        name: new Date(date.setDate(date.getDate() + 1)),
        value: Math.floor(Math.random() * (Math.abs(this.agentInfo?.balance || 500)) * 2)
      })
    }
    this.multi[0].series.push({
      name: new Date(),
      value: this.agentInfo?.balance!
    });

    //get y axis ticks and min border
    const graphValues = this.multi[0].series.map((item: graphDot) => item.value)
    if (hasPermission(this.agentInfo || {}, 'AGENT_VIEW_OVERDRAFT')) {
      this.yAxisTicks = [0, -(this.agentInfo?.overdraft || 0)]//, this.agentInfo?.balance!
      this.min = Math.min(...graphValues, -(this.agentInfo?.overdraft || 0))
    } else {
      this.yAxisTicks = [0, Math.max(...graphValues), Math.min(...graphValues)]
    }
  }

  yAxisTickFormatting(value: number) {
    return (value == 0) ? 0 : MoneyUtils.format(value, this.agentInfo?.currency, this.agentInfo?.currencyCode);
  }


  xAxisTickFormatting(value: number) {
    //to hide ticks and remain grid lines
    return ''
  }

  tabChanged(e: MatTabChangeEvent) {
    localStorage.setItem('agentGraph', (e.index === 0) ? 'money' : 'points');
  }
}
