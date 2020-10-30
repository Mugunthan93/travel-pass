import { Injectable } from '@angular/core';
import { HTTPResponse } from '@ionic-native/http/ngx';
import { from, Observable } from 'rxjs';
import { NativeHttpService } from '../http/native-http/native-http.service';
import * as moment from 'moment';
import { flightexpensepayload, trippayload } from 'src/app/stores/expense.state';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  constructor(
    private http : NativeHttpService
  ) { }


  getTripList(userId : number,startDate : moment.Moment,endDate : moment.Moment) : Observable<HTTPResponse> {
    let start = startDate.format('YYYY-MM-DD%2000:00:00.000+00:00');
    let end = endDate.format('YYYY-MM-DD%2000:00:00.000+00:00')
    return from(this.http.get('/trip/getAllTripsByUser/GetbyUser/' + end + '/' + start + '/' + userId.toString(), {}));
  }

  getExpenseList(tripId : number) : Observable<HTTPResponse> {
    return from(this.http.get('/tripexpense/trip/' + tripId.toString(), {}));
  }

  airlineTrips(userId : number,startDate : moment.Moment,endDate : moment.Moment) : Observable<HTTPResponse> {
    let start = startDate.format('YYYY-MM-DD%2000:00:00.000+00:00');
    let end = endDate.format('YYYY-MM-DD%2000:00:00.000+00:00');
    return from(this.http.get('/airlineRequest/expense/getbyTravelDate/booked/' + userId.toString() + '/' + end + '/' + start + '/0/1000',{}));
  }

  getProjectList(companyId : number): Observable<HTTPResponse> {
    return from(this.http.get('/project/get_by_customerId/' + companyId.toString(),{}));
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
    this.http.setHeader(environment.baseURL, "Content-Type", "application/json");
    this.http.setData('json');
    return from(this.http.post("/tripexpense/create", flightPayload));
  }
}
