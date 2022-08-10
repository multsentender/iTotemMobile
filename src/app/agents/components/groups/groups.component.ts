import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormArray } from '@angular/forms';
import { IPermitions, RateGroup } from '../../pages/rates/rates.component';

@Component({
  selector: 'app-groups[dataTree][parentForm][formName][permitions]',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupsComponent{
  @Input() dataTree!: RateGroup[]
  @Input() parentForm!: FormArray
  @Input() formName!: string;
  @Input() isEditing = false
  @Input() permitions!: IPermitions;

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

  getRangeRate(tree: RateGroup) {
    let rates: any[]
    if(this.permitions.editorGroup) {
      const form: FormArray = this.parentForm.get(this.formName) as FormArray
      const ids = [tree.data.groupId, ...tree.children?.map(el => el.data.groupId) || []]
      rates = ids.map(el => form.at(this.findFormGroup(el)).value.rate)
    } else {
      rates = [tree.rateInfo.rate, ...tree.children?.map(el => el.rateInfo.rate) || []]
    }

    const min = (Math.min.apply(null, rates) * 100).toFixed(2)
    const max = (Math.max.apply(null, rates) * 100).toFixed(2)

    if(min === max) return `${min}%`
    return `${min} - ${max}%`
  }
}
