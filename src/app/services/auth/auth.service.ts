import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, BehaviorSubject, from, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HTTP } from '@ionic-native/http/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private nativeHttp: HTTP,
    private nativeStorage: NativeStorage,
  ) {
    console.log(nativeHttp);
    this.nativeHttp.useBasicAuth('username','username');
    this.nativeHttp.setHeader("localhost", "Access-Control-Allow-Origin", '*');
    this.nativeHttp.setHeader("localhost", "Access-Control-Allow-Headers", "Content-Type");
    this.nativeHttp.setHeader("localhost", "Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    this.nativeHttp.setDataSerializer('json');
    console.log(this.nativeHttp.getBasicAuthHeader('username','username'));

  }

  login(email: string, password: string): Observable<any> {

    const login = {
      username : email,
      password : password
    }
    const header = this.nativeHttp.getHeaders("localhost");

    return from(this.nativeHttp.post(environment.baseURL + "/users/login",login,header))
      .pipe(
        map(resData => {
          const userData = JSON.parse(resData.data);
          return  userData;
        })
      );
  }

  logout() {
    const header = this.nativeHttp.getHeaders("localhost");
    return from(this.nativeHttp.post(
      environment.baseURL + "/users/logout",
      {},
      header
    ))
      .pipe(
        map(
          (logOutData) => {
            return logOutData;
          }
        )
      );
  }

  searchCity(reqCity: string) {
    let param: { [key: string]: string | string[] } = {
      "city": reqCity
    }
    const header = this.nativeHttp.getHeaders("localhost");
    return from(this.nativeHttp.get(
      environment.baseURL + "/airlines/tboairlinecities",
      param,
      header
    )).pipe(
      map(
        (resData) => {
          if (resData.status == 200) {
            const data = JSON.parse(resData.data);
            return data;
          }
        }
      )
    );
  }

}
