import { User } from '../shared/interfaces';

export class GetAllUsers {
  static readonly type = '[USERS API] GetAllUsers';
}

export class RemoveUser {
  static  readonly type = '[USERS API] RemoveUser';
  constructor(public id: number) {
  }
}

export class SaveUsers {
  static readonly type = '[USERS API] SaveUsers';
  constructor(public user: User) {
  }
}
