import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, CanLoad, Route, UrlSegment, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { AuthState, Logout } from 'src/app/stores/auth.state';
import { Navigate } from '@ngxs/router-plugin';
import { UserState } from 'src/app/stores/user.state';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate  {

  constructor(
    private store : Store
  ) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const isAuth = !!this.store.selectSnapshot(UserState.isUserAuthenticated);
    if(isAuth){
      console.log(isAuth);
      return true;
    }
    else {
      this.store.dispatch(new Logout());
    }
  }

  
}
