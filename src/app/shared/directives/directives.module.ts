import { NgModule } from '@angular/core';
import { ClickDirective } from './click.directive';
import { SpinnerDirective } from './spinner.directive';

@NgModule({
    declarations: [ClickDirective, SpinnerDirective],
    exports: [ClickDirective, SpinnerDirective]
  })
  export class DirectiveModule { }
