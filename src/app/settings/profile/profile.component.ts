import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { BehaviorSubject, catchError, filter, finalize, skip } from 'rxjs';

import { atLeastOneValidator, checkConfirmPassword } from '@shared/utils/formValidators';
import { Logger, Log } from '@shared/services/log.service';

import { ValidationStatus } from '@shared/models/validationStatus';
import { ApiService } from '@shared/services/api.service';
import { ModalService } from '@shared/services/modal.service';
import { AgentLoginInfo } from '@shared/models/agentLoginInfo';
import { MessageService } from '@shared/services/message.service';


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

  private _log: Logger = Log.get(this.componentName);//as name of component is removed in prod build
  private profile: BehaviorSubject<AgentLoginInfo> = new BehaviorSubject<AgentLoginInfo>({})

  public disabledBtn: boolean = true

  profileForm: FormGroup = this.fb.group({
    login: [{ value: '', disabled: true }],
    email: ['', [Validators.pattern(/.+@.+\..+/)]],
    password: ['', [Validators.minLength(5)]],
    passwordConf: '',
  }, { validators: [checkConfirmPassword, atLeastOneValidator(['email', 'password'])] });



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
      .pipe(finalize(() => this.isLoading = false))
      .subscribe((data) => this.profile.next(data))

    // Совмещение клиентской и серверной валдации
    this.profileForm.valueChanges
    .pipe(skip(1))
    .subscribe((data) => {
      if(
        this.profileForm.valid &&
        (data.email !== this.profile.value.email ||
        data.password.length > 0)
      ) {
        this.disabledBtn = false

        Object.keys(this.formValidation).forEach(key => delete this.formValidation[key]) //Очистка клиентских ошибок
        if(data.email) {
          this.api.validateEMail(data.email)
            .subscribe(data => this.validQueryHandler('email', data))
        }
        if (data.password) {
          this.api.validateCurrentUserPassword({password: data.password})
            .subscribe(data => this.validQueryHandler('password', data))
          }
      } else {
        this.disabledBtn = true

        // Error message на клиентскую валидацию
        this.formValidation['email'] = !this.getFormControl('email').valid ? 'VALIDATION_MESSAGE_EMAIL' : ''
        this.formValidation['password'] = !this.getFormControl('password').valid ? 'VALIDATION_MESSAGE_PASSWORD' : ''
      }
    })
  }




  getFormControl(name: string): FormControl {
    return this.profileForm.get(name) as FormControl
  }

  // Обработчик серверной валидации
  validQueryHandler(key: string, status: ValidationStatus) {
    if (!status.isValid) this.formValidation[key] = status.message || ''
    else delete this.formValidation[key]
  }


  checkCurrentPassword(currentPassword: string) {
    this.isLoading = true

    this._log.info("confirm old password confirmation modal");
    const newPassword = this.getFormControl('password').value

    this.api.updateCurrentUserPassword(currentPassword, newPassword)
      .pipe(catchError(err => {
        this.isLoading = false
        return err
      }))
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
        .pipe(finalize(() => this.isLoading = false))
        .subscribe(() => {
          this.profile.next({...this.profile.value, email: emailFormValue})
          this.messageService.showSuccess()
        })
    } else {
      this.isLoading = false
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
