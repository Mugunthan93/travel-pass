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
    // this.http.setAuth(email, password);
    return this.http.post("/users/login", login);
  }

  logout() : Promise<HTTPResponse> {
    return this.http.post("/users/logout", {});
  }

  async forgotPassword(email : string): Promise<HTTPResponse> {
    return this.http.post("/users",{email : email});
  }

  async newPassword(token: string,password : string): Promise<HTTPResponse> {
    return this.http.post("/users/userpassword/resetpassword/"+token,{password : password});
  }

}
