import { Component, Input, OnInit } from '@angular/core';
import { AgentInfo, BasicTreeNode } from '@shared/models/models';
import { PathService } from '@shared/services/path.service'
import { hasPermission } from '@shared/utils/SecurityUtils';
import { MoneyUtils } from '@shared/utils/MoneyUtils';
import {  } from '@shared/models/basicTreeNode';

@Component({
  selector: 'app-agent-graph',
  templateUrl: './agent-graph.component.html',
  styleUrls: ['./agent-graph.component.scss']
})
export class GraphComponent implements OnInit {
  multi: any[] = [
    {
      "name": "GraphName",
      "series": [
        {
          "name": "1990",
          "value": 62000000
        },
        {
          "name": "2010",
          "value": 73000000
        },
        {
          "name": "2011",
          "value": 89400000
        }
      ]
    },]
    
    balance: string = '';

    @Input() agentInfo?: AgentInfo
    @Input() basicTreeNode?: BasicTreeNode
  // view: any[] = [700, 300];

  // // options
  // legend: boolean = true;
  // showLabels: boolean = true;
  // animations: boolean = true;
  // xAxis: boolean = true;
  // yAxis: boolean = true;
  // showYAxisLabel: boolean = true;
  // showXAxisLabel: boolean = true;
  // xAxisLabel: string = 'Year';
  // yAxisLabel: string = 'Population';
  // timeline: boolean = true;

  // colorScheme = {
  //   domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  // };

  constructor(
    public pathService: PathService,
  ) { }

  settingsClick(): void {
    console.log('settings')
  }

  ngOnInit(): void {
    if (hasPermission(this.basicTreeNode || {}, 'AGENT_VIEW_OVERDRAFT'))
      this.balance = MoneyUtils.format(this.agentInfo!.balance || 0 + (this.agentInfo!.overdraft || 0), this.agentInfo?.currency, this.agentInfo?.currencyCode);
    else
      MoneyUtils.format(this.agentInfo?.balance, this.agentInfo?.currency, this.agentInfo?.currencyCode);
  }


  // onSelect(event: Event) {
  //   console.log(event);
  // }

}
