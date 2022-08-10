import { AgentRateInfo } from "@shared/models/agentRateInfo";
import { RateInfo } from '@shared/models/rateInfo';
import { GameGroup } from '@shared/models/gameGroup';

/**
 * Utils for validation and editing agent rates.
 */
export class AgentRateUtils {

    /**
     * Gets parent RateInfo for specified RateInfo.
     *
     * If rateInfo is subGroup rate info, then it return RateInfo for parent game group.
     * If rateInfo is root game group rate info, then it returns Agent base rate info.
     * If rateInfo is agent base rate, then it returns underfined - no parent.
     *
     * @param agentRateInfo agent rate info
     * @param rateInfo subGroup, group or base rate info
     * @returns group rate info, base rate info or undefined if no parent.
     */
    public static getParentRateInfo(agentRateInfo: AgentRateInfo, rateInfo: RateInfo) : RateInfo | undefined {
        if (rateInfo.gameGroupId == 0) {
            return undefined;
        }
        let group : GameGroup = agentRateInfo.gameGroups[rateInfo.gameGroupId];
        if (group.parentId == 0) {
          return agentRateInfo.rateInfo;
        } else {
          return agentRateInfo.groupRateInfo[group.parentId];
        }
    }

    /**
     * Gets children RateInfo for specified RateInfo.
     *
     * If rateInfo is subGroup rate info, then it returns empty array
     * If rateInfo is root game group rate info, then it returns subGroup rates info.
     * If rateInfo is agent base rate, then it returns root game group rates info.
     *
     * @param agentRateInfo agent rate info
     * @param rateInfo subGroup, group or base rate info
     * @returns list of children rate info
     */
    public static getChildRateInfo(agentRateInfo: AgentRateInfo, rateInfo: RateInfo) : Array<RateInfo> {
        let ret : Array<RateInfo> = new Array<RateInfo>();
        for (let key in agentRateInfo.gameGroups) {
          let subGroup : GameGroup = agentRateInfo.gameGroups[key];
          if (subGroup.parentId == rateInfo.gameGroupId) {
            let childRateInfo : RateInfo = agentRateInfo.groupRateInfo[subGroup.groupId];
            ret.push(childRateInfo);
          }
        }
        return ret;
    }

    /**
     * Gets rate for specified RateInfo or rate for its parent RateInfo,
     * if rate is null.
     * @param agentRateInfo agent rate info
     * @param rateInfo subGroup, group or base rate info
     * @returns value between 0.0 and 1.0
     */
    public static getEffectiveRate(agentRateInfo: AgentRateInfo, rateInfo: RateInfo) : number {
        if (rateInfo.rate == null) {
            let pri : RateInfo | undefined = AgentRateUtils.getParentRateInfo(agentRateInfo, rateInfo);
            if (pri == null)
              return 0.0;
            else
              return AgentRateUtils.getEffectiveRate(agentRateInfo, pri);
        } else {
            return rateInfo.rate;
        }
    }

    /**
     * Set rate for specified RateInfo. This method compares rate with parent RateInfo
     * and set it as null if rates are same.
     * @param agentRateInfo agent rate info
     * @param rateInfo subGroup, group or base rate info
     * @param rate value between 0.0 and 1.0
     */
    public static setEffectiveRate(agentRateInfo: AgentRateInfo, rateInfo: RateInfo, rate?: number) : void {
        let pri : RateInfo | undefined = AgentRateUtils.getParentRateInfo(agentRateInfo, rateInfo);

        if (rate == null) {
           if (pri == null) {
             rate = 0.0;
           }
        } else {
          if (pri != null && AgentRateUtils.isRateEqual(rate, AgentRateUtils.getEffectiveRate(agentRateInfo, pri))) {
            rate = undefined;
          }
        }
        rateInfo.rate = rate;
    }

    /**
     * Safelly compare rate values considering rounding.
     * @param rate1 value between 0.0 and 1.0
     * @param rate2 value between 0.0 and 1.0
     * @returns true if rates are same
     */
    public static isRateEqual(rate1: number, rate2: number) : boolean {
        let r1 : number = Math.round(rate1 * 1000.0);
        let r2 : number = Math.round(rate2 * 1000.0);
        return r1 == r2;
    }

    protected static getEffectiveMinRateParent(agentRateInfo: AgentRateInfo, rateInfo: RateInfo) : number {
        if (rateInfo.minRate == null) {
          let pri : RateInfo | undefined = AgentRateUtils.getParentRateInfo(agentRateInfo, rateInfo);
          if (pri == null)
            return 0.0;
          else
            return AgentRateUtils.getEffectiveMinRateParent(agentRateInfo, pri);
        } else {
          return rateInfo.minRate;
        }
    }

