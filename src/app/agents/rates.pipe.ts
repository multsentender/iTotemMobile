import { Pipe, PipeTransform } from '@angular/core';
import { AgentTreeNode } from '@shared/models/models';

@Pipe({
  name: 'rates'
})
export class RatesPipe implements PipeTransform {
  /**
   * 
   * @param param0 - agent data with minRate? and maxRate?
   * @param percent - convert to percent or remain
   * @param roundTo - round to x symbol after dot (undefined to do not round)
   * @returns 
   */
  transform({ minRate, maxRate }: AgentTreeNode, percent: boolean = false, roundTo?: number): string {

    const min: number | undefined = this.format(minRate, percent, roundTo)
    const max: number | undefined = this.format(maxRate, percent, roundTo)

    let res: string = ''
    if (min) {
      res += min
      if (max && max !== min) res += '-' + max
    } else {
      res += max
    }
    return percent ? (res + '%') : res
  }

  format(num?: number, percent: boolean = false, roundTo?: number): number | undefined {
    if (num == undefined) return
    let res = percent ? num * 100 : num
    if (roundTo != undefined) res = this.round(res, roundTo)
    return res
  }

  round(num: number, roundTo: number) {
    roundTo = Math.pow(10, roundTo)
    return Math.round(num * roundTo) / roundTo
  }

}