import { Pipe, PipeTransform } from '@angular/core';
import { AgentInfo } from '@shared/models/models';
import { MoneyUtils } from '@shared/utils/MoneyUtils';

enum formatTypes {
  money = 0,
  points = 1,
}

@Pipe({
  name: 'formatMoneyPoints'
})
export class FormatMoneyPointsPipe implements PipeTransform {
  transform(value: number, formatType: formatTypes, agentInfo?: AgentInfo): string {
    return this.formatMoneyPoints(formatType, value, agentInfo?.currency, agentInfo?.currencyCode, agentInfo?.rate)
  }

  formatMoneyPoints(formatType: formatTypes, value?: number, currency?: string, currencyCode?: string, rate?: number): string {
    if (formatType === 0) return MoneyUtils.format(value, currency, currencyCode);

    if (rate == undefined || value === undefined) return '';
    if (rate == 0) return '-';

    const moneyValue = MoneyUtils.pointsToMoney(value, rate, currency, currencyCode);
    return MoneyUtils.formatPoints(moneyValue, currency, currencyCode);
  }
}