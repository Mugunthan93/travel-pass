import { Component, OnInit, ViewRef, ElementRef, ViewChild, OnDestroy, TemplateRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { CompanyState, UpdateCompany } from 'src/app/stores/company.state';
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

  @ViewChild('branchList', { static : true }) branchList: ElementRef<HTMLElement>;

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
    this.company$ = this.store.select(CompanyState.company);
    this.companyForm = new FormGroup({
      company_name: new FormControl(null),
      company_address: new FormControl(null),
      auth_sign_name: new FormControl(null),
      company_phone_number: new FormControl(null),
      gst_number: new FormControl(null),
      gst_email: new FormControl(null),
      gst_phone_number: new FormControl(null),
      branch: new FormControl('Main Branch')
    });
   }

  ngOnInit() {

    this.companySub = this.company$.subscribe(
      (companyData) => {
        this.companyForm.patchValue({
          company_name: companyData.company_name,
          company_address: companyData.company_address_line1,
          company_phone_number: companyData.phone_number,
          gst_number: companyData.gst_details.gstNo,
          gst_email: companyData.gst_details.email,
          gst_phone_number: companyData.gst_details.phoneNumber,
        });
      });
    
    console.log(this.companyForm);

  }

  async updateCompany() {
    this.store.dispatch(new UpdateCompany(this.companyForm.value))
      .subscribe(
        (resData) => {
          if (resData) {
            console.log("register completed, moving to next page");
            this.branchList.nativeElement.click();
        }}
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
    this.store.dispatch(new UpdateCompany(this.companyForm.value));
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
