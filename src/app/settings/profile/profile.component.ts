import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { filter, first } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { ProfileService } from '@shared/services/profile.service'
import { ErrorMessageService } from '@shared/services/error-message.service';
import { atLeastOneValidator, checkConfirmPassword } from '@shared/utils/formValidators';

import { ValidationStatus } from '@shared/models/validationStatus';
import { UpdateCurrentUserPasswordRequest } from '@shared/models/models';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

// FIXME Добавить масштабирование (заменить проверку на email)
export class ProfileComponent implements OnInit {
  modalActive: boolean = false
  formValidation: {[key: string]: string} = {}


  profileForm: FormGroup = this.fb.group({
    name: [{value: '', disabled: true}],
    email: ['', [Validators.pattern(/.+@.+\..+/)]],
    password: ['', [Validators.minLength(5)]],
    passwordConf: '',
  }, { validators: [checkConfirmPassword, atLeastOneValidator(['email', 'password']) ]});

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private profileService: ProfileService,
    private errorMessageService: ErrorMessageService
  ) {
    this.profileService.profile.pipe(filter((el) => !!el.userId)).subscribe(agent => {
      this.profileForm.patchValue({
      name: agent.login,
      email: agent.email
      })
    })
  }

  ngOnInit(): void {
    this.profileService.loadAgentProfile()
      .subscribe({
        next: (data) => this.profileService.profile.next(data),
        error: (err: HttpErrorResponse) => new Error(err.message)
      })

    // Совмещение клиентской и серверной валдации
    this.profileForm.valueChanges
    .subscribe((data) => {
      if(this.profileForm.valid) {
        Object.keys(this.formValidation).forEach(key => delete this.formValidation[key]) //Очистка клиентских ошибок
        if(data.email) {
          this.profileService.validEmail({email: data.email})
            .subscribe(data => this.validQueryHandler('email', data))
        }
        if (data.password) {
          this.profileService.validPassword({password: data.password})
            .subscribe(data => this.validQueryHandler('password', data))
        }
      } else {
        // Error message на клиентскую валидацию
        // FIXME добавить локалазацию
        this.formValidation['email'] = !this.getFormControl('email').valid ? 'Неверный формат E-Mail адреса' : ''
        this.formValidation['password'] = !this.getFormControl('password').valid ? 'Минимальная длина пароля 5 cимволов' : ''
      }
    })
  }

  // Обработчик серверной валидации
  validQueryHandler(key: string, status: ValidationStatus) {
    if(!status.isValid) this.formValidation[key] = status.message || ''
    else delete this.formValidation[key]
  }

  getFormControl(name: string) : FormControl {
    return this.profileForm.get(name) as FormControl
  }

  updateProfileHandler() {
    const emailFormValue = this.getFormControl.bind(this)('email').value
    if(emailFormValue !== this.profileService.profile.value.email) {
      this.profileService.updateUserProfile({profile: {...this.profileService.profile.value, email: emailFormValue}})
      .pipe(first())
      .subscribe({
        next: () => this.profileService.loadAgentProfile(),
        error: (err: HttpErrorResponse) => this.errorMessageService.addError(err.error?.errorMessage)
      })
    }
  }

  checkCurrentPassword(currentPassword: string) {
    const passFormValue = this.getFormControl.bind(this)('password').value
    const params: UpdateCurrentUserPasswordRequest = {currentPassword}
    if(passFormValue) params.newPassword = passFormValue

    this.profileService.updateUserPassword(params)
      .pipe(first())
      .subscribe({
        next: () => {
          this.profileForm.patchValue({password: '', passwordConf: ''})
          this.updateProfileHandler()
        },
        error: (err: HttpErrorResponse) => {
          throw Error(err.error?.errorMessage)
          // this.errorMessageService.addError(err.error?.errorMessage)
        }
      })

      this.modalActive = false
  }


  // Form control functions
  confirm() {
    if(Object.keys(this.formValidation).length <= 0 && this.profileForm.valid) {
      if(this.getFormControl('password').value) {
        this.modalActive = true
      } else this.updateProfileHandler()
    }
  }

  cancel() {
    this.location.back();
  }
}
