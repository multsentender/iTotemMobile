import { FormGroup, ValidationErrors } from "@angular/forms";

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
