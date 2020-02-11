import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

export interface account{
}

export class Account {

  private http : HttpClient;
  private router : Router;

  constructor(user){
  }

  // getEmployeeList(){
  //   return this.http.get(environment.baseURL + "/customers/" + this.customer_id, this.options);
  // }

  // getCorporateList() {
  //   return this.http.get(environment.baseURL + "/customers/", this.options)
  // }

  // addEmployee(employee){
  //   return this.http.post(environment.baseURL + "/users/" + this.customer_id, employee, this.options);
  // }

  // getEmployee(employee_id){
  //   this.router.navigate([""]);
  // }

  // updateEmployee(employee){
  //   return this.http.put(environment.baseURL + "/users/" + this.customer_id, employee, this.options);
  // }

  // deletEmployee(){
  //   return this.http.delete(environment.baseURL + "/users/" + this.customer_id, this.options);
  // }

  addCorporate(){}

  getCorporate(){}

  updateCorporate(){}

  deleteCorporate(){}

  addCompany(){}

  getCompany(){}

  updateCompany(){}

  deleteCompany(){}

  addBranch(){}

  getBranch(){}

  updateBranch(){}

  deleteBranch(){}

}


