import { Injectable } from '@angular/core';
import { NativeHttpService } from '../http/native-http/native-http.service';
import { flightSearchPayload, metrixBoard } from 'src/app/models/search/flight';
import { HTTPResponse } from '@ionic-native/http/ngx';
import { environment } from 'src/environments/environment';
import { fareRule } from '../../stores/result/flight.state';
import { itineraryPayload } from 'src/app/components/flight/email-itinerary/email-itinerary.component';
import { sendRequest, rt_sendRequest, int_sendRequest, bookpayload, ticketpayload } from 'src/app/stores/book/flight.state';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FlightService {

  constructor(
    private http: NativeHttpService
  ) {
  }

  async metrixboard(metrixData: metrixBoard) {
    this.http.setHeader(environment.baseURL, "Content-Type", "application/json");
    this.http.setData('json');
    return await this.http.post("/metrixdashboard", metrixData);
  }

  async searchFlight(searchData: flightSearchPayload): Promise<HTTPResponse> {
    this.http.setReqTimeout(300);
    console.log(this.http.getReqTimeout());
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

  //send req by user - one-way
  async sendRequest(request: sendRequest, notify = true): Promise<HTTPResponse> {
    return await this.http.post("/airlineRequest?email_notify=" + notify, request);
  }

  //send req by user - round-trip
  async rtSendRequest(request: rt_sendRequest, notify = true): Promise<HTTPResponse> {
    return await this.http.post("/airlineRequest?email_notify=" + notify, request);
  }

  //send req by user - round-trip
  async intSendRequest(request: int_sendRequest, notify = true): Promise<HTTPResponse> {
    return await this.http.post("/airlineRequest?email_notify=" + notify, request);
  }

  async downloadTicket(pnr : string): Promise<HTTPResponse> {
    return await this.http.post("/airlines/airlineTicketing" + pnr + ".pdf", {});
  }

  bookFlight(bookpl : bookpayload) : Observable<HTTPResponse> {
    this.http.setReqTimeout(300);
    this.http.setHeader(environment.baseURL, "Content-Type", "application/json");
    this.http.setData('json');
    return from(this.http.post("/airlines/book",bookpl));
  }

  bookTicket(ticketpl : ticketpayload) {
    this.http.setReqTimeout(300);
    this.http.setHeader(environment.baseURL, "Content-Type", "application/json");
    this.http.setData('json');
    return from(this.http.post("/airlineTicket",ticketpl));
  }

  getPLB(code : string,cls : string,triptype : string) {
    console.log(code,cls,triptype);
    let plbparam = {
      "a_code" : code.toString(),
      "class" : cls.toString(),
      "type" : triptype.toString()
    }
    return from(this.http.get("/plb/getone/plbByFilter/forGST/calculation",plbparam));
  }


}
