import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { filter, first } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { ProfileService } from '@shared/services/profile.service'
import { atLeastOneValidator, checkConfirmPassword } from '@shared/utils/formValidators';
import { Logger, Log } from '@shared/services/log.service';

import { ValidationStatus } from '@shared/models/validationStatus';
import { UpdateCurrentUserPasswordRequest } from '@shared/models/models';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SuccessMessageComponent } from '@shared/components/success-message/success-message.component';

import { ModalComponent } from '../modal/modal.component';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

// FIXME Добавить масштабирование (заменить проверку на email)
export class ProfileComponent implements OnInit {
  componentName: string = 'ProfileComponent';
  modalActive: boolean = false
  formValidation: { [key: string]: string } = {}
  private _log: Logger = Log.get(this.componentName);//as name of component is removed in prod build
  dialogRef?: MatDialogRef<ModalComponent, any>;

  profileForm: FormGroup = this.fb.group({
    name: [{ value: '', disabled: true }],
    email: ['', [Validators.pattern(/.+@.+\..+/)]],
    password: ['', [Validators.minLength(5)]],
    passwordConf: '',
  }, { validators: [checkConfirmPassword, atLeastOneValidator(['email', 'password'])] });

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private profileService: ProfileService,
    public dialog: MatDialog
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
        if (this.profileForm.valid) {
          Object.keys(this.formValidation).forEach(key => delete this.formValidation[key]) //Очистка клиентских ошибок
          if (data.email) {
            this.profileService.validEmail({ email: data.email })
              .subscribe(data => this.validQueryHandler('email', data))
          }
          if (data.password) {
            this.profileService.validPassword({ password: data.password })
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
    if (!status.isValid) this.formValidation[key] = status.message || ''
    else delete this.formValidation[key]
  }

  getFormControl(name: string): FormControl {
    return this.profileForm.get(name) as FormControl
  }

  updateProfileHandler() {
    const emailFormValue = this.getFormControl.bind(this)('email').value
    if (emailFormValue !== this.profileService.profile.value.email) {
      this._log.info(`changing player e-mail on ${emailFormValue}`);
      this.profileService.updateUserProfile({ profile: { ...this.profileService.profile.value, email: emailFormValue } })
        .pipe(first())
        .subscribe(() => this.profileService.loadAgentProfile())
    }
  }

  checkCurrentPassword(currentPassword: string) {
    this._log.info("confirm old password confirmation modal");
    const passFormValue = this.getFormControl.bind(this)('password').value
    const params: UpdateCurrentUserPasswordRequest = { currentPassword }
    if (passFormValue) params.newPassword = passFormValue

    this.profileService.updateUserPassword(params)
      .pipe(first())
      .subscribe(() => {
        this.profileForm.patchValue({ password: '', passwordConf: '' })
        this.updateProfileHandler()
      })

    this.dialogRef?.close()
  }


  // Form control functions
  confirm() {
    if (Object.keys(this.formValidation).length <= 0 && this.profileForm.valid) {
      if (this.getFormControl('password').value) {
        this._log.info("open old password confirmation modal");
        this.dialogRef = this.dialog.open(ModalComponent, {
          maxWidth: 'calc(100% - var(--container-pad) * 2)',
          position: { top: '24px' },
          panelClass: 'post-dialog-container',
          data: {
            title: "MODAL_TITLE",
            message: "MODAL_MESSAGE",
            withForm: true,
            cbEvent: this.checkCurrentPassword
          }
        })

        this.dialogRef.componentInstance.cbEvent.subscribe((currentPassword: string) => {
          this.checkCurrentPassword(currentPassword)
        });
        this.dialogRef.afterClosed().subscribe(result => {
          this.dialogRef?.componentInstance.cbEvent.unsubscribe()
        });
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
