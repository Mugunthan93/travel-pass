import { Injectable } from '@angular/core';
import { HTTPResponse } from '@ionic-native/http/ngx';
import { Observable, from } from 'rxjs';
import { train_oneway_request } from 'src/app/stores/book/train/one-way.state';
import { NativeHttpService } from '../http/native-http/native-http.service';

@Injectable({
  providedIn: 'root'
})
export class TrainService {

  constructor(
    private http : NativeHttpService
  ) { }

  sendRequest(req : train_oneway_request) : Observable<HTTPResponse> {
    return from(this.http.post('/trainRequest',req));
  }
}
