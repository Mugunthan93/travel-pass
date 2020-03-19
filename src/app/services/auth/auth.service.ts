import { Injectable } from '@angular/core';
import { NativeHttpService } from '../http/native-http/native-http.service';
import { HTTPResponse, HTTP } from '@ionic-native/http/ngx';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends NativeHttpService {

  constructor(
    public platform:Platform,
    public http : HTTP
  ) {
    super(platform,http);
  }

  login(email: string, password: string) : Promise<HTTPResponse> {
    const login = {
      username : email,
      password : password
    }
      this.setAuth(email, password);
      return this.post("/users/login", login);
  }

  logout() : Promise<HTTPResponse> {
      return this.post("/users/logout");
  }

  searchCity(reqCity: string) : Promise<HTTPResponse> {
    const param: { [key: string]: string | string[] } = {
      "city": reqCity
    }
    return this.get("/airlines/tboairlinecities", param);
  }

}
