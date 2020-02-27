import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

export interface role {
  label: string,
  value: string
}

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss']
})
export class RegisterPage implements OnInit {

  showBranchForm: boolean = false;
  showUserForm: boolean = false;
  
  companyForm: FormGroup;
  branchForm : FormGroup;
  userForm: FormGroup;
  profileForm : FormGroup;


  user: any[] = [];
  roles: role[] = [
    { label: 'Admin', value: 'admin' },
    { label: 'Approver', value: 'approver' },
    { label: 'User', value: 'user' },
    { label: 'Accounts', value: 'accounts' }
  ];

  constructor(
    public router : Router
  ) { }

  ngOnInit() {

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

  addBranch() {
    this.showBranchForm = true;
  }

  closeBranch(changeView: boolean) {
    this.showBranchForm = changeView;
  }

  addUser() {
    this.showUserForm = true;
  }

  closeUser(changeView: boolean) {
    this.showUserForm = changeView;
  }

  onSubmit() {

  }

  finishSignup() {
    this.router.navigate(['/','home']);
  }

}
