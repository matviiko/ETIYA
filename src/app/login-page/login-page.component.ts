import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';
import { UsersService } from '../shared/services/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]],
    });
  }

  submit(): void {
    this.usersService.getAllUsers().subscribe(users => {
      const result = users.find(
        user => user.email === this.form.value.email && user.password === this.form.value.password
      );
      this.authService.token = !!result;
      if (result) {
        this.form.reset();
        this.router.navigate(['/user', result.id]);
      } else {
        this.form.reset();
        this.router.navigate(['/create']);
      }
    });
  }
}
