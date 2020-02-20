import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { CdkStepper, CdkStepLabel } from '@angular/cdk/stepper';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  providers :[{ provide: [CdkStepper], useExisting: SignupPage }]
})
export class SignupPage implements OnInit {

  personalSignupForm: FormGroup;
  companySignupForm: FormGroup;

  constructor() {
  }

  ngOnInit() {

      this.personalSignupForm = new FormGroup({
        name : new FormControl(),
        mobile_number : new FormControl(),
        bussiness_email_id : new FormControl(),
        company_name : new FormControl(),
        company_address : new FormControl(),
        gst_no : new FormControl()
      });

      this.companySignupForm = new FormGroup({

      });

  }

  onSignup() {

  }

  onSubmit() {
    
  }

}
