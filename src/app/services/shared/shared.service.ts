import { Injectable } from '@angular/core';
import { HTTPResponse } from '@ionic-native/http/ngx';
import { NativeHttpService } from '../http/native-http/native-http.service';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(
    private http : NativeHttpService
  ) { }

  async searchCity(reqCity: string): Promise<HTTPResponse> {
    const param: { [key: string]: string | string[] } = {
      "city": reqCity
    }
    return await this.http.get("/airlines/tboairlinecities", param);
  }
}