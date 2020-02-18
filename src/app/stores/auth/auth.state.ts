import { State, Selector, Action, StateContext } from '@ngxs/store';
import { AuthService } from 'src/app/services/auth/auth.service';
import { tap } from 'rxjs/operators';
import { user } from 'src/app/models/user';
import { AddUser, RemoveUser } from './auth.action';


@State<user>({
    name: 'auth'
})
export class AuthState {
    
    @Selector()
    static id(state: user): string | null {
      return state.id.toString();
    }
  
    @Selector()
    static isAuthenticated(state: user): boolean {
      return !!state.id;
    }
  
    constructor(private authService: AuthService) {}
  
    @Action(AddUser)
    login(ctx: StateContext<user>, action: AddUser) {
      return this.authService.login(action.payload.username,action.payload.password)
      .pipe(
        tap((auth) => {
          ctx.patchState({
              
          });
        })
      );
    }
  
    @Action(RemoveUser)
    logout(ctx: StateContext<user>) {
      const state = ctx.getState();
      return this.authService.logout().pipe(
        tap(() => {
        //   ctx.setState({});
        })
      );
    }
  }