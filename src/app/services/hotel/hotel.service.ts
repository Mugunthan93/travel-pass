import { Injectable } from '@angular/core';
import { NativeHttpService } from '../http/native-http/native-http.service';
import { HTTPResponse } from '@ionic-native/http/ngx';
import { hotelsearchpayload } from 'src/app/stores/search/hotel.state';

@Injectable({
  providedIn: 'root'
})
export class HotelService {

  constructor(
    private http: NativeHttpService
  ) { }

  async searchHotel(payload: hotelsearchpayload): Promise<HTTPResponse> {
    return await this.http.post("/hotels/search",payload)
  }

}
