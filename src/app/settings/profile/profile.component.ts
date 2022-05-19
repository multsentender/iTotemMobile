import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import { AgentLoginInfo } from '@shared/models/agentLoginInfo';
import { ValidationStatus } from '@shared/models/validationStatus';
import { filter, skip } from 'rxjs';
import { ProfileService } from '@shared/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup = this.fb.group({
    name: [{value: '', disabled: true}],
    email: ['', Validators.compose([Validators.email])],
    password: [''],
    passwordRep: [''],
  }, { validator: this.checkPasswords });


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
  }

  confirm() {
    // this.http.post<ValidationStatus>(
    //   `${environment.apiUrl}validateEMail`,
    //   {email: this.profileForm.value.email})
    //   .subscribe((data) => console.log(data))
  }

  cancel() {
    this.location.back();
  }

  checkPasswords(group: FormGroup) {
    return (group.controls['password'].value === group.controls['passwordRep'].value) ? null :
      { passwordMatchError: 'passwords_not_equal' } as ValidationErrors
  }
}
