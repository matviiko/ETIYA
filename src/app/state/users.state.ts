import { User } from '../shared/interfaces';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { GetAllUsers, RemoveUser, SaveUsers } from '../actions/users.actions';
import { UsersService } from '../shared/services/users.service';
import { Injectable } from '@angular/core';
import { UsersStateModel } from './Model';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';


@State<UsersStateModel>({
  name: 'users',
  defaults: {
    users: [],
  },
})

@Injectable()
export class UsersState {
  constructor(private usersService: UsersService) {
  }

  @Selector()
  static getUsers(state: UsersStateModel): Array<User> | undefined {
    return state.users;
  }

  @Action(GetAllUsers)
  getAllUsers(ctx: StateContext<UsersStateModel>): Observable<Array<User>> {
    return this.usersService.getAllUsers()
      .pipe(tap(users => ctx.patchState({ users })));
  }

  @Action(RemoveUser)
  removeUser({ getState, patchState }: StateContext<UsersStateModel>, payload: RemoveUser): void {
    let { users } = getState();
    this.usersService.remove(payload.id).subscribe(() => {
      users = users.filter(user => user.id !== payload.id);
      patchState({ users });
    });
  }

  @Action(SaveUsers)
  saveUsers({ getState, patchState }: StateContext<UsersStateModel>, payload: SaveUsers): Observable<User> {
    const { users } = getState();
    const item = { ...payload.user };
    const index = users.findIndex(u => u.id === payload.user.id);
    users[index] = item;
    return this.usersService.update(payload.user).pipe(tap(() => patchState({ users })));
  }

}

