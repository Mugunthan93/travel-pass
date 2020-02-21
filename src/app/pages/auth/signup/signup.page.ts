import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { CdkStepper } from '@angular/cdk/stepper';

export interface role {
  label : string,
  value : string
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  providers :[{ provide: [CdkStepper], useExisting: SignupPage }]
})
export class SignupPage implements OnInit {

  personalSignupForm: FormGroup;
  companySignupForm: FormGroup;
  userSignupForm : FormGroup;

  user : any[] = [];
  roles : role[] = [
    {label : 'Admin', value : 'admin'},
    {label : 'Approver', value : 'approver'},
    {label : 'User', value : 'user'},
    {label : 'Accounts', value : 'accounts'}
  ];

  constructor(
  ) {

    this.personalSignupForm = new FormGroup({
      name : new FormControl(),
      mobile_number : new FormControl(),
      bussiness_email_id : new FormControl(),
      company_name : new FormControl(),
      company_address : new FormControl(),
      gst_number : new FormControl()
    });

    this.companySignupForm = new FormGroup({
      company_name : new FormControl(),
      company_address : new FormControl(),
      auth_sign_name : new FormControl(),
      company_phone_number : new FormControl(),
      gst_number : new FormControl(),
      gst_email : new FormControl(),
      gst_phone_number : new FormControl(),
      branch : new FormControl()
    });

    this.userSignupForm = new FormGroup({
      name : new FormControl(),
      mobile_number : new FormControl(),
      email_id : new FormControl(),
      approver_name : new FormControl(),
      role : new FormControl()
    });

  }

  ngOnInit() {

  }

  ionViewDidEnter() {
    
  }

  onSignup() {



  }

  onSubmit() {
    
  }

}
