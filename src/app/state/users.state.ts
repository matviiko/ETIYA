import { User } from '../shared/interfaces';
import {State} from '@ngxs/store';

export class UsersStateModel {
  users: Array<User>;
}

@State<UsersStateModel>({

})
