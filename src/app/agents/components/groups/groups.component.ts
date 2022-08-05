import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormArray } from '@angular/forms';
import { RateGroup } from '../../pages/rates/rates.component';

@Component({
  selector: 'app-groups[dataTree][parentForm][formName]',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupsComponent{
  @Input() dataTree!: RateGroup[]
  @Input() parentForm!: FormArray
  @Input() formName!: string;
  @Input() isEditing = false

  constructor() { }

  findFormGroup(id: number) {
    const array: any[] = this.parentForm?.get(this.formName)?.value
    return array.findIndex(el => el.id === id);
  }

  skipAccordionExpanding(event: PointerEvent) {
    event.stopPropagation()
  }

  trackByFunc(index: number, item: RateGroup) {
    return item.data.groupId
  }
}
