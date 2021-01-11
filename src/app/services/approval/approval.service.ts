import { Injectable } from '@angular/core';
import { HTTPResponse } from '@ionic-native/http/ngx';
import { from, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
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
    const encrytkey = {
      "encrytkey": "wMMtGeHb0WCq9oppu3n6Apvco0Bt6zaT0sJVwsSXlxM="
    }
    return from(this.http.get( typeUrl + userId, encrytkey));
  }
  
  //get ticket by manager from approval request list 
  getReqTicket(ticketId: string,type : string): Observable<HTTPResponse> {
    const encrytkey = {
      "encrytkey": "wMMtGeHb0WCq9oppu3n6Apvco0Bt6zaT0sJVwsSXlxM="
    }
    let approveUrl : string = this.approveUrl(type);
    return from(this.http.get(approveUrl + ticketId, encrytkey));
  }

  //approve the request
  approvalReq(type : string, ticketId : string, requestBody : any ): Observable<HTTPResponse> {
    this.http.setHeader(environment.baseURL, "Content-Type", "application/json");
    this.http.setData('json');
    let approveUrl : string = this.approveUrl(type);
    return from(this.http.put(approveUrl + ticketId, requestBody));
  }

  typeUrl(type : string) {
    switch(type) {
      case 'flight' : return '/allBookings/';
      case 'hotel' : return '/hotelRequest/approval/';
      case 'bus': return '/busRequest/approval/';
      case 'train': return '/trainRequest/approval/';
    }
  }

  approveUrl(type : string) {
    switch(type) {
      case 'flight' : return '/airlineRequest/';
      case 'hotel' : return '/hotelRequest/';
      case 'bus': return '/busRequest/';
      case 'train': return '/trainRequest/';
    }
  }

}
