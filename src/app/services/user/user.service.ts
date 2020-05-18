import { Injectable } from '@angular/core';
import { NativeHttpService } from '../http/native-http/native-http.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    public http : NativeHttpService
  ) { }

  async createMainUser(signupData,companyDetails) {
    const userObj = {
      name: signupData.name,
      email: signupData.bussiness_email_id,
      phone_number: signupData.mobile_number,
      password: signupData.mobile_number,
      role: "admin",
      customer_id: companyDetails.id
    }
    return await this.http.post("/users/" + companyDetails.id, userObj);
  }

  async createBranchUser(uaerData, branchDetails) {
    const userObj = {
      name: uaerData.name,
      email: uaerData.bussiness_email_id,
      phone_number: uaerData.mobile_number,
      password: uaerData.mobile_number,
      role: "management",
      customer_id: branchDetails.id
    }
    return await this.http.post("/users/" + branchDetails.id, userObj);
  }


}
