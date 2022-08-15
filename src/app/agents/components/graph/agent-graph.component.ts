import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  componentName = "GraphComponent";
  formatType: number = 0;

  public yAxisTickFormattingFn = this.yAxisTickFormatting.bind(this);
  multi: graphLine[] = [
    {
      "name": this.translate.instant('BALANCE'),
      "series": []
    }]
  yAxisTicks: number[] = [];

  balance?: number;
  agentBlocked: boolean = false;
  overdraft?: number;
  expiresIn?: number;
  show = {
    overdraftSettings: false,
    topUp: false,
  }
  min?: number;
  colorScheme = {
    domain: ['var(--special-accent)']
  };

  @Input() agentInfo?: AgentInfo
  @Output() formatTypeChange: EventEmitter<number> = new EventEmitter();

  constructor(
    public pathService: PathService,
    private translate: TranslateService,
  ) {
  }

  getBalanceMode() {
    if (this.agentInfo?.rate && this.agentInfo.rate > 0){
      const mode = localStorage.getItem('agentGraph');
      this.formatType = (mode === 'points') ? 1 : 0;
    }
  }

  ngOnInit(): void {
    if (!this.agentInfo) return
    this.getBalanceMode()
    this.getBalance();

    if (this.agentInfo.balance) this.getBalanceGraph();
    this.getExpiration();
    this.getOverdraft();

    if (hasPermission(this.agentInfo || {}, 'AGENT_CHANGE_OVERDRAFT')) this.show.overdraftSettings = true;
    if (hasPermission(this.agentInfo || {}, 'AGENT_TRANSFER_MONEY')) this.show.topUp = true;
  }


  getExpiration() {
    if (this.agentInfo?.overdraftExpirationDate && this.agentInfo.overdraft != 0
      && hasPermission(this.agentInfo || {}, 'AGENT_VIEW_OVERDRAFT'))
      this.expiresIn = this.agentInfo.overdraftExpirationDate
  }

  getOverdraft() {
    if (this.agentInfo?.overdraft != 0 && hasPermission(this.agentInfo || {}, 'AGENT_VIEW_OVERDRAFT'))
      this.overdraft = this.agentInfo!.overdraft//this.formatMoneyPoints(this.agentInfo!.overdraft!, this.agentInfo?.currency, this.agentInfo?.currencyCode, this.agentInfo?.rate);
  }

  getBalance() {

    if (hasPermission(this.agentInfo || {}, 'AGENT_VIEW_OVERDRAFT'))
      this.balance = (this.agentInfo?.balance || 0) + (this.agentInfo?.overdraft || 0)
    else
      this.balance = this.agentInfo?.balance

    if (this.agentInfo?.blocked)
      this.agentBlocked = true;
  }

  getBalanceGraph() {
    this.multi = [{
      "name": this.translate.instant('BALANCE'),
      "series": []
    }]

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
      this.yAxisTicks = [0, this.agentInfo?.balance!]// -(this.agentInfo?.overdraft || 0),
      this.min = Math.min(...graphValues, (0 - (this.agentInfo?.overdraft || 0)))
    } else {
      this.yAxisTicks = [0, Math.max(...graphValues), Math.min(...graphValues), this.agentInfo?.balance!]
      this.min = Math.min(...graphValues, this.agentInfo?.balance!, 0)
    }
  }

  formatMoneyPoints(value?: number, currency?: string, currencyCode?: string, rate?: number): string {
    if (this.formatType === 0) return MoneyUtils.format(value, currency, currencyCode);
    if (rate == undefined || value === undefined) return '';
    try {
      const moneyValue = MoneyUtils.pointsToMoney(value, rate, currency, currencyCode);
      return MoneyUtils.formatPoints(moneyValue, currency, currencyCode);
    } catch (e) {
      return '-'
    }
  }

  yAxisTickFormatting(value: number) {
    this.formatMoneyPoints(value, this.agentInfo?.currency, this.agentInfo?.currencyCode, this.agentInfo?.rate);
    return (value == 0) ? 0 : this.formatMoneyPoints(value, this.agentInfo?.currency, this.agentInfo?.currencyCode, this.agentInfo?.rate);
  }

  xAxisTickFormatting(value: number) {
    //to hide ticks and remain grid lines
    return ''
  }

  tabChanged(e: MatTabChangeEvent) {
    localStorage.setItem('agentGraph', (e.index === 0) ? 'money' : 'points');
    this.formatTypeChange.emit(this.formatType)

    //to update ticks format
    this.multi = [...this.multi]
    //this.getBalanceGraph()
  }

}
