import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ValidationErrors, FormControl } from '@angular/forms';
import { filter, first, pairwise } from 'rxjs';
import { ProfileService } from '@shared/profile.service';
import { ValidationStatus } from '@shared/models/validationStatus';
import { atLeastOneValidator, checkConfirmPassword } from '@shared/utils/formValidators';
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
    email: [null, [Validators.pattern(/.+@.+\..+/)]],
    password: [null, [Validators.minLength(5)]],
    passwordConf: null,
  }, { validators: [checkConfirmPassword, atLeastOneValidator(['email', 'password'])] });


  constructor(
    private fb: FormBuilder,
    private location: Location,
    private profileService: ProfileService
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
        if(next.email && prev.email !== next.email) {
          this.profileService.validEmail({email: next.email}, this.validQueryHandler('email'))
        }
        if (next.password && prev.email === next.email) {
          this.profileService.validPassword({password: next.password}, this.validQueryHandler('password'))
        }
      } else {
        // Error message на клиентскую валидацию
        // FIXME добавить локалазацию
        if(!this.getFormControl('email').valid) this.formValidation['email'] = 'Неверный формат E-Mail адреса'
        if(!this.getFormControl('password').valid) this.formValidation['password'] = 'Минимальная длина пароля 5 cимволов'
      }
    })
  }

  // Обработчик серверной валидации
  validQueryHandler(key: string) {
    return (status: ValidationStatus) => {
      if(!status.isValid) this.formValidation[key] = status.message || ''
      else delete this.formValidation[key]
      console.log(this.formValidation)
    }
  }

  getFormControl(name: string) : FormControl {
    return this.profileForm.get(name) as FormControl
  }

    checkCurrentPassword(currentPassword: string) {
    const passFormValue = this.getFormControl.bind(this)('password').value
    const emailFormValue = this.getFormControl.bind(this)('email').value
    const params: UpdateCurrentUserPasswordRequest = {currentPassword}
    if(passFormValue) params.newPassword = passFormValue

    this.profileService.updateUserPassword(params)
      .pipe(first())
      .subscribe({
        next: () => {
          if(emailFormValue) {
            this.profileService.updateUserProfile({profile: {...this.profileService.profile.value, email: emailFormValue}})
            .pipe(first())
            .subscribe({error: (err) => console.log('updateProfile', err)
            })
          }
        },
        error: (err) => {
          console.log('updPassword', err);
        }
      })
  }


  // Form control functions
  confirm() {
    if(Object.keys(this.formValidation).length <= 0 && this.profileForm.valid) {
      this.modalActive = true
    }
  }

  cancel() {
    this.location.back();
  }
}
