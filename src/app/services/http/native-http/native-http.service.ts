import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { environment } from 'src/environments/environment';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NativeHttpService extends HTTP {

  constructor(
  ) {
    super();
      this.setHeader(environment.baseURL, "Acenvironment.baseURL cess-Control-Allow-Origin", '*');
      this.setHeader(environment.baseURL, "Access-Control-Allow-Headers", "Content-Type");
      this.setHeader(environment.baseURL, "Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
      this.setHeader(environment.baseURL, "Content-Type:", "application/json; charset=utf-8");
  }

  setAuth(username,password) : void {
    this.useBasicAuth(username,password);
  }

  getAuth(username,password) {
    return this.getBasicAuthHeader(username, password);
  }

  getHTTP(url: string, opt: any): Observable<any>  {
      return from(this.get(environment.baseURL + url, opt, this.getHeaders(environment.baseURL)));
  }

  postHTTP(url: string, body?: any) : Observable<any> {
    return from(this.post(environment.baseURL + url, body, this.getHeaders(environment.baseURL)));
  }

  putHTTP(url: string, body: any) {
    return from(this.put(environment.baseURL + url,body, this.getHeaders(environment.baseURL)));
  }

  patchHTTP(url: string, body: any) {
    return from(this.patch(environment.baseURL + url, body, this.getHeaders(environment.baseURL)));
  }

  deleteHTTP(url: string, opt: any) {
    return from(this.delete(environment.baseURL + url, opt, this.getHeaders(environment.baseURL)));
  }
}
