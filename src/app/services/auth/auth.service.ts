import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { NativeHttpService } from '../http/native-http/native-http.service';
import { BrowserHttpService } from '../http/browser-http/browser-http.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private httpService : BrowserHttpService
  ) {
    console.log(this.httpService);
  }

  login(email: string, password: string) {

    const login = {
      username : email,
      password : password
    }

    if(this.httpService instanceof NativeHttpService){
      this.httpService.setAuth(email,password);
    }

    return this.httpService.postHttp("/users/login",login)
      .pipe(
        map(resData => {
          return  resData;
        })
      );
  }

  logout() {

    return this.httpService.postHttp("/users/logout")
      .pipe(
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

    return this.httpService.getHttp("/airlines/tboairlinecities", param)
      .pipe(
        map(
          (resData: any) => {
            if (resData.status == 200) {
              const data = JSON.parse(resData.data);
              return data;
            }
          }
        )
    );
  }

}
