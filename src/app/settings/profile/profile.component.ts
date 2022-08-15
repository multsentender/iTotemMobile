import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormControl, AsyncValidatorFn } from '@angular/forms';
import { BehaviorSubject, filter, skip } from 'rxjs';

import { FormValidator } from '@shared/utils/formValidators';
import { Logger, Log } from '@shared/services/log.service';

import { ValidationStatus } from '@shared/models/validationStatus';
import { ApiService } from '@shared/services/api.service';
import { ModalService } from '@shared/services/modal.service';
import { AgentLoginInfo } from '@shared/models/agentLoginInfo';
import { MessageService } from '@shared/services/message.service';

import { spinnerHandlerPipe } from '@shared/extensions';
import { HeaderMode } from '@shared/components/navbar/navbar.component';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

// FIXME Добавить масштабирование (заменить проверку на email)
export class ProfileComponent implements OnInit {
  componentName: string = 'ProfileComponent';
  formValidation: { [key: string]: string } = {}

  isLoading: boolean = true
  setLoad(val: boolean) {
    this.isLoading = val
  }

  private _log: Logger = Log.get(this.componentName);//as name of component is removed in prod build
  private profile: BehaviorSubject<AgentLoginInfo> = new BehaviorSubject<AgentLoginInfo>({})

  public disabledBtn: boolean = true
  public HeaderMode = HeaderMode

  profileForm: FormGroup = this.fb.group({
    login: [{ value: '', disabled: true }],
    email: ['', {validators: Validators.pattern(/.+@.+\..+/), asyncValidators: FormValidator.emailAsyncValidator(this.api)}],
    password: ['', {validators: Validators.minLength(5), asyncValidators: FormValidator.passwordAsyncValidator(this.api)}],
    passwordConf: '',
  }, { validators: [FormValidator.checkConfirmPassword, FormValidator.atLeastOneValidator(['email', 'password'])] });



  constructor(
    private fb: FormBuilder,
    private location: Location,
    private modalService: ModalService,
    private api: ApiService,
    private messageService: MessageService,
  ) {
    this.profile.pipe(filter((el) => !!el.userId))
      .subscribe(agent => this.profileForm.patchValue(agent))
  }


  ngOnInit(): void {
    this.api.getCurrentUserProfile()
      .pipe(spinnerHandlerPipe(this.setLoad.bind(this)))
      .subscribe((data) => this.profile.next(data))

      this.profileForm.statusChanges.subscribe(status => {
        const disable = status === 'VALID' ? false : true
        this.disabledBtn = disable
      })
  }


  getFormControl(name: string): FormControl {
    return this.profileForm.get(name) as FormControl
  }

  checkCurrentPassword(currentPassword: string) {
    this._log.info("confirm old password confirmation modal");
    const newPassword = this.getFormControl('password').value

    this.api.updateCurrentUserPassword(currentPassword, newPassword)
      .pipe(spinnerHandlerPipe(this.setLoad.bind(this)))
      .subscribe(() => {
        this.profileForm.patchValue({ password: '', passwordConf: '' })
        this.updateProfileHandler()
      })
  }

  updateProfileHandler() {
    const emailFormValue = this.getFormControl.bind(this)('email').value
    if (emailFormValue !== this.profile.value.email) {
      this._log.info(`changing player e-mail on ${emailFormValue}`);

      this.api.updateCurrentUserProfile({...this.profile.value, email: emailFormValue})
        .pipe(spinnerHandlerPipe(this.setLoad.bind(this)))
        .subscribe(() => {
          this.profile.next({...this.profile.value, email: emailFormValue})
          this.messageService.showSuccess()
        })
    } else {
      this.messageService.showSuccess()
    }
  }

  // Form control functions
  confirm() {
    if (Object.keys(this.formValidation).length <= 0 && this.profileForm.valid) {
      if (this.getFormControl('password').value) {
        this._log.info("open old password confirmation modal");
        this.modalService.initingModal(
          {
            title: "MODAL_TITLE",
            message: "MODAL_MESSAGE",
            withForm: true,
            submitFunc: this.checkCurrentPassword.bind(this)
          },
          {
            position: { top: '24px' },
            panelClass: 'post-dialog-container'
          }
        )
      } else {
        this.updateProfileHandler()
      }
    } else {
      this._log.info("attempt to confirm invalid profile form");
    }
  }

  cancel() {
    this.location.back();
  }
}
