import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate } from '@angular/router';
import { combineLatest, iif, Observable, of } from 'rxjs';
import { Store } from '@ngxs/store';
import { AuthState, Logout } from 'src/app/stores/auth.state';
import { UserState } from 'src/app/stores/user.state';
import { delayWhen, flatMap, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate  {

  constructor(
    private store : Store
  ) {

  }

  canActivate(): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    
    const isAuth = !!sessionStorage.getItem('session');
    if(isAuth) {
      return true;
    }
    else {
      this.store.dispatch(new Logout());
    }
  }

  
}
