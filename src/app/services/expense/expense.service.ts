import { Injectable } from '@angular/core';
import { HTTPResponse } from '@ionic-native/http/ngx';
import { from, Observable } from 'rxjs';
import { NativeHttpService } from '../http/native-http/native-http.service';
import * as moment from 'moment';

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
}
