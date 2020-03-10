import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { environment } from 'src/environments/environment';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NativeHttpService {

  private header = null;

  constructor(
    public nativeHttp : HTTP
  ) {
  }

  set setHeader(header : string) {
    this.header = header;
  }

  get getHeader() {
    return this.header;
  }

  get(url,param){
    return from(this.nativeHttp.get(environment.baseURL + url, param, this.getHeader));
  }

  post(url,body) {
    return from(this.nativeHttp.post(environment.baseURL + url, body, this.getHeader))
  }

  put(url,body) {
    return from(this.nativeHttp.put(environment.baseURL + url, body, this.getHeader))
  }

  patch(url,body) {
    return from(this.nativeHttp.patch(environment.baseURL + url, body, this.getHeader))
  }

  delete(url,param) {
    return from(this.nativeHttp.delete(environment.baseURL + url, param, this.getHeader))
  }


}
