import { Injectable } from '@angular/core';
import { HTTP, HTTPResponse } from '@ionic-native/http/ngx';
import { environment } from 'src/environments/environment';
import { Observable, from, of } from 'rxjs';
import { Platform } from '@ionic/angular';

export interface auth{
  Authorization: string;
}

@Injectable({
  providedIn: 'root'
})
export class NativeHttpService {

  private header : any;

  constructor(
    public platform : Platform,
    public http : HTTP
  ) {
    console.log(http);
      this.http.setHeader(environment.baseURL, "Access-Control-Allow-Origin", '*');
      this.http.setHeader(environment.baseURL, "Access-Control-Allow-Headers", "Content-Type");
      this.http.setHeader(environment.baseURL, "Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
      this.http.setHeader(environment.baseURL, "Content-Type:", "application/json; charset=utf-8");

      this.header = this.http.getHeaders(environment.baseURL);
  }

  async setAuth(username : string,password : string) : Promise<void>  {
    await this.platform.ready();
    console.log("platform ready");
    this.http.useBasicAuth(username,password);
  }

  async getAuth(username,password) : Promise<auth> {
    await this.platform.ready()
    return this.http.getBasicAuthHeader(username, password);
  }

  async get(url: string, opt: any): Promise<HTTPResponse>  {
    await this.platform.ready();
    try {
      const data = await this.http.post(environment.baseURL + url, opt, this.header);
      console.log("try success",data);
      return data;
    }
    catch (error) {
      console.log("catch error",error);
      return error;
    }
  }

  async post(url: string, body?: any) : Promise<HTTPResponse> {
    await this.platform.ready();
    try {
      const data = await this.http.post(environment.baseURL + url, body, this.header);
      console.log("try success",data);
      return data;
    }
    catch (error) {
      console.log("catch error",error);
      return error;
    }
  }

  async put(url: string, body: any) : Promise<Observable<HTTPResponse>> {
    await this.platform.ready();
    try {
      const data = await this.http.put(environment.baseURL + url, body, this.header);
      return of(data);
    }
    catch (error) {
      return of(error);
    }
  }

  async patch(url: string, body: any) : Promise<Observable<HTTPResponse>> {
    await this.platform.ready();
    try {
      const data = await this.http.patch(environment.baseURL + url, body, this.header);
      return of(data);
    }
    catch (error) {
      return of(error);
    }
  }

  async delete(url: string, opt: any) : Promise<Observable<HTTPResponse>> {
    await this.platform.ready();
    try {
      const data = await this.http.delete(environment.baseURL + url, opt, this.header);
      return of(data);
    }
    catch (error) {
      return of(error);
    }
  }
}
