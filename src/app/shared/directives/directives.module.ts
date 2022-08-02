import { NgModule } from '@angular/core';
import { CheckPermission } from './checkPermission.directive';
import { ClickDirective } from './click.directive';
import { SpinnerDirective } from './spinner.directive';

@NgModule({
    declarations: [ClickDirective, SpinnerDirective, CheckPermission],
    exports: [ClickDirective, SpinnerDirective, CheckPermission]
  })
  export class DirectiveModule { }
