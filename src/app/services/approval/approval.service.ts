import { Injectable } from '@angular/core';
import { HTTPResponse } from '@ionic-native/http/ngx';
import { from, Observable } from 'rxjs';
import { NativeHttpService } from '../http/native-http/native-http.service';

@Injectable({
  providedIn: 'root'
})
export class ApprovalService {

  constructor(
    private http : NativeHttpService
  ) { }

  getApprovalList(type : string, userId : number): Observable<HTTPResponse> {
    let typeUrl : string = this.typeUrl(type);
    return from(this.http.get( typeUrl + userId, {}));
  }

  //approve the request
  approvalReq(ticketId : string, requestBody : any ): Observable<HTTPResponse> {
    return from(this.http.put("/airlineRequest/" + ticketId, requestBody));
  }

  typeUrl(type : string) {
    switch(type) {
      case 'flight' : return '/allBookings/';
      case 'hotel' : return '/hotelRequest/approval/';
      case 'bus' : return '/busRequest/approval/';
    }
  }
}
