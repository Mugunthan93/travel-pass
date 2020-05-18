import { Injectable, OnInit } from '@angular/core';
import { NativeHttpService } from '../http/native-http/native-http.service';
import { HTTPResponse } from '@ionic-native/http/ngx';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    public http : NativeHttpService
  ) {
  }

  async login(email: string, password: string) : Promise<HTTPResponse> {
    const login = {
      username : email,
      password : password
    }
    this.http.setAuth(email, password);
    return this.http.post("/users/login", login);
  }

  logout() : Promise<HTTPResponse> {
    return this.http.post("/users/logout", {});
  }

  searchCity(reqCity: string) : Promise<HTTPResponse> {
    const param: { [key: string]: string | string[] } = {
      "city": reqCity
    }
    return this.http.get("/airlines/tboairlinecities", param);
  }

}
