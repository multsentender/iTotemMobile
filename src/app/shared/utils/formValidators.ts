import { FormControl, FormGroup, ValidationErrors } from "@angular/forms";
import { AgentRateInfo, RateInfo } from "@shared/models/models";
import { AgentRateUtils } from "./AgentRateUtils";

export const atLeastOneValidator = (keys: string[]) => {
  return (group: FormGroup) => {
    const { controls } = group;
    return keys.some(key => controls[key] && !!controls[key].value)
      ? null
      : { atLeastOne: 'error' };
  };
};

export const checkConfirmPassword = (group: FormGroup) => {
    return (group.controls['password'].value === group.controls['passwordConf'].value) ? null :
	{ passwordMatchError: 'passwords_not_equal' } as ValidationErrors
}

export const rateValidator = (agentRateInfo: AgentRateInfo, rateInfo: RateInfo) => {
  return (control: FormControl) => {
    const rate = control.value / 100;
    const message = AgentRateUtils.validateRate(agentRateInfo, rateInfo, rate)
    return message ? { rate: message} as ValidationErrors : null
  }
}
