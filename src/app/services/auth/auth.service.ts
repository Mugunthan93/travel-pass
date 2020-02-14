import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, BehaviorSubject, from, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HTTP } from '@ionic-native/http/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { User } from 'src/app/models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private _user = new BehaviorSubject<any>(null);
  
  set setUser(data){
    this.nativeStorage.setItem('user',data)
      .then(
        () => {
          return {
            status : true,
            message : "user data stored in native storage"
          }
        }
        );
      }
      
  get getUser(){
    return this._user.asObservable();
  }
  
  get retrieveUser(){
    return from(this.nativeStorage.getItem('user'))
      .pipe(
        map((resData) => {
          this._user.next(resData);
          return {
            status : true,
            message : "user data retrieved from native storage"
          }
        })
      );
  }
  
  removeUser(){
    return from(this.nativeStorage.remove('user'))
      .pipe(
        map(() => {
          this._user.next(null);
          return {
            status : true,
            message : "user data removed from nataive storage"
          }
        })
      );
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
    );
  }

  constructor(
    private nativeHttp : HTTP,
    private nativeStorage : NativeStorage
  ) {
    console.log(nativeHttp);
    this.nativeHttp.setHeader("localhost","Access-Control-Allow-Origin",'*');
    this.nativeHttp.setHeader("localhost", "Access-Control-Allow-Headers","Content-Type");
    this.nativeHttp.setHeader("localhost","Access-Control-Allow-Methods","GET, POST, OPTIONS, PUT, PATCH, DELETE");
    this.nativeHttp.setDataSerializer('json');
  }

  login(userName : string,password : string) : Observable<any>{
    const header = this.nativeHttp.getHeaders("localhost");
    return from(this.nativeHttp.post(
      environment.baseURL + "/users/login" ,
      { username: userName, password: password },
      header
    ))
    .pipe(
      map( resData => {
          const userData = JSON.parse(resData.data);
          this.setUser = userData;
          const userObject = new User(userData); 
          this._user.next(userObject);
          console.log(userData);
          return true;
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
        (resData) => {
          this.removeUser().subscribe(
            (result) => {
              if(result.status == true){
                return resData;
              }
            }
          );
        }
      )
    );
  }

  searchCity(reqCity : string) {
    let param :  {[key: string]: string | string[]} = {
      "city" : reqCity
    }
    const header = this.nativeHttp.getHeaders("localhost");
    return from(this.nativeHttp.get(
      environment.baseURL + "/airlines/tboairlinecities",
      param,
      header
    )).pipe(
      map(
        (resData) => {
          if(resData.status == 200){
            const data = JSON.parse(resData.data);
            return data;
          }
        }
      )
    );
  }

}
