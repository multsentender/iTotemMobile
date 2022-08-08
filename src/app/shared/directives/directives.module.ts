import { NgModule } from '@angular/core';
import { ClickDirective } from './click.directive';
import { SpinnerDirective } from './spinner.directive';
import { PercentDirective } from './percent.directive';
import { ControlsErrorsDirective } from './controls-errors.directive';
import { FormSubmitDirective } from './form-submit.directive';

@NgModule({
    declarations: [
      ClickDirective,
      SpinnerDirective,
      PercentDirective,
      ControlsErrorsDirective,
      FormSubmitDirective,
    ],
    exports: [
      ClickDirective,
      SpinnerDirective,
      PercentDirective,
      ControlsErrorsDirective,
      FormSubmitDirective,
    ]
  })
  export class DirectiveModule { }
