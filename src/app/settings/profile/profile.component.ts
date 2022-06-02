import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ValidationErrors, FormControl } from '@angular/forms';
import { filter, first, pairwise } from 'rxjs';
import { ProfileService } from '@shared/profile.service';
import { ValidationStatus } from '@shared/models/validationStatus';
import { atLeastOneValidator, checkConfirmPassword } from '@shared/utils/formValidators';
import { UpdateCurrentUserPasswordRequest } from '@shared/models/models';
import { ErrorMessageService } from '@shared/error-message.service';
import { HttpErrorResponse } from '@angular/common/http';


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
    if(!this.profileService.profile.value.userId){
      this.profileService.loadAgentProfile()
    }

    // Совмещение клиентской и серверной валдации
    this.profileForm.valueChanges.pipe(pairwise())
    .subscribe(([prev, next]) => {
      if(this.profileForm.valid) {
        Object.keys(this.formValidation).forEach(key => delete this.formValidation[key]) //Очистка клиентских ошибок
        if(next.email && prev.email !== next.email) {
          this.profileService.validEmail({email: next.email}, this.validQueryHandler('email'))
        }
        if (next.password) {
          this.profileService.validPassword({password: next.password}, this.validQueryHandler('password'))
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
  validQueryHandler(key: string) {
    return (status: ValidationStatus) => {
      if(!status.isValid) this.formValidation[key] = status.message || ''
      else delete this.formValidation[key]
    }
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
