import { Injectable } from '@angular/core';
import { HTTP, HTTPResponse } from '@ionic-native/http/ngx';
import { environment } from 'src/environments/environment';

export interface auth{
  Authorization: string;
}

@Injectable({
  providedIn: 'root'
})
export class NativeHttpService {

  private header : any;

  constructor(
    public http : HTTP
  ) {
      this.http.setHeader(environment.baseURL, "Access-Control-Allow-Origin", '*');
      this.http.setHeader(environment.baseURL, "Access-Control-Allow-Headers", "Content-Type");
      this.http.setHeader(environment.baseURL, "Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
      this.http.setHeader(environment.baseURL, "Content-Type:", "application/json; charset=utf-8");

      this.header = this.http.getHeaders(environment.baseURL);
  }

  setAuth(username : string,password : string) : void  {
    console.log("platform ready");
    this.http.useBasicAuth(username,password);
  }

  async getAuth(username,password) : Promise<auth> {
    return this.http.getBasicAuthHeader(username, password);
  }

  async get(url: string, opt: any): Promise<HTTPResponse>  {
    return await this.http.post(environment.baseURL + url, opt, this.header);
  }

  async post(url: string, body?: any) : Promise<HTTPResponse> {
    return await this.http.post(environment.baseURL + url, body, this.header);
  }

  async put(url: string, body: any) : Promise<HTTPResponse> {
      return await this.http.put(environment.baseURL + url, body, this.header);
  }

  async patch(url: string, body: any) : Promise<HTTPResponse> {
    return await this.http.patch(environment.baseURL + url, body, this.header);
  }

  async delete(url: string, opt: any) : Promise<HTTPResponse> {
    return await this.http.delete(environment.baseURL + url, opt, this.header);
  }
}
