import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { NativeHttpService } from '../http/native-http/native-http.service';
import { Platform } from '@ionic/angular';
import { Observable, from } from 'rxjs';
import { HTTP } from '@ionic-native/http/ngx';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    public platform : Platform,
    private http : HTTP
  ) {
    console.log(this.http);
    this.http.setHeader(environment.baseURL, "Acenvironment.baseURL cess-Control-Allow-Origin", '*');
    this.http.setHeader(environment.baseURL, "Access-Control-Allow-Headers", "Content-Type");
    this.http.setHeader(environment.baseURL, "Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    this.http.setHeader(environment.baseURL, "Content-Type:", "application/json; charset=utf-8");
  }

  async login(email: string, password: string) : Promise<Observable<any>>{

    const login = {
      username : email,
      password : password
    }
    return this.platform.ready().then(
      () => {
      this.http.useBasicAuth(email, password);
        return this.http.post(environment.baseURL + "/users/login", login, this.http.getHeaders(environment.baseURL))
          .then()
      }
    )
  }

  logout() {

    return from(this.platform.ready())
      .pipe(
        tap(
          () => {
            return this.http.post(environment.baseURL + "/users/logout", {}, this.http.getHeaders(environment.baseURL))
          }),
        map(
          (logOutData) => {
            return logOutData;
          }
        )
      );
  }

  searchCity(reqCity: string) {

    const param: { [key: string]: string | string[] } = {
      "city": reqCity
    }

    return from(this.platform.ready())
      .pipe(
        tap(
          () => {
            return this.http.get(environment.baseURL + "/airlines/tboairlinecities", param, this.http.getHeaders(environment.baseURL));
          }),
        map(
          (resData: any) => {
            if (resData.status == 200) {
              const data = JSON.parse(resData.data);
              return data;
            }
          }
        ));
  }

}
