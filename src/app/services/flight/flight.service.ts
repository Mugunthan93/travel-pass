import { Injectable } from '@angular/core';
import { NativeHttpService } from '../http/native-http/native-http.service';
import { flightSearchPayload, metrixBoard } from 'src/app/models/search/flight';
import { HTTPResponse, HTTP } from '@ionic-native/http/ngx';
import { environment } from 'src/environments/environment';
import { fareRule } from '../../stores/result/flight.state';
import { itineraryPayload } from 'src/app/components/flight/email-itinerary/email-itinerary.component';

@Injectable({
  providedIn: 'root'
})
export class FlightService {

  constructor(
    private http: NativeHttpService
  ) { }
  
  async metrixboard(metrixData: metrixBoard) {
    return await this.http.post("/metrixdashboard", metrixData);
  }

  async searchFlight(searchData: flightSearchPayload): Promise<HTTPResponse> {
    this.http.setHeader(environment.baseURL, "Content-Type", "application/json");
    this.http.setData('json');
    return await this.http.post("/airlines/search", searchData);
  }

  async fairRule(fareRule: fareRule): Promise<HTTPResponse> {
    return await this.http.post("/airlines/airlineFareRule", fareRule);
  }

  async emailItinerary(itinerary: itineraryPayload): Promise<HTTPResponse> {
    return await this.http.post("/emailTemplate/", itinerary);
  }

  async agencyBalance(): Promise<HTTPResponse> {
    return await this.http.get("/airlines/agencyBalance",{});
  }

  async fairQuote(trace : fareRule): Promise<HTTPResponse> {
    return await this.http.post("/airlines/airlineFareQuote", trace);
  }

  async SSR(trace: fareRule): Promise<HTTPResponse> {
    return await this.http.post("/airlines/airlineSSR", trace);
  }

}
