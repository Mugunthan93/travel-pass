import { HTTP } from '@ionic-native/http/ngx';
import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { from } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

export class Platforms {

    protected platform: Platform;
    private http : any;

    platforms : string[];

    constructor(
    ){
       this.platforms = this.platform.platforms();
       this.platforms.forEach(
           (platform) => {
            switch(platform){
                case "desktop":
                    this.http = new BrowserHttp();
                    break;
                case "android":
                    this.http = new NativeHttp();
                    break;
            }
           }
       );
    }

}

export class BrowserHttp extends HttpClient {

    header : HttpHeaders;

    constructor(){
        let httpHandler : HttpHandler;
        super(httpHandler);
        this.header = new HttpHeaders({
            "Access-Control-Allow-Origin":'*',
            "Access-Control-Allow-Headers":"Content-Type",
            "Access-Control-Allow-Methods":"GET, POST, OPTIONS, PUT, PATCH, DELETE"
        });
    }

    login(data) {
        return from(
            this.post(environment.baseURL + "/users/login",data)
            )
            .pipe(
                map(
                    (resData) => {
                        return resData;
                    }
                )
            );
    }

    logout(){
        return from(
            this.post(environment.baseURL + "/users/logout",{})
            )
            .pipe(
                map(
                    (resData) => {
                        return resData;
                    }
                )
            );
    }

}

export class NativeHttp extends HTTP {

    constructor(){
        super();
        this.setHeader("localhost","Access-Control-Allow-Origin",'*');
        this.setHeader("localhost", "Access-Control-Allow-Headers","Content-Type");
        this.setHeader("localhost","Access-Control-Allow-Methods","GET, POST, OPTIONS, PUT, PATCH, DELETE");
    }

    get headers(){
        return this.getHeaders("localhost");
    }

    login(data) {
        return from(
            this.post(environment.baseURL + "/users/login",data,this.headers)
            )
            .pipe(
                map(
                    (resData) => {
                        return resData;
                    }
                )
            );
    }

    logout(){
        return from(
            this.get(environment.baseURL + "/users/logout",{},this.headers)
            )
            .pipe(
                map(
                    (resData) => {
                        return resData;
                    }
                )
            );
    }

}