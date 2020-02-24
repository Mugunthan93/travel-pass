import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { CdkStepper } from '@angular/cdk/stepper';
import { Router } from '@angular/router';

export interface role {
  label: string,
  value: string
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  providers: [{ provide: [CdkStepper], useExisting: SignupPage }]
})
export class SignupPage implements OnInit {

  showBranchForm: boolean = false;
  showUserForm: boolean = false;

  personalForm: FormGroup;
  companyForm: FormGroup;
  userForm: FormGroup;


  user: any[] = [];
  roles: role[] = [
    { label: 'Admin', value: 'admin' },
    { label: 'Approver', value: 'approver' },
    { label: 'User', value: 'user' },
    { label: 'Accounts', value: 'accounts' }
  ];

  constructor(
    public router: Router
  ) {

    this.personalForm = new FormGroup({
      name: new FormControl(),
      mobile_number: new FormControl(),
      bussiness_email_id: new FormControl(),
      company_name: new FormControl(),
      company_address: new FormControl(),
      gst_number: new FormControl()
    });

    this.companyForm = new FormGroup({
      company_name: new FormControl(),
      company_address: new FormControl(),
      auth_sign_name: new FormControl(),
      company_phone_number: new FormControl(),
      gst_number: new FormControl(),
      gst_email: new FormControl(),
      gst_phone_number: new FormControl(),
      branch: new FormControl()
    });

  }

  ngOnInit() {
  }

  ionViewDidEnter() {

  }

  addBranch() {
    this.showBranchForm = true;
  }

  closeBranch(changeView: boolean) {
    this.showBranchForm = changeView;
  }

  onSignup() {

  }

  addUser() {
    this.showUserForm = true;
  }

  closeUser(changeView: boolean) {
    this.showUserForm = changeView;
  }

  onSubmit() {

  }

  finishSignup(signupFinsih: boolean) {
    if (signupFinsih) {
      this.router.navigate(['/', 'home', 'booking']);
    }
  }


}
