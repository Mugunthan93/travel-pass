import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, CanLoad, Route, UrlSegment, Router } from '@angular/router';
import { Observable, pipe, of } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { take, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad, CanActivate  {

  constructor(
    private authService : AuthService,
    private router : Router
  ) {

  }


  canLoad(route: Route, segments: UrlSegment[]): boolean | Observable<boolean> | Promise<boolean> {

    return true;
    // return this.authService.isUserAuthenticated
    //   .pipe(
    //     take(1),
    //     switchMap(
    //       (isAuth) => {
    //         if(!isAuth){
    //           return this.authService.autoLogin();
    //         }
    //         else{
    //           return of(isAuth);
    //         }
    //       }
    //     ),
    //     tap(
    //       (isAuthenticated) => {
    //         console.log(isAuthenticated);
    //         if(!isAuthenticated){
    //           this.router.navigate(["/login"]);
    //         }
    //       }
    //     )
    //   );
  }  
  
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return true;
  }

  
}
