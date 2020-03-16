import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { environment } from 'src/environments/environment';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NativeHttpService {

  constructor(
    public nativeHttp: HTTP
  ) {
      this.nativeHttp.setHeader(environment.baseURL, "Acenvironment.baseURL cess-Control-Allow-Origin", '*');
      this.nativeHttp.setHeader(environment.baseURL, "Access-Control-Allow-Headers", "Content-Type");
      this.nativeHttp.setHeader(environment.baseURL, "Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
      this.nativeHttp.setHeader(environment.baseURL, "Content-Type:", "application/json; charset=utf-8");
  }

  setAuth(username,password) : void {
    this.nativeHttp.useBasicAuth(username,password);
  }

  getAuth(username,password) {
    return this.nativeHttp.getBasicAuthHeader(username, password);
  }

  get(url: string, opt: any): Observable<any>  {
      return from(this.nativeHttp.get(environment.baseURL + url, opt, this.nativeHttp.getHeaders(environment.baseURL)));
  }

  post(url: string, body?: any) : Observable<any> {
    return from(this.nativeHttp.post(environment.baseURL + url, body, this.nativeHttp.getHeaders(environment.baseURL)));
  }

  put(url: string, body: any) {
    return from(this.nativeHttp.put(environment.baseURL + url,body, this.nativeHttp.getHeaders(environment.baseURL)));
  }

  patch(url: string, body: any) {
    return from(this.nativeHttp.patch(environment.baseURL + url, body, this.nativeHttp.getHeaders(environment.baseURL)));
  }

  delete(url: string, opt: any) {
    return from(this.nativeHttp.delete(environment.baseURL + url, opt, this.nativeHttp.getHeaders(environment.baseURL)));
  }
}
