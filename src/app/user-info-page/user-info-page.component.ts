import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { UsersService } from '../shared/services/users.service';
import { switchMap } from 'rxjs/operators';
import { User } from '../shared/interfaces';

@Component({
  selector: 'app-user-info-page',
  templateUrl: './user-info-page.component.html',
  styleUrls: ['./user-info-page.component.scss'],
})
export class UserInfoPageComponent implements OnInit {
  user!: User;

  constructor(private activatedRoute: ActivatedRoute, private usersService: UsersService) {}

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        switchMap((params: Params) => {
          return this.usersService.getUsersById(+params.id);
        })
      )
      .subscribe(user => (this.user = user));
  }
}
