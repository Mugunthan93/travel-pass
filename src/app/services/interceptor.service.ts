import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor  {

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log(req,next);
    const _header = req.clone({
        headers :new HttpHeaders({
            "Access-Control-Allow-Origin":'*',
            "Access-Control-Allow-Headers":"Content-Type",
            "Access-Control-Allow-Methods":"GET, POST, OPTIONS, PUT, PATCH, DELETE"
        })
      });
      console.log(_header);
    return next.handle(_header);
  }
}
