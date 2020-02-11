import { Injectable } from '@angular/core';
import {  HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, BehaviorSubject, from } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { User, user } from 'src/app/models/user';
import { Account } from 'src/app/models/account';
import { Booking } from 'src/app/models/booking';

import { Platform } from '@ionic/angular';
import { Android, Desktop } from 'src/app/models/platform';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _user = new BehaviorSubject<any>(null);
  _headers = new HttpHeaders().set("Access-Control-Allow-Origin",'*');

  get getUser(){
    return this._user.asObservable();
  }

  get isUserAuthenticated() {
    return this._user
    .asObservable()
    .pipe(
      map(
        (user) => {
          if (user) {
            return true;
          }
          else {
            return false;
          }
        }
      )
    );;
  }

  constructor(
    private http : HttpClient,
    private platform : Platform,
    private android : Android,
    private desktop : Desktop
  ) {
  }

  autoLogin() {
    return from(this.android.getSession())
      .pipe(
        map(
          (storedData) => {
            if(!storedData){
              return null;
            }
            else {
              return storedData;
            }
          }
        ),
        tap(
          (user) => {
            if (user) {
              this._user.next(user);
            }
          }
        ),
        map(
          (user) => {
            return !!user;
          }
        )
      )

  }

  login(userName : string,password : string) : Observable<any>{
    console.log(userName,password);
    return this.http.post<User>(environment.baseURL + "/users/login" ,  { username: userName, password: password }, {} )
      .pipe(
        map( (resData : user ) => {
                const user = new User(resData);
                  return "booking";
                })

      )
  }

  logout(){
    return this.http.post<User>(environment.baseURL + "/users/logout", {} )
      .pipe(
        map(
          (resData) => {
            return resData;
          }
        )
      );
  }
}
