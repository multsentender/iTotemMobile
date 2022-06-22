import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { filter, first } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { ProfileService } from '@shared/services/profile.service'
import { atLeastOneValidator, checkConfirmPassword } from '@shared/utils/formValidators';
import { Logger, Log } from '@shared/services/log.service';

import { ValidationStatus } from '@shared/models/validationStatus';
import { ApiService } from '@shared/services/api.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

// FIXME Добавить масштабирование (заменить проверку на email)
export class ProfileComponent implements OnInit {
  componentName: string = 'ProfileComponent';
  modalActive: boolean = false
  formValidation: {[key: string]: string} = {}
  private _log: Logger = Log.get(this.componentName);//as name of component is removed in prod build

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
    private api: ApiService
  ) {
    this.profileService.profile.pipe(filter((el) => !!el.userId)).subscribe(agent => {
      this.profileForm.patchValue({
      name: agent.login,
      email: agent.email
      })
    })
  }

  ngOnInit(): void {
    this.api.loadAgentProfile()
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
          this.api.validateEmail(data.email)
            .subscribe(data => this.validQueryHandler('email', data))
        }
        if (data.password) {
          this.api.validateAgentPassword({password: data.password})
            .subscribe(data => this.validQueryHandler('password', data))
        }
      } else {
        // Error message на клиентскую валидацию
        // FIXME добавить локалазацию
        this.formValidation['email'] = !this.getFormControl('email').valid ? 'VALIDATION_MESSAGE_EMAIL' : ''
        this.formValidation['password'] = !this.getFormControl('password').valid ? 'VALIDATION_MESSAGE_PASSWORD' : ''
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
      this._log.info(`changing player e-mail on ${emailFormValue}`);
      this.api.updateUserProfile({...this.profileService.profile.value, email: emailFormValue})
      .pipe(first())
      .subscribe(() => {
        this.api.loadAgentProfile()
      })
    }
  }

  checkCurrentPassword(currentPassword: string) {
    this._log.info("confirm old password confirmation modal");
    const newPassword = this.getFormControl.bind(this)('password').value

    this.api.updateUserPassword(currentPassword, newPassword)
      .pipe(first())
      .subscribe(() => {
          this.profileForm.patchValue({password: '', passwordConf: ''})
          this.updateProfileHandler()
      })

      this.modalActive = false
  }

  oldPasswordModalEvent(event: boolean) {
    if (!event) this._log.info("cancel old password confirmation modal");
    this.modalActive = event;
  }

  // Form control functions
  confirm() {
    if(Object.keys(this.formValidation).length <= 0 && this.profileForm.valid) {
      if(this.getFormControl('password').value) {
        this._log.info("open old password confirmation modal");
        this.modalActive = true
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
