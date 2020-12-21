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
  constructor(private usersService: UsersService) {}

  @Selector()
  static getUsers({ users }: UsersStateModel): Array<User> | undefined {
    return users;
  }

  @Action(GetAllUsers)
  getAllUsers(ctx: StateContext<UsersStateModel>): Observable<Array<User>> {
    return this.usersService.getAllUsers().pipe(tap(users => ctx.patchState({ users })));
  }

  @Action(RemoveUser)
  removeUser(ctx: StateContext<UsersStateModel>, payload: RemoveUser): void {
    this.usersService.remove(payload.id).subscribe();
  }

  @Action(SaveUsers)
  saveUsers({ getState, patchState }: StateContext<UsersStateModel>, payload: SaveUsers): Observable<User> {
    return this.usersService
      .update(payload.user)
      .pipe(tap(() => this.usersService.getAllUsers().pipe(tap(users => patchState({ users })))));
  }
}
