import { Injectable } from '@angular/core';
import { NativeHttpService } from '../http/native-http/native-http.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private htttp : NativeHttpService
  ) { }

  async createUser(userDetails, branchID) {
    const userObj = {
      name: userDetails.name,
      email: userDetails.bussiness_email_id,
      phone_number: userDetails.mobile_number
    }
    return await this.htttp.post("/users/" + branchID,userObj);
  }
}
