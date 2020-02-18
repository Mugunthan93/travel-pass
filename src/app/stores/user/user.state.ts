import { State, Selector, Action, StateContext } from '@ngxs/store';
import { AuthService } from 'src/app/services/auth/auth.service';
import { tap } from 'rxjs/operators';
import { AddUser, RemoveUser } from './user.action';
import { currentuser } from './user.model';


@State<currentuser>({
    name: 'user',
    defaults : {
      user : null
    }
})
export class AuthState {
    
    @Selector()
    static id(state: currentuser): string | null {
      return state.user.id.toString();
    }
  
    @Selector()
    static isAuthenticated(state: currentuser): boolean {
      return !!state.user.id;
    }
  
    constructor(private authService: AuthService) {}
  
    @Action(AddUser)
    AddUser(state: StateContext<currentuser>, action: AddUser) {
      return this.authService.login(action.payload.username,action.payload.password)
      .pipe(
        tap((user) => {
          state.patchState({
              user : user
          });
        })
      );
    }
  
    @Action(RemoveUser)
    RemoveUser(state: StateContext<currentuser>) {
      return this.authService.logout().pipe(
        tap(() => {
          state.setState({
            user : null
          });
        })
      );
    }
  }