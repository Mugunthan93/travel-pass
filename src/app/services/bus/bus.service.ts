import { Injectable } from '@angular/core';
import { HTTPResponse } from '@ionic-native/http/ngx';
import { from, Observable } from 'rxjs';
import { NativeHttpService } from '../http/native-http/native-http.service';
import { buspayload } from 'src/app/stores/search/bus.state';
import { seatPayload } from 'src/app/stores/result/bus.state';

@Injectable({
  providedIn: 'root'
})
export class BusService {

  constructor(
    private http : NativeHttpService
  ) { }

  searchBus(payload: buspayload): Observable<HTTPResponse> {
    return from(this.http.getfromtbo('/bus', payload));
  }

  seatLayout(payload: seatPayload): Observable<HTTPResponse> {
    let params: { [key: string]: string | string[] } = {
      'inventoryType': payload.inventoryType.toString(),
      'routeScheduleId': payload.routeScheduleId.toString(),
      'sourceCity': payload.sourceCity,
      'destinationCity': payload.destinationCity,
      'doj': payload.doj
    }
    return from(this.http.getfromtbo('/bus/e-tarvel/bus-Layout', params))
  }
}
