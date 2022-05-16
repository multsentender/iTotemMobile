import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ValidationErrors } from '@angular/forms';

interface Profile {
  name: string,
  email: string,
  password: string,
  passwordRep: string
}

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
  ) { }

  ngOnInit(): void {
    //STATIC
    const data: Profile = {
      name: "name",
      email: "email@f.com",
      password: "password",
      passwordRep: ""
    }

    this.profileForm.patchValue({
      name: data.name,
      email: data.email,
      password: data.password
    });
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
