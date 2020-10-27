import { Injectable } from '@angular/core';
import { HTTPResponse } from '@ionic-native/http/ngx';
import { NativeHttpService } from '../http/native-http/native-http.service';
import { environment } from 'src/environments/environment';
import { from, Observable } from 'rxjs';

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

  async busCity(reqCity: string): Promise<HTTPResponse> {
    this.http.setHeader(environment.baseURL, "Content-Type", "application/json");
    const param: { [key: string]: string | string[] } = {
      "city": reqCity
    }
    return await this.http.getfromtbo("/bus/getcities", param);
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

  getEligibility(companyId : number): Observable<HTTPResponse> {
    return from(this.http.get('/eligibility/' + companyId, {}));
  }

  getEligibilityByParams(companyId : number, type : string, grade : string ) : Observable<HTTPResponse> {
    return from(this.http.get('/eligibility/getByParams/' + companyId + '/' + type + '/'  + grade,{}))
  }

  getTrainStation(station: string): Observable<HTTPResponse> {
    const param: { [key: string]: string | string[] } = {
      "station_name": station
    }
    return from(this.http.get('/train/gettrainlist',param));
  }

}
