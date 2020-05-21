import { Component, OnInit, ViewRef, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { CompanyState } from 'src/app/stores/company.state';
import { Subscription, Observable } from 'rxjs';
import { company } from 'src/app/models/company';

export interface role {
  label: string,
  value: string
}

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss']
})
export class RegisterPage implements OnInit, OnDestroy {

  showBranchForm: boolean = false;
  showUserForm: boolean = false;
  
  companyForm: FormGroup;
  branchForm : FormGroup;
  userForm: FormGroup;
  profileForm: FormGroup;
  
  company$: Observable<company>;
  companySub: Subscription;


  user: any[] = [];
  roles: role[] = [
    { label: 'Admin', value: 'admin' },
    { label: 'Approver', value: 'approver' },
    { label: 'User', value: 'user' },
    { label: 'Accounts', value: 'accounts' }
  ];

  constructor(
    public router: Router,
    public store : Store
  ) {
    this.company$ = this.store.select(company => company);
   }

  ngOnInit() {

    this.companySub = this.company$.subscribe(
      (companyData) => {
        this.companyForm = new FormGroup({
          company_name: new FormControl(companyData.company_name),
          company_address: new FormControl(companyData.company_address_line1),
          auth_sign_name: new FormControl(null),
          company_phone_number: new FormControl(companyData.phone_number),
          gst_number: new FormControl(companyData.gst_details.gstNo),
          gst_email: new FormControl(companyData.gst_details.email),
          gst_phone_number: new FormControl(companyData.gst_details.phoneNumber),
          branch: new FormControl('Main Branch')
        });
      }
    );

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

  ngOnDestroy(): void {
    if (this.companySub) {
      this.companySub.unsubscribe();
    }
  }

}
