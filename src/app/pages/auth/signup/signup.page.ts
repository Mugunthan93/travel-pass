import { Component, OnInit, ViewContainerRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { CdkStepper } from '@angular/cdk/stepper';
import { Router } from '@angular/router';

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

  showBranchForm : boolean = false;
  showUserForm : boolean = false;

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
    public router : Router
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

  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    
  }

  addBranch(){
    this.showBranchForm = true;
  }

  closeBranch(changeView : boolean){
    this.showBranchForm = changeView;
  }

  onSignup() {

  }

  addUser(){
    this.showUserForm = true;
  }

  closeUser(changeView : boolean) {
    this.showUserForm = changeView;
  }

  onSubmit() {
    
  }

  finishSignup() {
    // this.router.navigate(['/booking']);
  }


}
