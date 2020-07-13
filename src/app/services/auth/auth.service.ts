import { Injectable, OnInit } from '@angular/core';
import { NativeHttpService } from '../http/native-http/native-http.service';
import { HTTPResponse } from '@ionic-native/http/ngx';
import { environment } from 'src/environments/environment';

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
    // this.http.setAuth(email, password);
    return await this.http.post("/users/login", login);
  }

  async logout() : Promise<HTTPResponse> {
    return await this.http.post("/users/logout", {});
  }

  async forgotPassword(email: string): Promise<HTTPResponse> {
    // this.http.setHeader(environment.baseURL, "Content-Type", "application/json");
    // this.http.setData('json');
    return await this.http.post("/users",email);
  }

  async newPassword(token: string,password : string): Promise<HTTPResponse> {
    return await this.http.post("/users/userpassword/resetpassword/"+token,{password : password});
  }

}
