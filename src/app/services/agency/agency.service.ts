import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { NativeHttpService } from '../http/native-http/native-http.service';

@Injectable({
  providedIn: 'root'
})
export class AgencyService {

  constructor(
    private http : NativeHttpService
  ) { }

  getAgency(agencyId : number) {
    return from(this.http.get("/customers/" + agencyId.toString(), {} ));
  }

}
