import { Injectable, OnInit } from '@angular/core';
import { HTTP, HTTPResponse } from '@ionic-native/http/ngx';
import { environment } from 'src/environments/environment';
import { Platform } from '@ionic/angular';

export interface options { 
  method: 'get' | 'post' | 'put' | 'patch' | 'head' | 'delete' | 'options' | 'upload' | 'download';
  data?: {
    [index: string]: any;
  };
  params?: {
    [index: string]: string | number;
  };
  serializer?: 'json' | 'urlencoded' | 'utf8' | 'multipart';
  timeout?: number;
  headers?: {
    [index: string]: string;
  };
  filePath?: string | string[];
  name?: string | string[];
  responseType?: 'text' | 'arraybuffer' | 'blob' | 'json';
}

export interface auth{
  Authorization: string;
}

@Injectable({
  providedIn: 'root'
})
export class NativeHttpService implements OnInit{

  public header : any;

  constructor(
    public platform : Platform,
    public http : HTTP
  ) {
    console.log(this.http);
  }

  async ngOnInit() {
    await this.platform.ready();
    this.http.setHeader(environment.baseURL, "Access-Control-Allow-Origin", '*');
    this.http.setHeader(environment.baseURL, "Access-Control-Allow-Headers", "Content-Type");
    this.http.setHeader(environment.baseURL, "Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    this.http.setHeader(environment.baseURL, "Content-Type", "application/json");
    this.http.setHeader(environment.baseURL, "withCredentials", "true");
  }

  setAuth(username: string, password: string): void  {
    this.header = this.http.getHeaders(environment.baseURL);
    this.http.useBasicAuth(username,password);
  }

  async getAuth(username: string,password: string) : Promise<auth> {
    return this.http.getBasicAuthHeader(username, password);
  }

  async get(url: string, opt: any): Promise<HTTPResponse>  {
    return await this.http.get(environment.baseURL + url, opt, this.header);
  }

  async post(url: string, body?: any): Promise<HTTPResponse> {
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

  setData(name){
    this.http.setDataSerializer(name);
  }

  setHeader(host: string, header: string, value: string) {
    this.http.setHeader(host,header,value);
  }

  setReqTimeout(number : number) {
    return this.http.setRequestTimeout(number);
  }

  getReqTimeout() {
    return this.http.getRequestTimeout();
  }
}
