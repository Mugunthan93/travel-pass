import { Injectable, ɵSWITCH_CHANGE_DETECTOR_REF_FACTORY__POST_R3__ } from '@angular/core';
import { NativeHttpService } from '../http/native-http/native-http.service';
import { HTTPResponse } from '@ionic-native/http/ngx';
import { company } from 'src/app/models/company';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(
    private http : NativeHttpService
  ) {
   }

  async getCompany(companyId : number) {
    const id: { [key: string]: string | string[] } = {
      "customer_id": companyId.toString()
    }
    return await this.http.get("/customers/" + companyId, undefined );
  }
}
