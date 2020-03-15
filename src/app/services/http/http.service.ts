import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { HTTP } from '@ionic-native/http/ngx';
import { environment } from 'src/environments/environment';
import { from, Observable } from 'rxjs';

export interface AuthObj {
  username: string,
  password:string
}

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    public http : any
  ) {
    console.log(http);
    // this.platform.ready().then(
    //   () => {
    //     this.nativeHttp.setHeader(environment.baseURL, "Acenvironment.baseURL cess-Control-Allow-Origin", '*');
    //     this.nativeHttp.setHeader(environment.baseURL, "Access-Control-Allow-Headers", "Content-Type");
    //     this.nativeHttp.setHeader(environment.baseURL, "Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    //     this.nativeHttp.setHeader(environment.baseURL, "Content-Type:", "application/json; charset=utf-8");
    //   }
    // );
    
  }

  // setAuth(username,password) : void {
  //   this.nativeHttp.useBasicAuth(username,password);
  // }

  // getAuth(authObj: AuthObj) {
  //   return this.nativeHttp.getBasicAuthHeader(authObj.username, authObj.username).Authorization;
  // }

  // get(url: string, opt?: any): Observable<any>  {
  //   if (this.platform.is("desktop") || this.platform.is("mobile")) {
  //     return this.browserHttp.get(environment.baseURL + url, opt);
  //   }
  //   else if (this.platform.is("android")) {
  //     return from(this.nativeHttp.get(environment.baseURL + url, opt, this.nativeHttp.getHeaders(environment.baseURL)));
  //   }
  // }

  // post(url: string, body?: any, opt?: any) : Observable<any> {
  //   if (this.platform.is("desktop") || this.platform.is("mobile")) {
  //     return this.browserHttp.post(environment.baseURL + url, body, opt);
  //   }
  //   else if (this.platform.is("android")) {
  //     return from(this.nativeHttp.post(environment.baseURL + url, body, this.nativeHttp.getHeaders(environment.baseURL)));
  //   }
  // }

  // put(url: string, body: any, opt?: any) {
  //   if (this.platform.is("desktop") || this.platform.is("mobile")) {
  //     return this.browserHttp.put(environment.baseURL + url,body,opt);
  //   }
  //   else if (this.platform.is("android")) {
  //     return from(this.nativeHttp.put(environment.baseURL + url,body, this.nativeHttp.getHeaders(environment.baseURL)));
  //   }
  // }

  // patch(url: string, body: any, opt?: any) {
  //   if (this.platform.is("desktop") || this.platform.is("mobile")) {
  //     return this.browserHttp.patch(environment.baseURL + url,body,opt);
  //   }
  //   else if (this.platform.is("android")) {
  //     return from(this.nativeHttp.patch(environment.baseURL + url, body, this.nativeHttp.getHeaders(environment.baseURL)));
  //   }
  // }

  // delete(url: string, opt?: any) {
  //   if (this.platform.is("desktop") || this.platform.is("mobile")) {
  //     return this.browserHttp.delete(environment.baseURL + url,opt);
  //   }
  //   else if (this.platform.is("android")) {
  //     return from(this.nativeHttp.delete(environment.baseURL + url, opt, this.nativeHttp.getHeaders(environment.baseURL)));
  //   }
  // }




}
