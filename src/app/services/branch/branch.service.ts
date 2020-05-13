import { Injectable } from '@angular/core';
import { NativeHttpService } from '../http/native-http/native-http.service';

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  constructor(
    private http : NativeHttpService
  ) { }

  async createBranch(companyID) {
    const branchObject = {
      agency_id: companyID
    }
    return this.http.post("/customers/", branchObject);
  }
}
