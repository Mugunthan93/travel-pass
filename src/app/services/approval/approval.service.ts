import { Injectable } from '@angular/core';
import { HTTPResponse } from '@ionic-native/http/ngx';
import { from, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NativeHttpService } from '../http/native-http/native-http.service';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ApprovalService {

  constructor(
    private http : NativeHttpService
  ) { }

  getApprovalList(type : string, userId : number): Observable<HTTPResponse> {
    this.http.setHeader(environment.baseURL, "Content-Type", "application/json");
    this.http.setData('json');
    let typeUrl : string = this.typeUrl(type);
    return from(this.http.get( typeUrl + userId, {}));
  }

  getOtherList(type : string, id : string, booktype : string) : Observable<HTTPResponse> {
    let typeUrl : string= this.typeUrl1(type);
    const startDate = moment({}).format('YYYY-MM-DD%2023:59:59.000+00:00');
    const endDate = moment({}).subtract(1,'month').format('YYYY-MM-DD%2000:00:01.000+00:00');

    let url : string = typeUrl + id + '/' + booktype + '/false/online/'  + endDate + "/" + startDate + '/0/999';
    this.http.setReqTimeout(300);
    this.http.setHeader(environment.baseURL, "Content-Type", "application/json");
    this.http.setData('json');

    let params : { [key: string]: string | string[] } = {
      "booking_mode": "online",
      "requesttype": "corporate"
    }
    console.log(url);
    return from(this.http.get(url, params));
  }

  //get ticket by manager from approval request list
  getReqTicket(ticketId: string,type : string): Observable<HTTPResponse> {
    const encrytkey = {
      "encrytkey": "wMMtGeHb0WCq9oppu3n6Apvco0Bt6zaT0sJVwsSXlxM="
    }
    this.http.setHeader(environment.baseURL, "Content-Type", "application/json");
    this.http.setData('json');
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

  typeUrl1(type : string) {
    switch(type) {
      case 'flight' : return '/airlineRequest/out/source/booking/mode/';
      case 'hotel' : return '/hotelRequest/out/source/boolean/booking/mode/on/off/';
      case 'bus' : return '/busRequest/out/source/booking/mode/';
      case 'train' : return '/trainRequest/out/source/booking/mode/';
    }
  }

  typeUrl2(type : string) {
    switch(type) {
      case 'flight' : return '/airlineRequest/out/source/booking/mode/';
      case 'hotel' : return '/hotelRequest/out/source/boolean/booking/mode/on/off/';
      case 'bus' : return '/busRequest/out/source/booking/mode/';
      case 'train' : return '/trainRequest/out/source/booking/mode/';
    }
  }

  typeUrl3(type : string) {
    switch(type) {
      case 'flight' : case 'train': case 'cab' : return '/0/999';
      case 'hotel' : case 'bus' : return '/0/10';
    }
  }

  bookUrl(type : string, mode : string) : { [key: string]: string | string[] } {
    switch(type) {
      case 'flight' : case 'train': case 'cab' : return { "booking_mode": mode };
      case 'hotel' :  case 'bus' : return {};
    }
  }

}
