import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { NativeHttpService } from '../http/native-http/native-http.service';
import * as moment from 'moment';
import { HTTPResponse } from '@ionic-native/http/ngx';
import { Store } from '@ngxs/store';
import { UserState } from 'src/app/stores/user.state';
import { request_param } from 'src/app/stores/booking.state';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(
    private http: NativeHttpService,
    private store : Store
  ) { }

  myBooking(type : string, booktype : string, bookmode : string) : Observable<HTTPResponse> {

    let typeUrl : string= this.typeUrl1(type);      
    let typeUrl2 : string = this.typeUrl2(type);
    const userId: number = this.store.selectSnapshot(UserState.getUserId);  
    let id : number = userId;
    const startDate = moment({}).format('YYYY-MM-DD%2023:59:59.000+00:00');
    const endDate = moment({}).subtract(1,'month').format('YYYY-MM-DD%2000:00:01.000+00:00'); 
    const book : { [key: string]: string | string[] } | string = this.bookUrl(type,bookmode);

    let url : string = typeUrl + id.toString() + '/' + booktype + '/'  + endDate + "/" + startDate + typeUrl2;
    console.log(url);
    this.http.setReqTimeout(300);
    this.http.setHeader(environment.baseURL, "Content-Type", "application/json");
    this.http.setData('json');

    if(type == 'flight' || type == 'train') {
      let params : { [key: string]: string | string[] } = { 
        "booking_mode": bookmode 
      }

      return from(this.http.get(url, params));
    }
    else  {
      return from(this.http.get(url, {}));
    }
  }

  typeUrl1(type : string) {
    switch(type) {
      case 'flight' : return '/airlineRequest/getairlinebyuserid/';
      case 'hotel' : return '/hotelRequest/gethotelbyuserid/';
      case 'bus' : return '/busRequest/getbusByUser/';
      case 'train' : return '/trainRequest/gettrainbyuserid/';
    }
  }

  typeUrl2(type : string) {
    switch(type) {
      case 'flight' : return '/0/999';
      case 'hotel' : return '/0/10';
      case 'bus' : return '/0/10';
      case 'train': return '/0/999';
    }
  }

  bookUrl(type : string, mode : string) : { [key: string]: string | string[] } {

    let params = null;

    switch(type) {
      case 'flight' : return { "booking_mode": mode };
      case 'hotel' : return {};
      case 'bus' : return {};
      case 'train': return { "booking_mode": mode };
    }
  }

  bookUrl2(type : string, mode : string) : string {
    switch(type) {
      case 'flight' : return "?booking_mode="+mode;
      case 'hotel' : return "";
      case 'bus' : return "";
      case 'train': return "?booking_mode="+mode;
    }
  }

  sendChangeRequet(param : request_param) {
    this.http.setHeader(environment.baseURL, "Content-Type", "application/json");
    this.http.setData('json');
    return from(this.http.post('/airlines/sendChangeRequest',param));
  }
  
}
