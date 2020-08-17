import { Injectable } from '@angular/core';
import { HTTPResponse } from '@ionic-native/http/ngx';
import { NativeHttpService } from '../http/native-http/native-http.service';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(
    private http : NativeHttpService
  ) { }

  async searchFlightCity(reqCity: string): Promise<HTTPResponse> {
    const param: { [key: string]: string | string[] } = {
      "city": reqCity
    }
    return await this.http.get("/airlines/tboairlinecities", param);
  }

  async searchHotelCity(reqCity: string): Promise<HTTPResponse> {
    const param: { [key: string]: string | string[] } = {
      "city": reqCity
    }
    return await this.http.get("/hotels/gethotelcities", param);
  }

  async getNationality(reqNationality: string): Promise<HTTPResponse> {
    const param: { [key: string]: string | string[] } = {
      "nationality": reqNationality
    }
    return await this.http.get("/hotels/getnationality", param);
  }

  async upcomingTrips(): Promise<HTTPResponse> {
    return await this.http.get("/allBookings/upcomming/trips/airline/getallTrips/list/booked/",{});
  }

  async getToken(): Promise<HTTPResponse> {
    return await this.http.get('/airlines/getToken', {});
  }

}
