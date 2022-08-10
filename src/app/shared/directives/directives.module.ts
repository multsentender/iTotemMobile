import { NgModule } from '@angular/core';
import { ClickDirective } from './click.directive';
import { SpinnerDirective } from './spinner.directive';
import { PercentDirective } from './percent.directive';
import { ControlErrorDirective } from './controls/control-error.directive';
import { FormSubmitDirective } from './controls/form-submit.directive';
import { ControlErrorContainerDirective } from './controls/control-error-container.directive';
import { ControlDisableDirective } from './controls/control-disable.directive';

@NgModule({
    declarations: [
      ClickDirective,
      SpinnerDirective,
      PercentDirective,
      ControlErrorDirective,
      FormSubmitDirective,
      ControlErrorContainerDirective,
      ControlDisableDirective,
    ],
    exports: [
      ClickDirective,
      SpinnerDirective,
      PercentDirective,
      ControlErrorDirective,
      FormSubmitDirective,
      ControlErrorContainerDirective,
      ControlDisableDirective,
    ]
  })
  export class DirectiveModule { }
