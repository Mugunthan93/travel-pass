import { Injectable } from '@angular/core';
import { NativeHttpService } from '../http/native-http/native-http.service';
import { HTTPResponse } from '@ionic-native/http/ngx';
import { hotelsearchpayload, staticpayload } from 'src/app/stores/search/hotel.state';
import { environment } from 'src/environments/environment';
import { getHotelInfo, viewPayload, blockRoomPayload } from 'src/app/stores/result/hotel.state';
import { hotelRequest } from 'src/app/stores/book/hotel.state';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HotelService {

  constructor(
    private http: NativeHttpService
  ) {
  }
  
  searchHotel(payload: hotelsearchpayload): Observable<HTTPResponse> {
    this.http.setReqTimeout(300);
    console.log(this.http.getReqTimeout());
    this.http.setHeader(environment.baseURL, "Content-Type", "application/json");
    this.http.setData('json');
    return from(this.http.post("/hotels/search", payload));
  }

  async getHotelInfo(hotelpayload: getHotelInfo): Promise<HTTPResponse> {
    this.http.setReqTimeout(300);
    this.http.setHeader(environment.baseURL, "Content-Type", "application/json");
    this.http.setData('json');
    return await this.http.post('/hotels/getHotelInfo',hotelpayload);
  }

  viewHotel(viewpayload: viewPayload): Observable<HTTPResponse> {
    this.http.setReqTimeout(300);
    this.http.setHeader(environment.baseURL, "Content-Type", "application/json");
    this.http.setData('json');
    return from(this.http.post('/hotels/getHotelRoom',viewpayload));
  }

  async blockHotel(blockpayload: blockRoomPayload): Promise<HTTPResponse> {
    this.http.setReqTimeout(300);
    this.http.setHeader(environment.baseURL, "Content-Type", "application/json");
    this.http.setData('json');
    return await this.http.post('/hotels/blockRoom', blockpayload);
  }

  async sendRequest(hotelRequest: hotelRequest): Promise<HTTPResponse>  {
    this.http.setReqTimeout(300);
    this.http.setHeader(environment.baseURL, "Content-Type", "application/json");
    this.http.setData('json');
    return await this.http.post('/hotelRequest?email_notify=true', hotelRequest);
  }

  getStaticData(staticpay: staticpayload): Observable<HTTPResponse> {
    this.http.setHeader(environment.baseURL, "Content-Type", "application/json");
    this.http.setData('json');
    return from(this.http.post('/hotels/getStaticData/',staticpay))
  }

}
