import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AgentInfo } from '@shared/models/agentInfo';
import { environment } from 'src/environments/environment';
import { AgentLoginInfo } from '@shared/models/agentLoginInfo';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup = this._fb.group({
    name: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
    email: ['', Validators.compose([Validators.required, Validators.email])],
    password: ['', Validators.required],
    passwordRep: ['', Validators.required],
  }, { validator: this.checkPasswords });


  constructor(
    private _fb: FormBuilder,
    private location: Location,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.http.get<AgentLoginInfo>(
      `${environment.apiUrl}getCurrentUserProfile`,
      {withCredentials: true}).subscribe({
        next: (data) => {
          console.log(data);

          this.profileForm.patchValue({
            name: data.agentName,
            email: data.email,
            password: data.password,
            passwordRep: data.password
          })
        },
        error: (err: HttpErrorResponse) => new Error(err.message)
      })
  }

  confirm() {
    this.profileForm.markAllAsTouched();
  }

  cancel() {
    this.location.back();
  }

  checkPasswords(group: FormGroup) {
    return (group.controls['password'].value === group.controls['passwordRep'].value) ? null :
      { passwordMatchError: 'passwords_not_equal' } as ValidationErrors
  }
}
