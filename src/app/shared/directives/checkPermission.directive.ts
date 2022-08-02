import { Directive, ElementRef, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[checkPermission]'
})
export class CheckPermission implements OnInit {
  @Input('checkPermission') permission?: string;
  @Input('checkPermissionPermissions') permissions?: string[];

  constructor(
    private el: ElementRef,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    ) { }
  
  ngOnInit(): void {
    if (!this.permission || this.permissions?.includes(this.permission)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

}