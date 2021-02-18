import { Injectable } from '@angular/core';
import { NativeHttpService } from '../http/native-http/native-http.service';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(
    private http : NativeHttpService
  ) {
   }

  async getCompany(companyId : number) {
    return await this.http.get("/customers/" + companyId, undefined );
  }

  getBranches(agencyId : number) {
    const type: { [key: string]: string | string[] } = {
      "company_type":"corporate_branch"
    }
    return from(this.http.get("/customers/agency/getallbranches/" + agencyId, type));

  }
}
