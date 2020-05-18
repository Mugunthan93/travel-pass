import { Injectable, OnInit } from '@angular/core';
import { HTTP, HTTPResponse } from '@ionic-native/http/ngx';
import { environment } from 'src/environments/environment';
import { Platform } from '@ionic/angular';

export interface auth{
  Authorization: string;
}

@Injectable({
  providedIn: 'root'
})
export class NativeHttpService implements OnInit{

  private header : any;

  constructor(
    public platform : Platform,
    public http : HTTP
  ) {
    console.log(http);
  }

  async ngOnInit() {
    await this.platform.ready();
    this.http.setHeader(environment.baseURL, "Access-Control-Allow-Origin", '*');
    this.http.setHeader(environment.baseURL, "Access-Control-Allow-Headers", "Content-Type");
    this.http.setHeader(environment.baseURL, "Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    this.http.setHeader(environment.baseURL, "Content-Type", "application/x-www-form-urlencoded");
    this.http.setHeader(environment.baseURL, "Content-Type", "application/json");
    this.http.setHeader(environment.baseURL, "withCredentials", "true");
    this.http.setDataSerializer('json');
  }

  setAuth(username: string, password: string): void  {
    this.header = this.http.getHeaders(environment.baseURL);
    this.http.useBasicAuth(username,password);
  }

  async getAuth(username,password) : Promise<auth> {
    return this.http.getBasicAuthHeader(username, password);
  }

  async get(url: string, opt: any): Promise<HTTPResponse>  {
    return await this.http.get(environment.baseURL + url, opt, this.header);
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

  async setCookie(url : string,session : any) {
    return await this.http.setCookie(url, session);
  }

  async  getCookie(url) {
    return await this.http.getCookieString(url);
  }
}
