import { User } from '../shared/interfaces';

export class GetAllUsers {
  static readonly type = '[USERS API] GetAllUsers';
  static readonly desc = 'get all users from api';
}

export class RemoveUser {
  static  readonly type = '[USERS API] RemoveUser';
  static readonly desc = 'remove user by id';
  constructor(public id: number) {
  }
}

export class SaveUsers {
  static readonly type = '[USERS API] SaveUsers';
  static readonly desc = 'save user by id';
  constructor(public user: User) {
  }
}
