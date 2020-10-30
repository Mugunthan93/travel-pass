import { Injectable } from '@angular/core';
import { HTTPResponse } from '@ionic-native/http/ngx';
import { NativeHttpService } from '../http/native-http/native-http.service';
import { environment } from 'src/environments/environment';
import { from, Observable } from 'rxjs';
import { trippayload, flightexpensepayload } from 'src/app/stores/dashboard.state';

@Injectable({
  providedIn: "root",
})
export class SharedService {
  constructor(private http: NativeHttpService) {}

  async searchFlightCity(reqCity: string): Promise<HTTPResponse> {
    const param: { [key: string]: string | string[] } = {
      city: reqCity,
    };
    return await this.http.get("/airlines/tboairlinecities", param);
  }

  async searchHotelCity(reqCity: string): Promise<HTTPResponse> {
    const param: { [key: string]: string | string[] } = {
      city: reqCity,
    };
    return await this.http.get("/hotels/gethotelcities", param);
  }

  async busCity(reqCity: string): Promise<HTTPResponse> {
    this.http.setHeader(
      environment.baseURL,
      "Content-Type",
      "application/json"
    );
    const param: { [key: string]: string | string[] } = {
      city: reqCity,
    };
    return await this.http.getfromtbo("/bus/getcities", param);
  }

  async getNationality(reqNationality: string): Promise<HTTPResponse> {
    const param: { [key: string]: string | string[] } = {
      nationality: reqNationality,
    };
    return await this.http.get("/hotels/getnationality", param);
  }

  async upcomingTrips(): Promise<HTTPResponse> {
    return await this.http.get(
      "/allBookings/upcomming/trips/airline/getallTrips/list/booked/",
      {}
    );
  }

  async getToken(): Promise<HTTPResponse> {
    return await this.http.get("/airlines/getToken", {});
  }

  getEligibility(companyId: number): Observable<HTTPResponse> {
    return from(this.http.get("/eligibility/" + companyId, {}));
  }

  getTrainStation(station: string): Observable<HTTPResponse> {
    const param: { [key: string]: string | string[] } = {
      station_name: station,
    };
    return from(this.http.get("/train/gettrainlist", param));
  }

  getProjectList(companyId: number): Observable<HTTPResponse> {
    return from(
      this.http.get("/project/get_by_customerId/" + companyId.toString(), {})
    );
  }

  createTrip(payload: trippayload): Observable<HTTPResponse> {
    return from(this.http.post("/trip/create", payload));
  }

  getTrip(tripId: number): Observable<HTTPResponse> {
    return from(this.http.get("/trip/" + tripId.toString(), {}));
  }

  editTrip(tripId: number, payload: trippayload): Observable<HTTPResponse> {
    return from(this.http.put("/trip/" + tripId.toString(), payload));
  }

  createExpense(flightPayload: flightexpensepayload): Observable<HTTPResponse> {
    return from(this.http.post("/tripexpense/create", flightPayload));
  }

  GetFlightTrip(start: string, end: string) {
    return from(
      this.http.get(
        "/airlineRequest/expense/getbyTravelDate/booked/473/" +
          start +
          "/" +
          end +
          "/0/1000",
        {}
      )
    );
  }
}
