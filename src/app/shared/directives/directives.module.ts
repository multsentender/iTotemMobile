import { NgModule } from '@angular/core';
import { ClickDirective } from './click.directive';
import { SpinnerDirective } from './spinner.directive';
import { PercentDirective } from './percent.directive';

@NgModule({
    declarations: [ClickDirective, SpinnerDirective, PercentDirective],
    exports: [ClickDirective, SpinnerDirective, PercentDirective]
  })
  export class DirectiveModule { }
