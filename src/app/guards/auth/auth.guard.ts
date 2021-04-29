import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, CanActivateChild, Router } from '@angular/router';
import { combineLatest, iif, Observable, of } from 'rxjs';
import { Store } from '@ngxs/store';
import { AuthState, Logout } from 'src/app/stores/auth.state';
import { UserState } from 'src/app/stores/user.state';
import { delayWhen, flatMap, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { user } from 'src/app/models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate  {

  constructor(
    private store : Store,
    private router : Router
  ) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

    console.log(next,state);

    return this.store.select(UserState.getUser)
      .pipe(
        withLatestFrom(of(JSON.parse(sessionStorage.getItem('session')) as user)),
        flatMap(
          (usr : user[]) => {
            console.log(usr);
            let local = usr[0];
            let session = usr[1];

            if(session !== null) {
              return of(true);
            }
            else {
              this.store.dispatch(new Logout());
              return of(false);
            }

          }
        )
      );
  }


}
