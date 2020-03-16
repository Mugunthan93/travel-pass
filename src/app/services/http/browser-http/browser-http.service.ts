import { Injectable } from '@angular/core';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BrowserHttpService extends HttpClient {

    hostUrl : string = environment.baseURL;

    constructor(
        public httpHandler : HttpHandler
    ) {
        super(httpHandler);  
    }

    getHttp(url: string, opt: any): Observable<any>  {
        let URL = this.hostUrl + url;
        return this.get(URL,opt);
    }

    postHttp(url: string, body?: any, opt?: any) : Observable<any> {
        let URL = this.hostUrl.concat(url);
        return this.post(URL, body, opt);
    }

    putHttp(url: string, body: any, opt: any) {
        let URL = this.hostUrl.concat(url);
        return this.put(URL,body,opt);
    }

    patchHttp(url: string, body: any, opt: any) {
        let URL = this.hostUrl.concat(url);
        return this.patch(URL,body,opt);
    }

    deleteHttp(url: string, opt: any) {
        let URL = this.hostUrl.concat(url);
        return this.delete(URL,opt);
    }
}
