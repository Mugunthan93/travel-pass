import { Injectable } from '@angular/core';
import { NativeHttpService } from '../http/native-http/native-http.service';
import { flightSearchPayload, metrixBoard } from 'src/app/models/search/flight';
import { HTTPResponse, HTTP } from '@ionic-native/http/ngx';
import { environment } from 'src/environments/environment';
import { fareRule } from '../../stores/result/flight.state';
import { itineraryPayload } from 'src/app/components/flight/email-itinerary/email-itinerary.component';
import { sendRequest } from 'src/app/stores/book/flight.state';
import * as moment from 'moment';

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

  async sendRequest(request: sendRequest): Promise<HTTPResponse> {
    return await this.http.post("/airlineRequest?email_notify=true", request);
  }

  async myCompletedBooking(companyId: string): Promise<HTTPResponse> {
    const book = {
      "booking_mode" : "online"
    }
    console.log(moment().utc().format(), moment().utc().subtract(7, 'days').format());
    return await this.http.get("/airlineRequest/getairlinebyuserid/" + companyId + "/open/" + moment().utc().format() + "/" + moment().utc().subtract(7,'days').format() +"/0/999", book);
  }

  async myCancelledBooking(companyId: string): Promise<HTTPResponse> {
    const book = {
      "booking_mode": "online"
    }
    return await this.http.get("/airlineRequest/getairlinebyuserid/" + companyId +"/pending/2020-05-12%2000:00:01.000+00:00/2020-05-19%2023:59:59.000+00:00/0/999",book);
  }


  // list booking
  // https://api.dev.travellerspass.com/V1.0/allBookings/489

  // click approve from list
  // https://api.dev.travellerspass.com/V1.0/airlineRequest/2503?encrytkey=wMMtGeHb0WCq9oppu3n6Apvco0Bt6zaT0sJVwsSXlxM=

  // click approve from selected ticket
  // https://api.dev.travellerspass.com/V1.0/airlineRequest/2503

}
