import { Injectable } from '@angular/core';
import { NativeHttpService } from '../http/native-http/native-http.service';
import { flightSearchPayload, metrixBoard } from 'src/app/models/search/flight';
import { HTTPResponse } from '@ionic-native/http/ngx';
import { environment } from 'src/environments/environment';
import { fareRule } from '../../stores/result/flight.state';
import { itineraryPayload } from 'src/app/components/flight/email-itinerary/email-itinerary.component';
import { sendRequest, rt_sendRequest, int_sendRequest } from 'src/app/stores/book/flight.state';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class FlightService {

  constructor(
    private http: NativeHttpService
  ) {
  }
  
  async metrixboard(metrixData: metrixBoard) {
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
  async sendRequest(request: sendRequest): Promise<HTTPResponse> {
    return await this.http.post("/airlineRequest?email_notify=true", request);
  }

  //send req by user - round-trip
  async rtSendRequest(request: rt_sendRequest): Promise<HTTPResponse> {
    return await this.http.post("/airlineRequest?email_notify=true", request);
  }

  //send req by user - round-trip
  async intSendRequest(request: int_sendRequest): Promise<HTTPResponse> {
    return await this.http.post("/airlineRequest?email_notify=true", request);
  }

  //get ticket by manager from approval request list 
  async getReqTicket(ticketId: string): Promise<HTTPResponse> {
    const encrytkey = {
      "encrytkey": "wMMtGeHb0WCq9oppu3n6Apvco0Bt6zaT0sJVwsSXlxM="
    }
    return await this.http.get("/airlineRequest/" + ticketId, encrytkey);
  }

  //approve the request
  async approvalReq(ticketId : string, requestBody : any ): Promise<HTTPResponse> {
    return await this.http.put("/airlineRequest/" + ticketId, requestBody);
  }

  //my booking - new
  async openBooking(userId: number): Promise<HTTPResponse> {
    
    const startDate = moment().format('YYYY-MM-DD%2023:59:59.000+00:00');
    const endDate = moment().subtract(7, "days").format('YYYY-MM-DD%2000:00:01.000+00:00'); 
    const book = {
      "booking_mode": "online"
    }
    
    return await this.http.get("/airlineRequest/getairlinebyuserid/" + userId.toString() + "/open/" + endDate + "/" + startDate + "/0/999", book);
  }

  //my booking - new, history
  async pendingBooking(userId: number): Promise<HTTPResponse> {

    const startDate = moment().format('YYYY-MM-DD%2023:59:59.000+00:00');
    const endDate = moment().subtract(7, "days").format('YYYY-MM-DD%2000:00:01.000+00:00'); 
    const book = {
      "booking_mode": "online"
    }

    return await this.http.get("/airlineRequest/getairlinebyuserid/" + userId.toString() + "/pending/" + endDate + "/" + startDate + "/0/999", book);
  }

  async bookedBooking(userId: number): Promise<HTTPResponse> {

    const startDate = moment().format('YYYY-MM-DD%2023:59:59.000+00:00');
    const endDate = moment().subtract(7, "days").format('YYYY-MM-DD%2000:00:01.000+00:00');
    const book = {
      "booking_mode": "online"
    }

    return await this.http.get("/airlineRequest/getairlinebyuserid/" + userId.toString() + "/booked/" + endDate + "/" + startDate + "/0/999", book);
  }

  async rejBooking(userId: number): Promise<HTTPResponse> {

    const startDate = moment().format('YYYY-MM-DD%2023:59:59.000+00:00');
    const endDate = moment().subtract(7, "days").format('YYYY-MM-DD%2000:00:01.000+00:00');
    const book = {
      "booking_mode": "online"
    }

    return await this.http.get("/airlineRequest/getairlinebyuserid/" + userId.toString() + "/rej/" + endDate + "/" + startDate + "/0/999", book);
  }

  // approver reqest list
  async approvalReqList(userId: number): Promise<HTTPResponse> {
    return await this.http.get("/allBookings/" + userId, {});
  }

  async downloadTicket(pnr : string, filePath : string): Promise<HTTPResponse> {
    return await this.http.post("/airlines/airlineTicketing" + pnr + ".pdf", {});
  }
}