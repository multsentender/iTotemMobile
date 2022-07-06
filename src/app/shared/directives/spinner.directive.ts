import { Directive, TemplateRef, ViewContainerRef, ComponentFactoryResolver, Input } from '@angular/core';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';

@Directive({
  selector: '[appSpinner]'
})
export class SpinnerDirective {
  spinner: SpinnerComponent | null = null;
  isSpinning: boolean | null = null

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ){}

  @Input() set appSpinner(condition: boolean) {
    if (!!condition !== this.isSpinning) {
      this.spinner = null;
      this.viewContainer.clear();
      this.isSpinning = condition;
      if (!condition) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else if (condition) {
        this.addSpinner();
      }
    }
  }


  private addSpinner() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(SpinnerComponent);
    const { instance } = this.viewContainer.createComponent<SpinnerComponent>(componentFactory);
    this.spinner = instance;
  }
}
