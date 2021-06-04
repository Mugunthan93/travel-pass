import { Injectable } from '@angular/core';
import { HTTPResponse } from '@ionic-native/http/ngx';
import { from, Observable } from 'rxjs';
import { cabrequest } from 'src/app/stores/search/cab.state';
import { environment } from 'src/environments/environment';
import { NativeHttpService } from '../http/native-http/native-http.service';

@Injectable({
  providedIn: 'root'
})
export class CabService {

  constructor(
    private http: NativeHttpService
  ) { }

  offlineRequest(rqst : cabrequest, notify = true) : Observable<HTTPResponse> {
    this.http.setReqTimeout(300);
    console.log(this.http.getReqTimeout());
    this.http.setHeader(environment.baseURL, "Content-Type", "application/json");
    this.http.setData('json');
    return from(this.http.post("/cabrequest?email_notify=" + notify, rqst));
  }

}
