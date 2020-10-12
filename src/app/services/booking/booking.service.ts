import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { NativeHttpService } from '../http/native-http/native-http.service';
import * as moment from 'moment';
import { HTTPResponse } from '@ionic-native/http/ngx';
import { Store } from '@ngxs/store';
import { UserState } from 'src/app/stores/user.state';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(
    private http: NativeHttpService,
    private store : Store
  ) { }

  myBooking(type : string, booktype : string) : Observable<HTTPResponse> {

    let typeUrl : string= this.typeUrl1(type);      
    let typeUrl2 : string = this.typeUrl2(type);
    const userId: number = this.store.selectSnapshot(UserState.getUserId);  
    let id : number = userId;
    const startDate = moment({}).add(1,'days').format('YYYY-MM-DD%2023:59:59.000+00:00');
    const endDate = moment({}).subtract(1, "months").format('YYYY-MM-DD%2000:00:01.000+00:00'); 
    const book = this.bookUrl(type);
    return from(this.http.get( typeUrl + id.toString() + '/' + booktype + '/'  + endDate + "/" + startDate + typeUrl2, book))
  }

  typeUrl1(type : string) {
    switch(type) {
      case 'flight' : return '/airlineRequest/getairlinebyuserid/';
      case 'hotel' : return '/hotelRequest/gethotelbyuserid/';
      case 'bus' : return '/busRequest/getbusByUser/';
      case 'train': return '/trainRequest/gettrainbyuserid/';
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

  bookUrl(type : string) {
    switch(type) {
      case 'flight' : return { "booking_mode": "online" };
      case 'hotel' : return {};
      case 'bus' : return {};
      case 'train': return { "booking_mode": "offline" };
    }
  }

  // getId(type : string) {
  //   const companyId: number = this.store.selectSnapshot(UserState.getcompanyId);        
  //   const userId: number = this.store.selectSnapshot(UserState.getUserId);  
  //   switch(type) {
  //     case 'flight' : return companyId;
  //     case 'hotel' : return userId;
  //     case 'bus' : return userId;
  //     case 'train': return userId;
  //   }
  // }
}
