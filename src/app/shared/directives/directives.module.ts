import { NgModule } from '@angular/core';
import { ClickDirective } from './click.directive';

@NgModule({
    declarations: [ClickDirective],
    exports: [ClickDirective]
  })
  export class DirectiveModule { }