    /**
     * Gets minimal rate value for specified RateInfo
     * @param agentRateInfo agent rate info
     * @param rateInfo subGroup, group or base rate info
     * @returns value between 0.0 and 1.0
     */
    public static getEffectiveMinRate(agentRateInfo: AgentRateInfo, rateInfo: RateInfo) : number {
        let ret : number = AgentRateUtils.getEffectiveMinRateParent(agentRateInfo, rateInfo);
        AgentRateUtils.getChildRateInfo(agentRateInfo, rateInfo).forEach(function (cri: RateInfo) {
            // if rate for child is not set then we should take into consideration its min rate
            if (cri.rate == null) {
                ret = Math.max(ret, AgentRateUtils.getEffectiveMinRate(agentRateInfo, cri));
            }
        });
        return ret;
    }

    protected static getEffectiveMaxRateParent(agentRateInfo: AgentRateInfo, rateInfo: RateInfo) : number {
        if (rateInfo.maxRate == null) {
          let pri : RateInfo | undefined = AgentRateUtils.getParentRateInfo(agentRateInfo, rateInfo);
          if (pri == null)
            return 1.0;
          else
            return AgentRateUtils.getEffectiveMaxRateParent(agentRateInfo, pri);
        } else {
          return rateInfo.maxRate;
        }
    }

    /**
     * Gets maximum rate value for specified RateInfo
     * @param agentRateInfo agent rate info
     * @param rateInfo subGroup, group or base rate info
     * @returns value between 0.0 and 1.0
     */
    public static getEffectiveMaxRate(agentRateInfo: AgentRateInfo, rateInfo: RateInfo) : number {
        let ret : number = AgentRateUtils.getEffectiveMaxRateParent(agentRateInfo, rateInfo);
        AgentRateUtils.getChildRateInfo(agentRateInfo, rateInfo).forEach(function (cri: RateInfo) {
          // if rate for child is not set then we should take into consideration its max rate
          if (cri.rate == null) {
            ret = Math.min(ret, AgentRateUtils.getEffectiveMaxRate(agentRateInfo, cri));
          }
        });
        return ret;
    }

    /**
     * Field validator example.
     *
     * @param agentRateInfo agent rate info
     * @param rateInfo subGroup, group or base rate info
     * @param fieldValue current field value
     * @returns error message or undefined in case of valid rate
     */
    public static validateRate(agentRateInfo: AgentRateInfo, rateInfo: RateInfo, fieldValue?: number) : String | undefined {
        AgentRateUtils.setEffectiveRate(agentRateInfo, rateInfo, fieldValue);
        let effectiveRate : number = AgentRateUtils.getEffectiveRate(agentRateInfo, rateInfo);
        let effectiveMinRate : number = AgentRateUtils.getEffectiveMinRate(agentRateInfo, rateInfo);
        let effectiveMaxRate : number = AgentRateUtils.getEffectiveMaxRate(agentRateInfo, rateInfo);
        if (effectiveRate < effectiveMinRate) {
          return AgentRateUtils.rateMasterAgentRestrictionMsg(AgentRateUtils.formateRate(effectiveMinRate));
        } else if (effectiveRate > effectiveMaxRate) {
          return AgentRateUtils.rateSubAgentRestrictionMsg(AgentRateUtils.formateRate(effectiveMaxRate));
        }
        return undefined;
    }

    /**
     * Field onchange example. Checks if field values must be shown in gray color
     * due to same parent and self rate.
     *
     * @param agentRateInfo agent rate info
     * @param rateInfo subGroup, group or base rate info
     * @param fieldValue current field value
     * @returns true if rate equals to parent and must be shown by gray color, false otherwise.
     */
    public static checkRateForDefault(agentRateInfo: AgentRateInfo, rateInfo: RateInfo, fieldValue?: number) : boolean {
        AgentRateUtils.setEffectiveRate(agentRateInfo, rateInfo, fieldValue);
        return rateInfo.rate == null;
    }


    // TODO: replace this method by decimal formatter used in UI
    protected static formateRate(rate: number) : string {
        return (rate * 100.0).toFixed(1);
    }

    // TODO: remove this method and use localization
    protected static rateMasterAgentRestrictionMsg(formattedRate: string) {
        return "Due to master agent restriction, rate can not be lower than: " + formattedRate + "%";
    }

    // TODO: remove this method and use localization
    protected static rateSubAgentRestrictionMsg(formattedRate: string) {
        return "Due to sub-agents restriction, rate can not be greater than: " + formattedRate + "%";
    }



}
