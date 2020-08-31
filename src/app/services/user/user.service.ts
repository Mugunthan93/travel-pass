import { Injectable } from '@angular/core';
import { NativeHttpService } from '../http/native-http/native-http.service';
import { from, Observable } from 'rxjs';
import { user } from 'src/app/models/user';
import { map } from 'rxjs/operators';
import { HTTPResponse } from '@ionic-native/http/ngx';
import { environment } from 'src/environments/environment';

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

  updateUser(id: number, currentuser: user): Observable<any> {
    this.http.setHeader(environment.baseURL, "Content-Type", "application/json");
    this.http.setData('json');
    let url = '/users/' + id;
    return from(this.http.put(url, currentuser))
      .pipe(
        map(
          (response: HTTPResponse) => {
            console.log(response);
            return response;
          }
        )
      )
  }


}
