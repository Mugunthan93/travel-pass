import { Injectable } from '@angular/core';
import { NativeHttpService } from '../http/native-http/native-http.service';
import { HTTPResponse } from '@ionic-native/http/ngx';
import { hotelsearchpayload, staticpayload } from 'src/app/stores/search/hotel.state';
import { environment } from 'src/environments/environment';
import { getHotelInfo, viewPayload, blockRoomPayload } from 'src/app/stores/result/hotel.state';
import { hotelRequest, offlineinvReq } from 'src/app/stores/book/hotel.state';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HotelService {

  constructor(
    private http: NativeHttpService
  ) {

  }

  getPrivateInventory(companyId : string) {
    this.http.setReqTimeout(300);
    this.http.setHeader(environment.baseURL, "Content-Type", "application/json");
    this.http.setData('json');
    return from(this.http.get( "/hotelinventory/" + companyId,{}));
  }

  searchHotel(payload: hotelsearchpayload): Observable<HTTPResponse> {
    this.http.setReqTimeout(3000);
    console.log(this.http.getReqTimeout());
    // this.http.setHeader(environment.baseURL, "Content-Type", "application/json");
    // this.http.setHeader(environment.baseURL, "Accept", "application/json, text/plain, */*");
    // this.http.setData('json');
    return from(this.http.postfromtbo("/hotels/search", payload));
  }

  getHotelInfo(hotelpayload: getHotelInfo): Observable<HTTPResponse> {
    this.http.setReqTimeout(300);
    this.http.setHeader(environment.baseURL, "Content-Type", "application/json");
    this.http.setHeader(environment.baseURL, "Accept", "application/json, text/plain, */*");
    this.http.setData('json');
    return from(this.http.postfromtbo('/hotels/getHotelInfo',hotelpayload));
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
    this.http.setReqTimeout(3000);
    console.log(this.http.getReqTimeout());
    // this.http.setHeader(environment.baseURL, "Content-Type", "application/json");
    // this.http.setHeader(environment.baseURL, "Accept", "application/json, text/plain, */*");
    // this.http.setData('json');
    return from(this.http.postfromtbo('/hotels/getStaticData',staticpay))
  }

  sendofflineInventory(offlineinv : offlineinvReq) : Observable<HTTPResponse> {
    this.http.setHeader(environment.baseURL, "Content-Type", "application/json");
    this.http.setData('json');
    return from(this.http.post('/hotelRequest?email_notify=true', offlineinv));
  }

}
