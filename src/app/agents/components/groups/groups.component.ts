import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
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

  // private errorRateMessages$ = new BehaviorSubject<{[key: string]: ValidationErrors}>({})

  constructor() { }

  // ngOnInit(): void {
    // const form = this.parentForm.get(this.formName)

    // form?.statusChanges
    // .subscribe(valid => {
    //   if(valid === 'VALID') return
    //   this.errorRateMessages$.next(getFormValidationErrors(form as FormArray))
    // })
  // }


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
