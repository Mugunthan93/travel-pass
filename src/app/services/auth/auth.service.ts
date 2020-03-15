import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private httpService : HttpService
  ) {
  }

  // login(email: string, password: string) {

  //   const login = {
  //     username : email,
  //     password : password
  //   }

  //   this.httpService.setAuth(email,password);

  //   return this.httpService.post("/users/login",login)
  //     .pipe(
  //       map(resData => {
  //         const userData = JSON.parse(resData.data);
  //         return  userData;
  //       })
  //     );
  // }

  // logout() {

  //   return this.httpService.post(environment.baseURL + "/users/logout")
  //     .pipe(
  //       map(
  //         (logOutData) => {
  //           return logOutData;
  //         }
  //       )
  //     );
  // }

  // searchCity(reqCity: string) {

  //   const param: { [key: string]: string | string[] } = {
  //     "city": reqCity
  //   }

  //   return this.httpService.get(environment.baseURL + "/airlines/tboairlinecities", param)
  //     .pipe(
  //       map(
  //         (resData: any) => {
  //           if (resData.status == 200) {
  //             const data = JSON.parse(resData.data);
  //             return data;
  //           }
  //         }
  //       )
  //   );
  // }

}
