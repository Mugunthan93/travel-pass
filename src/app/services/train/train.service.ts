import { Injectable } from '@angular/core';
import { HTTPResponse } from '@ionic-native/http/ngx';
import { Observable, from } from 'rxjs';
import { train_oneway_request } from 'src/app/stores/book/train/one-way.state';
import { environment } from 'src/environments/environment';
import { NativeHttpService } from '../http/native-http/native-http.service';

@Injectable({
  providedIn: 'root'
})
export class TrainService {

  constructor(
    private http : NativeHttpService
  ) { }

  sendRequest(req : train_oneway_request) : Observable<HTTPResponse> {
    this.http.setHeader(environment.baseURL, "Content-Type", "application/json");
    this.http.setData('json');
    return from(this.http.post('/trainRequest',req));
  }
}
